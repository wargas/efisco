import { cookieStore } from '../../src/cookie-store';
import { ServiceDetalhe } from '../../src/service-detalhe';


const service = ServiceDetalhe.factory()

await cookieStore.removeAllCookies()
await service.start();

await service.login();

await service.setProtocolo('2025.000012123711-08');

for await(var item of service.lista) {
    // const detalhe = await service.detalhe(item.chave)

    const avaliacao = await service.avaliacao(item.chave)
    // const doadores = await service.transmitente()
    // const adquirentes = await service.adquirente()
    // const bens = await service.bens()

    // console.log({
    //     detalhe, doadores, adquirentes, bens
    // })

    await Bun.write('html/data.html', service.html)
}