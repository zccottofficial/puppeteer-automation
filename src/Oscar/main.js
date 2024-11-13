const CONFIG = require('./config');
const BrowserManager = require('./browser-utils');
const LoginManager = require('./login');

class AppointmentAutomation {
  #browser;
  #page;

  async initialize() {
    this.#browser = await BrowserManager.createBrowser(CONFIG.extensionPath);
    this.#page = await this.#browser.newPage();
  }

  async run() {
    try {
      await this.initialize();
      await LoginManager.login(this.#page, CONFIG.credentials);
      await this.#performAppointmentActions();
    } catch (error) {
      console.error("Automation failed:", error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  async cleanup() {
    if (this.#browser) {
      await this.#browser.close();
      console.log("Browser closed");
    }
  }

  async #performAppointmentActions() {
    // Implement appointment-specific logic here
  }
}

// Usage
(async () => {
  const automation = new AppointmentAutomation();
  try {
    await automation.run();
  } catch (error) {
    process.exit(1);
  }
})();
