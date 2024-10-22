const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching browser...");

    const browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      timeout: 120000, // Increase timeout if needed
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-extensions-except=C:\\Users\\apr32\\OneDrive\\Desktop\\my-extension-testing-project\\src\\extensions\\build,C:\\Users\\apr32\\OneDrive\\Desktop\\extension\\selectorHUB', // Add the paths to both extensions
        '--load-extension=C:\\Users\\apr32\\OneDrive\\Desktop\\my-extension-testing-project\\src\\extensions\\build,C:\\Users\\apr32\\OneDrive\\Desktop\\extension\\selectorHUB' // Load both extensions
      ]
    });

    console.log("Browser launched successfully!");
    const page = await browser.newPage();
    
    console.log("Navigating to Google...");
    await page.goto('https://www.google.com', { waitUntil: 'load' });
    console.log("Google page loaded successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  }
  
  try{
    await page.waitForSelector("img[alt='Google']",{timeout:60000});
    console.log(" found google ");
    await page.screenshot({path: 'google.png'});
    console.log("screenshot taken");
  }catch(error){
    console.log("not found");
  }

})();
