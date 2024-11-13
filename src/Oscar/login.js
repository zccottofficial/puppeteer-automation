//login.js

const { CONFIG } = require('./config');
const { BrowserManager } = require('./browser-utils');

class LoginManager {
  static async login(page, credentials) {
    await page.goto(CONFIG.urls.login, { 
      waitUntil: 'networkidle2', 
      timeout: CONFIG.timeouts.navigation 
    });

    for (const [field, value] of Object.entries(credentials)) {
      await this.#fillInput(page, CONFIG.selectors.login[field], value);
    }

    await page.click(CONFIG.selectors.login.submit);
    await page.waitForNavigation({ 
      waitUntil: 'networkidle2', 
      timeout: CONFIG.timeouts.navigation 
    });
  }

  static async #fillInput(page, selector, value) {
    await BrowserManager.waitForElement(page, selector, CONFIG.timeouts.element);
    await page.type(selector, value);
    console.log(`Input filled for ${selector}`);
  }
}