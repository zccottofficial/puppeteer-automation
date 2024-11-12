async function checkEMR(page) {
    await page.waitForSelector("body > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(5) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(31) > td:nth-child(3) > div:nth-child(1) > a:nth-child(12)");
    console.log("Element with specified CSS selector found on the page.");

    await page.click("body > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(5) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(31) > td:nth-child(3) > div:nth-child(1) > a:nth-child(12)");
    console.log("Element with specified CSS selector clicked.");

    await new Promise(resolve => setTimeout(resolve, 5000));  

    // Get all open pages after the click
    const pages = await page.browser().pages();
    
    // Find the newly opened page (the page URL will be different)
    let newPage = pages[pages.length - 1];  // Assume the last page is the new one initially

    // // If the URL is the same, loop through pages to find the new one
    // const currentUrl = await page.url();
    // for (let i = pages.length - 1; i >= 0; i--) {
    //     const potentialNewPage = pages[i];
    //     const potentialUrl = await potentialNewPage.url();

    //     // Compare the URLs: If different, it’s the new page
    //     if (potentialUrl !== currentUrl) {
    //         newPage = potentialNewPage;
    //         break;
    //     }
    // }


    const newPageUrl = await newPage.url();
    console.log("URL of the new page: " + newPageUrl);

    // Wait for the new page to load and check for an element on that page
    await newPage.waitForSelector("img[title='Click to upload new photo.']"); 
    console.log("Image with title 'Click to upload new photo.' found on the new page.");

}

module.exports = { checkEMR };


