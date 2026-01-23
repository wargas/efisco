import { cookieStore } from "../src/cookie-store"
import { prisma } from "../src/prisma"
import { ServiceConsultaRapida } from "../src/service-consulta-rapida"
import { ServiceBuscaUsuario } from "../src/service-usuario"

const usuarios = [
    "ADAM NOEL SOUZA",
    "CLEITON LOPES DE CARVALHO",
    "LUIS FELLIPE DE MESQUITA ALCANTARA",
    "OTAVIO BRUNO SILVEIRA SALES",
    "FILIPE NERY MACIEL LINS",
    "THIAGO ROCHA LIMA SANTOS",
    "EDUARDO FARIAS TORRES",
    "BRUNO STENIO DA SILVA",
    "WARGAS DELMONDES TEIXEIRA",
    "GLAUCIA RIBAS DA SILVA",
    "JOSE MATHEUS BEZERRA DOS SANTOS AMORIM",
    "FILIPE GALVES BONFIM",
    "YURI CASTELLO BRANCO BRITO",
    "LUCAS RIBEIRO MACEDO",
    "RODRIGO DE OLIVEIRA CAVALCANTE",
    "TULIO MADSON ARRUDA COELHO FILHO",
    "JOAO PEDRO SALES MONTEIRO",
    "GUILHERME MACIEL DE ARAUJO",
    "PAULO VICTOR DE ALBUQUERQUE MARQUES",
    "MARCOS ALVERNE LEITAO DUARTE FERNANDES",
    "ARSONVAL MARANHAO PESSOA NAZARETH",
    "HORACIO ROQUE HENRIQUES",
    "LEONAN JOSE PAIVA FERNANDES",
    "CAIO ROCHA TEBERGE",
    "RAFAEL HUMMEL DE ALMEIDA",
]

const serviceUsuario = await ServiceBuscaUsuario.factory()
const serviceConsulta = await ServiceConsultaRapida.factory()

await cookieStore.removeAllCookies()

await serviceUsuario.login()

for await (var item of usuarios) {

    await serviceUsuario.start()
    await serviceUsuario.busca(item)

    for await (var usuario of serviceUsuario.lista) {

        await serviceConsulta.start()

        await serviceConsulta.busca(usuario.codigo)

        const processos = serviceConsulta.lista

        const data = { ...usuario, processos: processos.length }

        const insert = await prisma.usuario.upsert({
            where: { codigo: usuario.codigo },
            create: data,
            update: data,
        })

        console.log(insert.nome, processos.length)
    }
}
