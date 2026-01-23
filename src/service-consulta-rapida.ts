import { EFisco } from "./Efisco";

export class ServiceConsultaRapida extends EFisco {

    static override  factory() {
        return new ServiceConsultaRapida()
    }

    async busca(codigo_destinatario: string) {
        await this.navigateTo('sfi_adm_prt/PRConsultaRapidaProtocolo', '700219')

        await this.sendData('sfi_adm_prt/PRConsultaRapidaProtocolo', {
            ...this.formFields,
            evento: 'processarFiltroConsulta',
            CdDestinatario: codigo_destinatario,
            qt_registros_pagina: '9999'
        })
    }

    get lista() {
        const rows = this.document.querySelectorAll('#table_tabeladados tr+tr');

        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td')

            return {
                numero: cells[0]?.textContent!,
            }
        })

    }

}