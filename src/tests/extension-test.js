const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
  console.log("Launching browser...");

  // Define credentials
  const username = process.env.USERNAME1;
  const password = process.env.PASSWORD;
  const pin = process.env.PIN;

  console.log(username, password, pin);

  const browser = await puppeteer.launch({
    headless: true, // Set to true for headless mode
    timeout: 120000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-extensions-except=./src/extensions/build', // Relative path for disabling extensions
      '--load-extension=./src/extensions/build' // Relative path for loading the extension
    ]
  });

  const page = await browser.newPage();
  console.log("Navigating to the login URL...");

  // Navigate to the login URL
  await page.goto('https://oscaremr.quipohealth.com/oscar/index.jsp', { waitUntil: 'networkidle2', timeout: 60000 });
  console.log("Target URL loaded. Waiting for the input fields...");

  // Find the username input and type the username
  try {
    await page.waitForSelector('#username', { timeout: 10000 });
    await page.type('#username', username);
    console.log(`Typed '${username}' into the username field.`);
  } catch (error) {
    console.error("Username field not found within the timeout period.", error);
  }

  // Find the password input and type the password
  try {
    await page.waitForSelector('#password2', { timeout: 10000 });
    await page.type('#password2', password);
    console.log(`Typed '${password}' into the password field.`);
  } catch (error) {
    console.error("Password field not found within the timeout period.", error);
  }

  // Find the PIN input and type the PIN
  try {
    await page.waitForSelector('#pin2', { timeout: 10000 });
    await page.type('#pin2', pin);
    console.log(`Typed '${pin}' into the PIN field.`);
  } catch (error) {
    console.error("PIN field not found within the timeout period.", error);
  }

  // Click the submit button
  try {
    await page.waitForSelector("button[name='submit']", { timeout: 10000 });
    await page.click("button[name='submit']");
    console.log("Clicked the submit button.");

    // Wait for navigation to the next page after submitting the form
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
    console.log("Navigated after clicking submit.");
  } catch (error) {
    console.error("Submit button not found or navigation failed within the timeout period.", error);
  }

  const expectedUrl = 'https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=2024&month=10&day=30&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1';
  
  try {
    const currentUrl = page.url();
    if (currentUrl === expectedUrl) {
      console.log("Successfully navigated to the expected URL:", currentUrl);
    } else {
      console.error("Failed to navigate to the expected URL. Current URL is:", currentUrl);
    }
  } catch (error) {
    console.error("Error retrieving the current URL.", error);
  }

  // Check for the presence of the #firstMenu element
  try {
    await page.waitForSelector('#firstMenu', { timeout: 10000 });
    console.log("#firstMenu is present on the page.");


    await page.waitForSelector("a[href='http://www.raceconnect.ca/race-app/']", { timeout: 10000 });
    console.log("a[href='http://www.raceconnect.ca/race-app/'] is present on the page.");
    

    // Find and click the #openReactApp button
    await page.waitForSelector("#openReactApp", { timeout: 50000 });
    await page.click("#openReactApp");
    console.log("Clicked the #openReactApp button.");

    await page.waitForSelector("svg[width='14']", { timeout: 10000 });
    console.log("svg[width='14'] is present on the page.");
  } catch (error) {
    console.error("#firstMenu or #openReactApp not found within the timeout period.", error);
  }

  // Close the browser after testing
  try {
    await browser.close();
    console.log("Browser closed.");
  } catch (error) {
    console.error("Error closing the browser.", error);
  }
})();




