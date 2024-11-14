const { createBrowser } = require('./browser-utils');
const { login } = require('./login');

const EXTENSION_PATH = './src/extensions/build';
const CREDENTIALS = {
  username: 'your_username',
  password: 'your_password',
  pin: 'your_pin'
};

async function runAutomation() {
  let browser;
  try {
    browser = await createBrowser(EXTENSION_PATH);
    const page = await browser.newPage();

    await login(page, CREDENTIALS);
    await performAppointmentActions(page);

  } catch (error) {
    console.error("Automation failed:", error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}

async function performAppointmentActions(page) {
  // Implement appointment-specific actions here
}

runAutomation();
