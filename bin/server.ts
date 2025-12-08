import { Hono } from "hono";
import { EFisco } from "../src/Efisco";
import { prisma } from "../src/prisma";
import { authMiddleware } from "../src/middleware";
const efisco = EFisco.factory();

const app = new Hono();

app.get('/status', authMiddleware, async ctx => {
    await efisco.start();

    return Response.json({ status: 'ok', user: efisco.user });
})

app.get('/list', authMiddleware, async ctx => {
    const processos = await prisma.processo.findMany();

    return Response.json(processos)
})

app.post('/insert', authMiddleware, async (ctx) => {
    const data: any = await ctx.req.json();

    const result = await prisma.processo.create({
        data: {
            id: data.numero_protocolo,
            numero_protocolo: data.numero_protocolo,
            data_registro: '',
            natureza: '',
            interessado: '',
            situacao: '',
            portador: '',
            valorImposto: 0
        }
    })

    return Response.json(result);
})

export default app;
