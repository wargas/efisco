import { Queue, Worker } from "bullmq";
import { ServiceDetalhe } from "./service-detalhe";
import { prisma } from "./prisma";
import { cookieStore } from "./cookie-store";
import { EFisco } from "./Efisco";

const queueName = 'queue-login';

export const queueLogin = new Queue(queueName, {
    connection: { url: 'redis://default:bublktmzwqbsa98k@145.223.92.90:6379' }
})

export const workerLogin = new Worker(queueName, async job => {
    job.log('removendo cookies')
    await cookieStore.removeAllCookies()

    const login = await EFisco.factory().login();

    job.log('Logado como: '+login.nome)

}, { autorun: false, connection: { url: 'redis://default:bublktmzwqbsa98k@145.223.92.90:6379' } })