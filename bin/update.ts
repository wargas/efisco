import { EFisco } from "../src/Efisco";
import { prisma } from "../src/prisma";

const processos = await prisma.processo.findMany();
const efisco = EFisco.factory()
await efisco.start();

for await(var processo of processos) {
    const data = await efisco.cadastroProcessoICD(processo.id);

    if(data.natureza) {
        await prisma.processo.update({
            where: {id: processo.id},
            data: {
                natureza: data.natureza,
                interessado: data.interessado,
                situacao: data.situacao,
                portador: data.portador,
                valorImposto: data.valorImposto,
                data_registro: data.data_registro
            }
        })

        console.log(`Atualizado: ${processo.id}`)
    }
}

process.exit(0)