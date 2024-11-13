async function checkEMR(page) {
    await page.waitForSelector(".encounterBtn")
    console.log("Element with encounterBtn selector found on the page.");

    page.click(".encounterBtn");
    console.log(" encounterBtn  clicked");

    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("awaited event");


    // Get all open pages after the click
    const pages = await page.browser().pages();

    let newPage = pages[pages.length - 1];  // Assume the last page is the new one initially

    const newPageUrl = await newPage.url();
    console.log("URL of the new page: " + newPageUrl);

    await newPage.waitForSelector("img[title='Click to upload new photo.']");
    console.log("Image with title 'Click to upload new photo.' found on the new page.");

    newPage.on('dialog', async dialog => {
        console.log(`Dialog detected: ${dialog.message()}`);
        
        if (dialog.message().includes("Do you wish to continue?")) {
            await dialog.accept();
            console.log("Dialog accepted.");
        } else {
            await dialog.dismiss();
            console.log("Dialog dismissed.");
        }
    });

    console.log("Outside reached after dialog handling.");

    try {
        await newPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 3000 });
        console.log("Page loaded after dialog.");
    } catch (error) {
        console.log("Navigation failed:", error.message);
    }
    
    await newPage.waitForSelector("img[title='Click to upload new photo.']",{ timeout: 5000 });
    console.log("Image with title 'Click to upload new photo.' found on the new page.");

    // Wait for the link element and check its content
    await newPage.waitForSelector("a[title='Master Record']", { timeout: 30000 });
    console.log("Element with title 'Master Record' and matching onclick attribute found.");

    // Check if the element's text content matches "JOE, ASHIK"
    const elementText = await newPage.$eval("a[title='Master Record']", el => el.textContent.trim());

    if (elementText === "AA, Rahul") {
        console.log(`The element's text content is '${elementText}' as expected.`);
    } else {
        console.log(`The element's text content is '${elementText}', which does not match the expected value.`);
    }
}

module.exports = { checkEMR };


