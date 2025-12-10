import { EFisco } from '../src/Efisco'
import { prisma } from '../src/prisma'

const efisco = EFisco.factory();

await efisco.start();

await efisco.login();

console.log('Usuário logado:', efisco.user);