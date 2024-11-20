// voiceCall.js
const { waitAndClick, waitForNavigation, waitAndCheck } = require('../utils/utils');

async function checkEMR(page) {
    // await waitAndClick(page, ".encounterBtn");
    // console.log("Clicked encounterBtn.");

    await waitAndCheck(page, ".encounterBtn");

    // Get all matching elements and click the second one
    const buttons = await page.$$(".encounterBtn");
    if (buttons.length > 1) {
        await buttons[2].click(); // Click the second button (index 1)
        console.log("Clicked the second encounterBtn.");
    } else {
        console.error("Second encounterBtn not found.");
    }

    // Access all open pages after the click and assume the last page is the new one
    const pages = await page.browser().pages();
    const newPage = pages[pages.length - 1];
    // Log the URL of the new page
    const newPageUrl = await newPage.url();
    console.log("URL of the new page: " + newPageUrl);

    await newPage.waitForSelector("a[title='Master Record']", { timeout: 3000 });
    console.log("Element with title 'Master Record' and matching onclick attribute found.");

    await new Promise(resolve => setTimeout(resolve, 500000));

    // Check if the element's text content matches "JOE, ASHIK"
    const elementHtml = await newPage.$eval(
        "a[title='Master Record']",
        el => el.outerHTML
    );
    console.log(elementHtml);


    if (elementHtml === "JOE, ASHIK") {
        console.log(`The element's text content is '${elementHtml}' as expected.`);
    } else {
        console.log(`The element's text content is '${elementHtml}', which does not match the expected value.`);
    }
}

module.exports = { checkEMR };
