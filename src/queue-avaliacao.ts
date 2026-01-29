import { Queue, Worker } from "bullmq";
import { ServiceDetalhe } from "./service-detalhe";
import { prisma } from "./prisma";

const queueName = 'queue-avaliacao';

export const queueAvaliacao = new Queue(queueName, {
    connection: { url: 'redis://default:bublktmzwqbsa98k@145.223.92.90:6379' }
})

export const workerAvaliacao = new Worker<string>(queueName, async job => {
    job.log('iniciando')

    const service = ServiceDetalhe.factory()

    await service.start()

    const processo = await prisma.processo.findFirst({
        where: { id: job.data }
    })

    await service.setProtocolo(processo?.numero_protocolo!);

    const item = service.lista[0]!

    const avaliacao = await service.avaliacao(item.chave)

    await prisma.$transaction(async (tx) => {
        for await (var item of avaliacao) {
            await tx.avaliacao.create({
                data: {
                    id: `${item.protocolo}:${avaliacao.indexOf(item)+1}`,
                    tipo: item.tipo,
                    classificao: item.classificacao,
                    descricao: item.descricao,
                    protocolo: item.protocolo,
                    valor_avaliado: item.valor,
                    data: item.data,
                    base_calculo: item.base_calculo
                }
            })
        }

        job.log(`dados inseridos do processo`)

    })



}, { autorun: false, connection: { url: 'redis://default:bublktmzwqbsa98k@145.223.92.90:6379' } })