import { ServiceDemandas } from "../src/service-demandas";
const service = ServiceDemandas.factory();
await service.login();
await service.busca();

const demandas = service.listaAcoes();

for await (var item of demandas) {
  await service.detalhaAcao(item.chave);

  const processos = service.listaProcessos();

  if (processos.length == 0) continue;

  for await (var processo of processos) {
    console.log(processo);
    await service.detalhaProcesso(processo);

    process.exit(0);
  }
}
