// voiceCall.js
const { waitAndClick, waitForNavigation } = require('./utils');

async function checkEMR(page) {
    await waitAndClick(page, ".encounterBtn");
    console.log("Clicked encounterBtn.");

    // Access all open pages after the click and assume the last page is the new one
    const pages = await page.browser().pages();
    const newPage = pages[pages.length - 1];
    // Log the URL of the new page
    const newPageUrl = await newPage.url();
    console.log("URL of the new page: " + newPageUrl);

    const elementText = await newPage.$eval("a[title='Master Record']", el => el.textContent.trim());
    console.log(`Master Record element's text: ${elementText}`);
}

module.exports = { checkEMR };
