import { EFisco } from "../src/Efisco";
import { prisma } from "../src/prisma";

const processos = await prisma.processo.findMany();
const efisco = EFisco.factory()
await efisco.start();

for await (var processo of processos) {
    const data = await efisco.cadastroProcessoICD(processo.id);
    const historico = await efisco.consultaHistorico(processo.id);

    if (data.natureza) {

        const historicoLancamento = historico.find(h => h.situacao == 'AGUARDANDO CIÊNCIA')

        let dataLancamento: string | null = null

        if(historicoLancamento) {
            dataLancamento = historicoLancamento.data
        }

        await prisma.processo.update({
            where: { id: processo.id },
            data: {
                natureza: data.natureza,
                interessado: data.interessado,
                situacao: data.situacao,
                portador: data.portador,
                valorImposto: data.valorImposto,
                data_registro: data.data_registro,
                data_lancamento: dataLancamento
            }
        })

        for await (var item of historico) {
            const id = `${processo.id}:${item.data}:${item.situacao}`;

            await prisma.historico.upsert({
                where: { id },
                create: {
                    id,
                    processoId: processo.id,
                    data: item.data,
                    usuario: item.usuario!,
                    situacao: item.situacao!
                },
                update: {}
            })
        }

        console.log(`Atualizado: ${processo.id}`)
    }
}

await fetch(process.env.WEBHOOK_URL!);
process.exit(0)