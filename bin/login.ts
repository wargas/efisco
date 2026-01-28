import { EFisco } from "../src/Efisco";

const login = await EFisco.factory().login();

console.log(login)