import { EFisco } from "./Efisco";

export class ServiceProcessosPorAsssunto extends EFisco {

    static override factory() {
        return new ServiceProcessosPorAsssunto()
    }

    async setPeriodo(inicio: string, fim: string) {
        await this.navigateTo('sfi_adm_prt/PRConsultarProtocolosCadastradosPorAssunto', '700215');

        var data: any = {
            ...this.formFields,
            evento: 'processarFiltroConsulta',
            IdUnidadeOrganizacional: '1116',
            IdUnidadeOrganizacionalAtual: '1116',
            InPesquisarApenasAssuntoPrincipal: 'S',
            DtInicioPeriodo: inicio,
            nmUnidadeOrganizacional: 'GERÊNCIA DO ICD',
            DtFinalPeriodo: fim,
            NmUnidadeOrganizacionalAtual: 'GERÊNCIA DO ICD',
            qt_registros_pagina: '20'
        }



        await this.sendData('sfi_adm_prt/PRConsultarProtocolosCadastradosPorAssunto', data)
    }

    async getProtocolos() {

        const inicio = (this.formFields['DtInicioPeriodo'] ?? '').replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
        const fim = (this.formFields['DtFinalPeriodo'] ?? '').replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");

        const data = {
            ...this.formFields,
            evento: 'exibirProtocolos',
            chave_primaria: `1511[[*]]${inicio}[[*]]${fim}[[*]]P`
        }

        console.log()
        await this.sendData('sfi_adm_prt/PRConsultarProtocolosCadastradosPorAssunto', data)
    }

    async gotoPage(page:number) {

        if(page == this.currentPage) return;

        const data = {
            ...this.formFields,
            evento: 'processarPaginacaoConsulta',
            nu_faixa_paginacao: String(page)
        }

        await this.sendData('sfi_adm_prt/PRConsultarProtocolosCadastradosPorAssunto', data)
    }

    get currentPage() {
        const link = this.document.querySelector('.paginas #div_interno a:not(.linkpaginacao)')

        return parseInt(link?.textContent ?? '')
    }

    get countPages() {
        const links = this.document.querySelectorAll('.paginas #div_interno a')


        return links.length;
    }

    get lista() {
        const rows = this.document.querySelectorAll('#table_tabeladados tr');


        return Array.from(rows).filter((_, i) => i > 0).map(row => {
            const cells = row.querySelectorAll('td')

            return {
                processo: cells[1]?.textContent.trim(),
                assunto: cells[2]?.textContent,
                data_criacao: cells[6]?.textContent,
                situacao: cells[5]?.textContent,
            }
        })
    }


}