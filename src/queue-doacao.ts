import { Queue, Worker } from "bullmq";
import { ServiceDetalhe } from "./service-detalhe";
import { prisma } from "./prisma";

const queueName = 'queue-doacao';

export const queueDoacao = new Queue(queueName, {
    connection: { url: 'redis://default:bublktmzwqbsa98k@145.223.92.90:6379' }
})

export const workerDoacao = new Worker<string>(queueName, async job => {
    job.log('iniciando')

    const service = ServiceDetalhe.factory()

    await service.start()

    const processo = await prisma.processo.findFirst({
        where: { id: job.data }
    })

    await service.setProtocolo(processo?.numero_protocolo!);

    const item = service.lista[0]!

    const detalhe = await service.detalhe(item.chave)
    const doadores = await service.transmitente()
    const adquirentes = await service.adquirente()
    const bens = await service.bens()

    job.log(`dados obtidos do processo: ${detalhe.protocolo}`)


    await prisma.$transaction(async (tx) => {
        await tx.processo.update({
            where: { id: detalhe.protocolo },
            data: { data_doacao: detalhe.data_doacao }
        })

        for await (var doador of doadores) {
            await tx.doadores.create({
                data: {
                    id: `${detalhe.protocolo}:${doador.cpf}`,
                    cpf: doador.cpf,
                    protocolo: detalhe.protocolo
                }
            })
        }

        for await (var adquirente of adquirentes) {
            await tx.adquirente.create({
                data: {
                    id: `${detalhe.protocolo}:${adquirente.cpf}`,
                    cpf: adquirente.cpf,
                    protocolo: detalhe.protocolo,
                    nome: adquirente.nome,
                    quinhao: adquirente.quinhao,
                }
            })
        }

        for await (var bem of bens) {
            await tx.bens.create({
                data: {
                    id: `${detalhe.protocolo}:${bens.indexOf(bem) + 1}`,
                    tipo: bem.tipo,
                    classificao: bem.classificao,
                    descricao: bem.descricao,
                    protocolo: detalhe.protocolo,
                    valor_declarado: bem.valor_declarado
                }
            })
        }
        job.log(`dados inseridos do processo: ${detalhe.protocolo}`)

    })



}, { autorun: false, connection: { url: 'redis://default:bublktmzwqbsa98k@145.223.92.90:6379' } })