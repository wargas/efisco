import { EFisco } from "../../src/Efisco";

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

}



const service = await ServiceConsultaRapida.factory()

await service.start()
await service.busca('6997528')

await Bun.write('html/consulta.html', service.html)