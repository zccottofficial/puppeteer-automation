async function checkEMR(page) {
    await page.waitForSelector(".encounterBtn", { timeout: 10000 });
    console.log("Element with encounterBtn selector found on the page.");
  
    await page.click(".encounterBtn");
    console.log("Clicked encounterBtn.");
  
    const pages = await page.browser().pages();
    const newPage = pages[pages.length - 1];
  
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
  
    await newPage.waitForSelector("img[title='Click to upload new photo.']", { timeout: 5000 });
    console.log("Image with title 'Click to upload new photo.' found on the new page.");
  
    const elementText = await newPage.$eval("a[title='Master Record']", el => el.textContent.trim());
    console.log(`Master Record element's text: ${elementText}`);
  }
  
  module.exports = { checkEMR };
  