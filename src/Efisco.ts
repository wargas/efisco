import type { Got } from "got";
import { efiscoClient } from "./client";
import { JSDOM } from 'jsdom'

export class EFisco {

    _html = "";

    set html(value: string) {
        this._html = value;
    }

    get html() {
        return Buffer.from(this._html).toString('utf-8');
    }

    get document() {
        return new JSDOM(this.html).window.document;
    }

    get formFields() {
        const inputs = this.document.querySelectorAll<HTMLInputElement>('form input');

        const data: Record<string, string> = {}

        Array.from(inputs).filter(i => !!i.name).forEach(input => {
            const { name, value } = input;

            data[name] = value
        })

        return data;
    }

    static factory() {
        const instance = new EFisco;

        return instance;
    }

    async sendData(path: string, data: Record<string, string>) {
        const response = await efiscoClient.post(path, {
            form: data,
            responseType: 'buffer',
            resolveBodyOnly: true,
        })

        this.html = Buffer.from(response.toString('latin1')).toString('utf-8');
    }

    async start() {
        const startPage = await efiscoClient.get(`sfi_com_sca/PRMontarMenuAcesso`);

        this.html = startPage.body;
    }

    get user() {
        const usuario = this.document.querySelector('#a_usuario_span_texto')
        return {
            nome: usuario?.textContent
        };
    }

    async login() {
        await this.start();

        if(this.user.nome) {
            return this.user;
        }

        await this.sendData('sfi_com_sca/PRGerenciarLoginUsuario', {
            ...this.formFields,
            evento: 'tratarLoginCertificado'
        });

        return this.user;

    }

    async navigateTo(path: string, menu: string) {

        await this.sendData(path, {
            ...this.formFields,
            cd_menu: menu
        });
    }

    async cadastroProcessoICD(numero: string) {
        await this.start();
        await this.navigateTo('sfi_trb_gcd/PRManterProcessoICD', '190600');

        await this.sendData('sfi_trb_gcd/PRManterProcessoICD', {
            ...this.formFields,
            evento: 'processarFiltroConsulta',
            NuProtocoloICD: numero
        })

        const dados = this.document.querySelectorAll('#table_tabeladados tr+tr td');

        return {
            data_registro: dados[1]?.textContent?.trim(),
            numero_protocolo: dados[2]?.textContent?.trim(),
            natureza: dados[3]?.textContent?.trim(),
            interessado: dados[4]?.textContent?.trim(),
            situacao: dados[5]?.textContent?.trim(),
            portador: dados[6]?.textContent?.trim(),
            valorImposto: parseFloat(dados[7]?.textContent?.trim()?.replaceAll('.', '').replace(',', '.') || '0'),
        }
    }

}