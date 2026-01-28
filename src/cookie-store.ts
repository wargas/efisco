import {CookieJar} from 'tough-cookie'
import FileCookieStore from 'tough-cookie-file-store'
import path from 'path'

const cookiePath = path.join(process.cwd(), 'cookies.json')

export const cookieStore = new CookieJar(new FileCookieStore(cookiePath));