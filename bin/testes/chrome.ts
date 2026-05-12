import { ChromeService } from "../../src/chome-service";
import { cookieStore } from "../../src/cookie-store";

const cookies = (await cookieStore.toJSON()?.cookies) ?? [];

const service = await ChromeService.factory();

console.log(cookies);

await service.browser.setCookie(
  ...cookies.map((c) => ({
    name: c.key!,
    value: c.value!,
    domain: String(c.domain),
    path: String(c.path),
  })),
);

// await service.page.goto(
//   "https://efiscoi.sefaz.pe.gov.br/sfi_com_sca/PRMontarMenuAcesso",
// );
