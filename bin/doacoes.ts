import { prisma } from "../src/prisma";
import { ServiceDetalhe } from "../src/service-detalhe";

const service = ServiceDetalhe.factory()

while (true) {

    await service.start();


    const processo = await prisma.processo.findFirst({
        where: { natureza: 'DOAÇÃO', data_doacao: null }
    })

    await service.setProtocolo(processo?.numero_protocolo!);

    const item = service.lista[0]!

    const detalhe = await service.detalhe(item.chave)
    const doadores = await service.transmitente()
    const adquirentes = await service.adquirente()
    const bens = await service.bens()

    
    await prisma.$transaction(async (tx) => {
        await tx.processo.update({
            where: { id: detalhe.protocolo },
            data: { data_doacao: detalhe.data_doacao }
        })

        for await (var doador of doadores) {
            await tx.doadores.create({
                data: {
                    id: `${detalhe.protocolo}:${doador.cpf}`,
                    cpf: doador.cpf,
                    protocolo: detalhe.protocolo
                }
            })
        }

        for await (var adquirente of adquirentes) {
            await tx.adquirente.create({
                data: {
                    id: `${detalhe.protocolo}:${adquirente.cpf}`,
                    cpf: adquirente.cpf,
                    protocolo: detalhe.protocolo,
                    nome: adquirente.nome,
                    quinhao: adquirente.quinhao,
                }
            })
        }

        for await (var bem of bens) {
            await tx.bens.create({
                data: {
                    id: `${detalhe.protocolo}:${bens.indexOf(bem) + 1}`,
                    tipo: bem.tipo,
                    classificao: bem.classificao,
                    descricao: bem.descricao,
                    protocolo: detalhe.protocolo,
                    valor_declarado: bem.valor_declarado
                }
            })
        }
        console.log(detalhe.protocolo)

    })


}