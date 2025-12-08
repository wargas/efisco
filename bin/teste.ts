import { EFisco } from '../src/Efisco'
import { prisma } from '../src/prisma'

const efisco = EFisco.factory();

await efisco.start();

const processo = "2025.000011007650-15"

await efisco.cadastroProcessoICD(processo)

const data = await efisco.consultaHistorico(processo)

console.log(data)