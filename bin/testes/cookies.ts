import {CookieJar} from 'tough-cookie'
import FileCookieStore from 'tough-cookie-file-store'

const cookies = new CookieJar(new FileCookieStore('cookies.json'));

console.log(cookies.removeAllCookiesSync())