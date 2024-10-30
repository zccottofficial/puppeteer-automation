const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");

  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    timeout: 120000, // Increase timeout if needed
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
    await browser.close(); // Close the browser if the button is not found
    return; // Exit the script
  }

  // Negative test case: Check that p:nth-child(1) is NOT present immediately after clicking
  try {
    const pExistsBefore = await page.$('p:nth-child(1)') !== null;
    console.log("p:nth-child(1) presence before clicking the button: ", pExistsBefore ? "Found" : "Not Found");
    if (pExistsBefore) {
      console.error("Error: p:nth-child(1) should not be present immediately after launching the extension.");
    } else {
      console.log("p:nth-child(1) is NOT present as expected after opening the extension.");
    }
  } catch (error) {
    console.error("Error checking p:nth-child(1) presence.", error);
  }

  // Wait for the presence of the input box to type
  const inputSelector = '#taskName';
  try {
    await page.waitForSelector(inputSelector, { timeout: 15000 });
    console.log("Input box found. Typing 'hi'...");
    await page.type(inputSelector, 'hi'); // Type "hi" into the #taskName input box
    console.log("Text 'hi' typed into the input box.");
  } catch (error) {
    console.error("Input box not found within the timeout period.", error);
  }

  // Wait for the button to click next
  const buttonSelector = 'body > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button:nth-child(2)';
  try {
    await page.waitForSelector(buttonSelector, { timeout: 15000 });
    console.log("Button found. Clicking the button...");
    await page.click(buttonSelector);
    console.log("Button clicked.");
  } catch (error) {
    console.error("Button not found within the timeout period.", error);
  }

  // Check for the presence of p:nth-child(1) after clicking the button
  try {
    await page.waitForSelector('p:nth-child(1)', { timeout: 15000 });
    console.log("p:nth-child(1) found after clicking the button.");
  } catch (error) {
    console.error("p:nth-child(1) not found after clicking the button, which is unexpected.", error);
  }

  // Close the browser after testing
  try {
    await browser.close();
    console.log("Browser closed.");
  } catch (error) {
    console.error("Error closing the browser.", error);
  }


  
})();