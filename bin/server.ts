import { EFisco } from "../src/Efisco";

const server = Bun.serve({
    routes: {
        '/processoICD': async (request) => {
            const { numero } = await request.json();

            console.log(`Processing ICD for number: ${numero}`);

            const efisco = EFisco.factory();
            const processo = await efisco.cadastroProcessoICD(numero);
            return Response.json({ success: true, processo });
        }
    }
});

console.log(`Server running at ${server.url}`);