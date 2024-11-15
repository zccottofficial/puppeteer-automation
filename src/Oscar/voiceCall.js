// voiceCall.js
const { waitAndClick, waitForNavigation, waitAndCheck } = require('./utils');

async function checkEMR(page) {
    await waitAndClick(page, ".encounterBtn");
    console.log("Clicked encounterBtn.");

    // Access all open pages after the click and assume the last page is the new one
    const pages = await page.browser().pages();
    const newPage = pages[pages.length - 1];
    // Log the URL of the new page
    const newPageUrl = await newPage.url();
    console.log("URL of the new page: " + newPageUrl);


    await newPage.waitForSelector("img[title='Click to upload new photo.']",{ timeout: 5000 });
    console.log("Image with title 'Click to upload new photo.' found on the new page.");
    await newPage.waitForSelector("a[title='Master Record']", { timeout: 3000 });
    console.log("Element with title 'Master Record' and matching onclick attribute found.");

    // Check if the element's text content matches "JOE, ASHIK"
    const elementText = await newPage.$eval("a[title='Master Record']", el => el.textContent.trim());

    if (elementText === "JOE, ASHIK") {
        console.log(`The element's text content is '${elementText}' as expected.`);
    } else {
        console.log(`The element's text content is '${elementText}', which does not match the expected value.`);
    }
}

module.exports = { checkEMR };
