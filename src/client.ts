import got, { type HttpsOptions } from "got";
import { readFileSync } from 'fs';
import {CookieJar} from 'tough-cookie'
import FileCookieStore from 'tough-cookie-file-store'


const https: HttpsOptions = {
    // pfx: readFileSync(`./certificados/CERTIFICADO-WARGAS.pfx`),
    certificate: readFileSync(`./certificados/chain.crt`),
    key: readFileSync(`./certificados/chave.key`),
    passphrase: '600130',
}

export const efiscoClient = got.extend({
    prefixUrl: 'https://efiscoi.sefaz.pe.gov.br',
    https,
    cookieJar: new CookieJar(new FileCookieStore('cookies.json')),
    
})