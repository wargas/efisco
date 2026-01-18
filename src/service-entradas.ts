import { EFisco } from "./Efisco";

export class ServiceEntradas extends EFisco {

    static override factory() {
        return new ServiceEntradas()
    }

    async setIntervalo(inicio: string, fim: string) {
        {
            await this.start();
            await this.navigateTo('sfi_trb_gcd/PRManterProcessoICD', '190600');

            await this.sendData('sfi_trb_gcd/PRManterProcessoICD', {
                ...this.formFields,
                evento: 'processarFiltroConsulta',
                DtRegistroInicial: inicio,
                DtRegistroFinal: fim,
                qt_registros_pagina: '99999'
            })
        }
    }

    get lista() {
        const rows = this.document.querySelectorAll('#table_tabeladados tr+tr');

        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td')

            return {
                data_registro: String(cells[1]?.textContent?.trim()).replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"),
                numero_protocolo: cells[2]?.textContent?.trim(),
                natureza: cells[3]?.textContent?.trim(),
                interessado: cells[4]?.textContent?.trim(),
                situacao: cells[5]?.textContent?.trim(),
                portador: cells[6]?.textContent?.trim(),
                valorImposto: parseFloat(cells[7]?.textContent?.trim()?.replaceAll('.', '').replace(',', '.') || '0'),
            }
        })

    }
}