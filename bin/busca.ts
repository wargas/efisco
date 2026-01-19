import { EFisco } from '../src/Efisco'
import { prisma } from '../src/prisma'
import { ServiceProcessosPorAsssunto } from '../src/service-assunto';
import { appendFileSync } from 'fs'
import { ServiceEntradas } from '../src/service-entradas';
import { eachDayOfInterval, formatDate } from 'date-fns'
import { $ } from 'bun';


const service = ServiceEntradas.factory();

await $`rm -f cookies.json`
await service.start();

await service.login();

console.log('Usuário logado:', service.user.nome);


const start = new Date('2025-01-02');
const end = new Date()

const days = eachDayOfInterval({ start, end })

for await (var day of days.reverse()) {
    const formated = formatDate(day, 'dd/MM/yyyy');
    await service.setIntervalo(formated, formated)

    for await (const item of service.lista) {

        const processo = await prisma.processo.upsert({
            where: { id: item.numero_protocolo },
            create: {
                id: item.numero_protocolo!,
                data_registro: item.data_registro!,
                numero_protocolo: item.numero_protocolo!,
                natureza: item.natureza!,
                interessado: item.interessado!,
                situacao: item.situacao!,
                portador: item.portador!,
                valor_imposto: item.valorImposto!,
            },
            update: {
                data_registro: item.data_registro!,
                numero_protocolo: item.numero_protocolo!,
                natureza: item.natureza!,
                interessado: item.interessado!,
                situacao: item.situacao!,
                portador: item.portador!,
                valor_imposto: item.valorImposto!,
            }
        })

        if(processo.data_lancamento == null && !['CANCELADO', 'AGUARDANDO AVALIAÇÃO', 'PRE - CADASTRADO', 'EM EXIGÊNCIA', 'AGUARD. ANÁLISE ISENÇÃO/NÃO INCIDÊNCIA'].includes(processo.situacao)) {
            try {
                    const data = await service.cadastroProcessoICD(processo.id);
                    const historico = await service.consultaHistorico(processo.id);
                
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
                
                        for await (var h of historico) {
                            const id = `${processo.id}:${h.data}:${h.situacao}`;
                
                            await prisma.historico.upsert({
                                where: { id },
                                create: {
                                    id,
                                    processoId: processo.id,
                                    data: h.data,
                                    usuario: h.usuario!,
                                    situacao: h.situacao!
                                },
                                update: {}
                            })
                        }
                                        
                        console.log(`Atualizado: ${processo.id}`)

                        if(process.env.WEBHOOK_URL) {
                            await fetch(process.env.WEBHOOK_URL)
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
        }

    }

    console.log(formated, service.lista.length)
}