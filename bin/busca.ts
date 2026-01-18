import { EFisco } from '../src/Efisco'
import { prisma } from '../src/prisma'
import { ServiceProcessosPorAsssunto } from '../src/service-assunto';
import { appendFileSync } from 'fs'
import { ServiceEntradas } from '../src/service-entradas';
import { eachDayOfInterval, formatDate } from 'date-fns'
import { $ } from 'bun';


const service = ServiceEntradas.factory();

await $`rm -f cookies.json`
await service.start();

await service.login();

console.log('Usuário logado:', service.user.nome);


const start = new Date('2025-01-02');
const end = new Date()

const days = eachDayOfInterval({ start, end })

for await (var day of days.reverse()) {
    const formated = formatDate(day, 'dd/MM/yyyy');
    await service.setIntervalo(formated, formated)

    for await (const item of service.lista) {
        await prisma.processo.upsert({
            where: { id: item.numero_protocolo },
            create: {
                id: item.numero_protocolo!,
                data_registro: item.data_registro!,
                numero_protocolo: item.numero_protocolo!,
                natureza: item.natureza!,
                interessado: item.interessado!,
                situacao: item.situacao!,
                portador: item.portador!,
                valor_imposto: item.valorImposto!,
            },
            update: {
                data_registro: item.data_registro!,
                numero_protocolo: item.numero_protocolo!,
                natureza: item.natureza!,
                interessado: item.interessado!,
                situacao: item.situacao!,
                portador: item.portador!,
                valor_imposto: item.valorImposto!,
            }
        })
    }

    console.log(formated, service.lista.length)
}