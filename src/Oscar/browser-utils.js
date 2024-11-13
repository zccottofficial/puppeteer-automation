const puppeteer = require('puppeteer');

class BrowserManager {
  static async createBrowser(extensionPath) {
    return await puppeteer.launch({
      headless: true,
      timeout: 1200000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--disable-popup-blocking',
        '--disable-notifications',
        '--disable-infobars'
      ]
    });
  }

  static async handleDialog(page, callback) {
    page.on('dialog', async dialog => {
      console.log(`Dialog detected: ${dialog.message()}`);
      await callback(dialog);
    });
  }

  static async waitForElement(page, selector, timeout) {
    try {
      await page.waitForSelector(selector, { timeout });
      console.log(`Element ${selector} found`);
      return true;
    } catch (error) {
      console.error(`Failed to find element ${selector}: ${error.message}`);
      return false;
    }
  }
}

module.exports = BrowserManager;
