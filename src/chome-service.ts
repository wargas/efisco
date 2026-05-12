import type { Page, Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import { efiscoClient } from "./client";

export class ChromeService {
  browser!: Browser;
  page!: Page;

  static async factory(): Promise<ChromeService> {
    const instance = new ChromeService();

    instance.browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: false,
      defaultViewport: null,
    });
    instance.page = await instance.browser.newPage();

    return instance;
  }
}
