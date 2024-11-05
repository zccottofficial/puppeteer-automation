// navigation.js

async function verifyUrl(page, expectedUrl) {
    const currentUrl = page.url();
    if (currentUrl === expectedUrl) {
      console.log("Successfully navigated to the expected URL:", currentUrl);
    } else {
      throw new Error(`Failed to navigate to the expected URL. Current URL is: ${currentUrl}`);
    }
  }
  
  async function interactWithElements(page) {
    await page.waitForSelector('#firstMenu', { timeout: 10000 });
    console.log("#firstMenu is present on the page.");
  
    await page.waitForSelector("a[href='http://www.raceconnect.ca/race-app/']", { timeout: 10000 });
    console.log("a[href='http://www.raceconnect.ca/race-app/'] is present on the page.");
  
    await page.waitForSelector("#openReactApp", { timeout: 50000 });
    await page.click("#openReactApp");
    console.log("Clicked the #openReactApp button.");
  
    await page.waitForSelector("svg[width='14']", { timeout: 10000 });
    console.log("svg[width='14'] is present on the page.");
  }
  
  module.exports = { verifyUrl, interactWithElements };
  