import { prisma } from "../../src/prisma";
import { queueAvaliacao } from "../../src/queue-avaliacao";
import { queueDoacao } from "../../src/queue-doacao";

const items = await prisma.processo.findMany({
    where: { natureza: 'DOAÇÃO' }
})

for await (var item of items) {
    await queueAvaliacao.add(item.id, item.id);
}

process.exit(0)