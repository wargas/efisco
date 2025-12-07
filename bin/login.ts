import { EFisco } from "../src/Efisco";

const efisco = EFisco.factory();

await efisco.login();

process.exit(0)