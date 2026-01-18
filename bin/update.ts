import { $ } from "bun";
import { EFisco } from "../src/Efisco";
import { prisma } from "../src/prisma";

const processos = await prisma.processo.findMany({
    where: {
        data_lancamento: null,
        situacao: { notIn: ['CANCELADO', 'AGUARDANDO AVALIAÇÃO', 'PRE - CADASTRADO'] }
    }
});

await $`rm -f cookies.json`

console.log(processos.length)

const efisco = EFisco.factory()
await efisco.start();
await efisco.login();

for await (var processo of processos) {
    try {
        const data = await efisco.cadastroProcessoICD(processo.id);
        const historico = await efisco.consultaHistorico(processo.id);
    
        if (data.natureza) {
    
            const historicoLancamento = historico.find(h => h.situacao == 'AGUARDANDO CIÊNCIA' || h.situacao == 'ISENÇÃO E NÃO INCIDÊNCIA')
    
            let dataLancamento: string | null = null
            let usuarioLancamento: string | null = null
    
            if (historicoLancamento) {
                dataLancamento = historicoLancamento.data
                usuarioLancamento = historicoLancamento.usuario!
            }
    
            await prisma.processo.update({
                where: { id: processo.id },
                data: {
                    natureza: data.natureza,
                    interessado: data.interessado,
                    situacao: data.situacao,
                    portador: data.portador,
                    valor_imposto: data.valorImposto,
                    data_registro: data.data_registro,
                    data_lancamento: dataLancamento,
                    usuario_lancamento: usuarioLancamento
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
    
            console.log(`Atualizado: ${processo.id} [${processos.indexOf(processo)+1} de ${processos.length}]`)
        }
    } catch (error) {
        console.log(error)
    }
}

