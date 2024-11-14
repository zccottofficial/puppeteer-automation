// login.js
const puppeteer = require('puppeteer');

async function launchBrowser(extensionPath) {
  return await puppeteer.launch({
    headless: true,
    timeout: 1200000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--disable-popup-blocking', // Disable popup blocking, which can cause popups in some cases
      '--disable-notifications',  // Disable notifications
      '--disable-infobars', // Prevents "Chrome is being controlled by automated software" message
    ],
  });
}

async function login(page, { username, password, pin }) {
  const loginUrl = 'https://oscaremr.quipohealth.com/oscar/index.jsp';

  await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log("Target URL loaded. Waiting for input fields...");

  const fillInput = async (selector, value) => {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.type(selector, value);
    console.log(`Typed '${value}' into the field: ${selector}`);
  };

  await fillInput('#username', username);
  await fillInput('#password2', password);
  await fillInput('#pin2', pin);

  await page.waitForSelector("button[name='submit']", { timeout: 10000 });
  page.click("button[name='submit']");
  console.log("Clicked the submit button.");

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
  console.log("Navigated after clicking submit.");
}

module.exports = { launchBrowser, login };
