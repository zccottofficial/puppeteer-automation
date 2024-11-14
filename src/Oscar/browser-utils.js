const puppeteer = require('puppeteer');

async function createBrowser(extensionPath) {
  return await puppeteer.launch({
    headless: false,
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

async function handleDialog(page, callback) {
  page.on('dialog', async (dialog) => {
    console.log(`Dialog detected: ${dialog.message()}`);
    await callback(dialog);
  });
}

async function waitForElement(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout });
    console.log(`Element ${selector} found`);
    return true;
  } catch (error) {
    console.error(`Failed to find element ${selector}: ${error.message}`);
    return false;
  }
}

module.exports = { createBrowser, handleDialog, waitForElement };
