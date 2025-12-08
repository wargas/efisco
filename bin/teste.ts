import data from '../data/processos.json'
import { prisma } from '../src/prisma'

const total = await prisma.processo.groupBy({
    by: ['natureza'],
    _sum: { valorImposto: true },
    _count: { natureza: true },
    where: { valorImposto: { gt: 0 } }
})

console.log(total)