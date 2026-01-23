import { EFisco } from "./Efisco"

export class ServiceBuscaUsuario extends EFisco {

    static override  factory() {
        return new ServiceBuscaUsuario()
    }

    async busca(nome: string) {
        await this.navigateTo('sfi_com_sca/PRConsultarUsuario', '700219')

        const data = {
            ...this.formFields,
            evento: 'processarFiltroConsulta',
            nao_utilizar_id_contexto_sessao: 'true',
            NmUsuario: nome,
            CdTipoUsuario: '1',
            qt_registros_pagina: '9999'
        } as any

        delete data['btt_fechar'];
        delete data['btt_selecionar'];

        await this.sendData('sfi_com_sca/PRConsultarUsuario', data)
    }

    get lista() {
        const rows = this.document.querySelectorAll('#table_tabeladados tr+tr');

        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td')

            return {
                codigo: cells[1]?.textContent!,
                nome: cells[2]?.textContent!,
                cpf: cells[3]?.textContent!,
            }
        })

    }

}


