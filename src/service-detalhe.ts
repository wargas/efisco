import { EFisco } from "./Efisco";

export class ServiceDetalhe extends EFisco {

    static override factory() {
        return new ServiceDetalhe()
    }

    async setProtocolo(protocolo: string) {
        {
            await this.start();
            await this.navigateTo('sfi_trb_gcd/PRManterProcessoICD', '190600');

            await this.sendData('sfi_trb_gcd/PRManterProcessoICD', {
                ...this.formFields,
                evento: 'processarFiltroConsulta',
                NuProtocoloICD: protocolo
            })
        }
    }

    async detalhe(chave:string) {
        await this.sendData('sfi_trb_gcd/PRManterProcessoICD', {
            ...this.formFields,
            chave_primaria: chave,
            evento: 'exibirDetalhamentoConsulta',
        })

        const dataDoacao = this.document.querySelector('[name=DtAberturaProcesso_Doacao]');
        const protocolo = this.document.querySelector('[name=NuProtocoloICD]');
        

        return {
            data_doacao: dataDoacao?.getAttribute('value')!,
            protocolo: protocolo?.getAttribute('value')!
                .replace(/\D/g, "")
                .replace(/(\d{4})(\d{12})(\d{2})/, "$1.$2-$3")!,
        }
    }

    async transmitente() {
        const data:any = {
            ...this.formFields,
            NuProtocoloICD: this.formFields['NuProtocoloICD']!.replaceAll(/\D/g, ""),
            evento: 'exibirFiltroConsulta',
        }

        delete data['btt_encerrarsessao']

        await this.sendData('sfi_trb_gcd/PRManterTransmitente', data)

        const rows = this.document.querySelectorAll('#table_tabeladados tr+tr');

        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td')

            return {
                nome: cells[1]?.textContent?.trim()!,
                cpf: cells[2]?.textContent?.trim()!,               
            }
        })
    }

    async adquirente() {
        const data:any = {
            ...this.formFields,
            NuProtocoloICD: this.formFields['NuProtocoloICD']!.replaceAll(/\D/g, ""),
            evento: 'exibirFiltroConsulta',
        }

        delete data['btt_encerrarsessao']

        await this.sendData('sfi_trb_gcd/PRManterAdquirente', data)

        const rows = this.document.querySelectorAll('#table_tabeladados tr+tr');

        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td')

            return {
                nome: cells[1]?.textContent?.trim()!,
                cpf: cells[2]?.textContent?.trim()!,               
                email: cells[3]?.textContent?.trim()!,               
                telefone: cells[4]?.textContent?.trim()!,               
                parentesco: cells[5]?.textContent?.trim()!,               
                quinhao: cells[6]?.textContent?.trim()!,               
            }
        })
    }

    async bens() {
        const data:any = {
            ...this.formFields,
            NuProtocoloICD: this.formFields['NuProtocoloICD']!.replaceAll(/\D/g, ""),
            evento: 'exibirFiltroConsulta',
        }

        delete data['btt_encerrarsessao']

        await this.sendData('sfi_trb_gcd/PRManterBem', data)

        const rows = this.document.querySelectorAll('#table_tabeladados tr+tr');

        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td')

            return {
                tipo: cells[1]?.textContent?.trim()!,
                classificao: cells[2]?.textContent?.trim()!,               
                descricao: cells[3]?.textContent?.trim()!,               
                isencao: cells[4]?.textContent?.trim()!,               
                valor_declarado: cells[5]?.textContent?.trim()!,               
                situacao: cells[6]?.textContent?.trim()!,               
            }
        })
    }

    get lista() {
        const rows = this.document.querySelectorAll('#table_tabeladados tr+tr');

        return Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td')
            const input = row.querySelector('input')!

            return {
                chave: input.getAttribute('value')!,
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