import got, { type HttpsOptions } from "got";
import { readFileSync } from 'fs';
import { cookieStore } from "./cookie-store";


const https: HttpsOptions = {
    certificate: readFileSync(process.env.PATH_CERT!),
    key: readFileSync(process.env.PATH_KEY!),
    passphrase: process.env.CERT_PASSWORD!,
}

export const efiscoClient = got.extend({
    prefixUrl: 'https://efiscoi.sefaz.pe.gov.br',
    https,
    cookieJar: cookieStore,
})