import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import fastify from 'fastify'
import { queueDoacao, workerDoacao } from '../src/queue-doacao'
import { queueAvaliacao } from '../src/queue-avaliacao'

const app = fastify()

const adapter = new FastifyAdapter()

createBullBoard({
    queues: [
        new BullMQAdapter(queueDoacao),
        new BullMQAdapter(queueAvaliacao)
    ],
    serverAdapter: adapter
})

adapter.setBasePath('/queues')
app.register(adapter.registerPlugin(), {prefix: '/queues'})

app.listen({port: 3001, host: '0.0.0.0'})

app.server.on('listening', async () => {
    console.log('rodando');
})