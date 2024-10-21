const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");

  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    timeout: 60000, // Increase timeout if needed
    args: [
      '--no-sandbox', // Uncomment if necessary
      '--disable-setuid-sandbox', // Uncomment if necessary
      '--disable-extensions-except=C:\\Users\\apr32\\OneDrive\\Desktop\\my-extension-testing-project\\src\\extensions\\build', // Use the full path
      '--load-extension=C:\\Users\\apr32\\OneDrive\\Desktop\\my-extension-testing-project\\src\\extensions\\build' // Use the full path
    ]
  });

  const page = await browser.newPage();
  console.log("Navigating to the target page...");

  await page.goto('https://kasinathanb.vercel.app/projects', { waitUntil: 'networkidle2', timeout: 60000 }); // Target webpage
  console.log("Page loaded. Waiting for the button...");

  // Wait for the button that launches the extension
  try {
    await page.waitForSelector('#openReactApp', { timeout: 10000 }); // Increase timeout if necessary
    console.log("Button found. Clicking the button...");
    await page.click('#openReactApp');
    console.log("Button clicked.");
  } catch (error) {
    console.error("Button not found within the timeout period.", error);
  }

  // Close the browser after testing
  await browser.close();
  console.log("Browser closed.");
})();
