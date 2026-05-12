import { EFisco } from "./Efisco";

export class ServiceDemandas extends EFisco {
  static override factory() {
    return new ServiceDemandas();
  }

  async busca() {
    await this.navigateTo(
      "sfi_trb_gaf/PRConsultarDemandaAcaoFiscal",
      "6997528",
    );

    await Bun.write("html/demandas1.html", this.html);

    const data = {
      ...this.formFields,
      evento: "processarFiltroConsulta",
      DtInicioPeriodoGeracaoDemandaAcaoFiscal: "01/01/2025",
      DtFimPeriodoGeracaoDemandaAcaoFiscal: "31/01/2026",
      CdEquipe: "GEAF10",
      CdNaturezaAcaoFiscal: "opcao_todos",
      CdTipoAcaoFiscal: "opcao_todos",
      TpAbordagem: "opcao_todos",
      CdTipoDocumentoContribuinte: "opcao_todos",
      SiDemanda: "opcao_todos",
      InExibirDeferidasAutomaticamente: "N",
      AcoesFiscaisDeNaturezaAutomatica: "N",
      CdOrdenacao: "CONTRIB_NU_INSCRICAO_ESTADUAL",
      AcoesDePostoFiscal: "N",
      CdTipoOrdenacao: "C",
      qt_registros_pagina: "9999",
    } as any;

    await this.sendData("sfi_trb_gaf/PRConsultarDemandaAcaoFiscal", data);

    await Bun.write("html/demandas1.html", this.html);

    // delete data['btt_fechar'];
    // delete data['btt_selecionar'];
  }

  async detalhaAcao(chave: string) {
    await this.sendData("sfi_trb_gaf/PRAdministrarDemandaAcaoFiscal", {
      ...this.formFields,
      // id_contexto_sessao: "3",
      evento: "exibirDetalhamentoRetorno",
      DtInicioPeriodoGeracaoDemandaAcaoFiscal: "01/01/2025",
      DtFimPeriodoGeracaoDemandaAcaoFiscal: "31/01/2026",
      CdEquipe: "GEAF10",
      CdNaturezaAcaoFiscal: "opcao_todos",
      CdTipoAcaoFiscal: "opcao_todos",
      TpAbordagem: "opcao_todos",
      CdTipoDocumentoContribuinte: "opcao_todos",
      SiDemanda: "opcao_todos",
      InExibirDeferidasAutomaticamente: "N",
      AcoesFiscaisDeNaturezaAutomatica: "N",
      CdOrdenacao: "CONTRIB_NU_INSCRICAO_ESTADUAL",
      AcoesDePostoFiscal: "N",
      CdTipoOrdenacao: "C",
      qt_registros_pagina: "9999",
      chave_primaria: chave,
    });

    const protocolo = chave.substring(0, 18);

    await Bun.write(`html/detalhe-${protocolo}.html`, this.html);
  }

  async detalhaProcesso(protocolo: string) {
    console.log(this.formFields);

    await this.sendData("sfi_trb_gaf/PRAdministrarDemandaAcaoFiscal", {
      ...this.formFields,
    });
  }

  listaAcoes() {
    const rows = this.document.querySelectorAll("#table_tabeladados tr+tr");

    return Array.from(rows).map((row) => {
      const cells = row.querySelectorAll("td");

      const input = row.querySelector("input");

      return {
        protocolo: cells[1]?.textContent!.trim(),
        identificao: cells[2]?.textContent!.trim(),
        nome: cells[3]?.textContent!.trim(),
        chave: input?.value!,
      };
    });
  }

  listaProcessos() {
    const links = this.document.querySelectorAll("a");

    return Array.from(links)
      .filter((l) =>
        l.getAttribute("href")?.includes("'exibirDetalhamentoProcesso'"),
      )
      .map((l) => l.textContent);
  }
}
