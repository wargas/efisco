import {CookieJar} from 'tough-cookie'
import FileCookieStore from 'tough-cookie-file-store'

export const cookieStore = new CookieJar(new FileCookieStore('cookies.json'));