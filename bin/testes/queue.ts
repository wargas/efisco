import { prisma } from "../../src/prisma";
import { queueDoacao } from "../../src/queue-doacao";

const items = await prisma.processo.findMany({
    where: { natureza: 'DOAÇÃO', data_doacao: null }
})

for await(var item of items) {
    await queueDoacao.add(item.id, item.id);
}

process.exit(0)