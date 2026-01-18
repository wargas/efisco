import { prisma } from "../src/prisma";

const historico = await prisma.historico.findMany({
    where: { situacao: { in: ['AGUARDANDO CIÊNCIA', 'ISENÇÃO E NÃO INCIDÊNCIA'] } },
    orderBy: { data: 'asc' }
})

for await(var item of historico) {
    await prisma.processo.update({
        where: {id: item.processoId},
        data: { usuario_lancamento: item.usuario }
    })

    process.stdout.write(`\r${historico.indexOf(item)}`)
}