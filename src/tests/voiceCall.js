async function checkEMR(page) {
    await page.waitForSelector(".encounterBtn");
    console.log("Element with encounterBtn selector found on the page.");

    // Ensure the click completes before moving on
    await page.click(".encounterBtn");
    console.log("encounterBtn clicked");

    // Add a delay to wait for the page to start opening
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Awaited event");

    try {
        // Wait for the new page to open
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),  // Listen for new page event
            page.click(".encounterBtn")           // Trigger the click to open the new page
        ]);

        // Wait for the new page to load completely
        await newPage.waitForLoadState('load', { timeout: 10000 });
        const newPageUrl = await newPage.url();
        console.log("URL of the new page: " + newPageUrl);

        // Wait for the specific element on the new page
        await newPage.waitForSelector("img[title='Click to upload new photo.']", { timeout: 10000 });
        console.log("Image with title 'Click to upload new photo.' found on the new page.");

        // Handle dialog events
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

        // Wait for navigation after dialog
        try {
            await newPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
            console.log("Page loaded after dialog.");
        } catch (error) {
            console.log("Navigation failed:", error.message);
        }

        // Verify the photo upload element again if necessary
        await newPage.waitForSelector("img[title='Click to upload new photo.']", { timeout: 5000 });
        console.log("Image with title 'Click to upload new photo.' found on the new page.");

        // Wait for and validate the link element's text
        await newPage.waitForSelector("a[title='Master Record']", { timeout: 30000 });
        console.log("Element with title 'Master Record' and matching onclick attribute found.");

        const elementText = await newPage.$eval("a[title='Master Record']", el => el.textContent.trim());
        if (elementText === "AA, Rahul") {
            console.log(`The element's text content is '${elementText}' as expected.`);
        } else {
            console.log(`The element's text content is '${elementText}', which does not match the expected value.`);
        }
    } catch (error) {
        console.log("Error while handling new page or element:", error.message);
    }
}

module.exports = { checkEMR };
