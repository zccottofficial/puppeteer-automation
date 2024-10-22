const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    console.log("Launching browser...");

    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      timeout: 120000, // Increase timeout if needed
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-extensions-except=C:\\Users\\apr32\\OneDrive\\Desktop\\my-extension-testing-project\\src\\extensions\\build', // Use the full path
        '--load-extension=C:\\Users\\apr32\\OneDrive\\Desktop\\my-extension-testing-project\\src\\extensions\\build' // Use the full path
      ]
    });

    console.log("Browser launched successfully!");
    const page = await browser.newPage();

    console.log("Navigating to Google...");
    await page.goto('https://kasinathanb.vercel.app/', { waitUntil: 'load' });
    console.log("Scribe page loaded successfully!");

    try {
        console.log("Waiting for the element with XPath...");
      // Wait for the element using XPath
      await page.waitForSelector("#github-button", { timeout: 20000 });
      console.log("Found the element with XPath");

      // Take a screenshot
      await page.screenshot({ path: 'google.png' });
      console.log("Screenshot taken");
    } catch (error) {
      console.log("Element not found:", error);
    }

  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the browser if it was launched
    if (browser) {
      await browser.close();
    }
  }
})();
