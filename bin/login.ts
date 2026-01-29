import { cookieStore } from "../src/cookie-store";
import { EFisco } from "../src/Efisco";

await cookieStore.removeAllCookies()

const login = await EFisco.factory().login();

console.log(login)