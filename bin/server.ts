import { EFisco } from "../src/Efisco";
const efisco = EFisco.factory();

const server = Bun.serve({
    routes: {
        '/status': async () => {
            await efisco.start();
           

            return Response.json({ status: 'ok', user: efisco.user });
        },
        '/processoICD': async (request) => {
            const { numero } = await request.json();

            console.log(`Processing ICD for number: ${numero}`);

            
            const processo = await efisco.cadastroProcessoICD(numero);
            return Response.json({ success: true, processo });
        }
    }
});

console.log(`Server running at ${server.url}`);