import { prisma } from "../../src/prisma";
import { queueAvaliacao } from "../../src/queue-avaliacao";
import { queueDoacao } from "../../src/queue-doacao";

const items = await prisma.processo.findMany({
    where: { natureza: 'DOAÇÃO', situacao: { notIn: ['AGUARDANDO AVALIAÇÃO', 'PRE - CADASTRADO', 'CANCELADO']} }
})

await queueAvaliacao.addBulk(items.map(i => {
    return {
        name: 'default',
        data: i.numero_protocolo,
        opts: {
            jobId: i.numero_protocolo
        }
    }
}))

// for await (var item of items) {
//     await queueAvaliacao.add(item.id, item.id);

//     process.stdout.write(`\r${items.indexOf(item)+1} de ${items.length}`)
// }

process.exit(0)