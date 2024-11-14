async function verifyUrl(page, expectedUrl) {
  const currentUrl = page.url();
  if (currentUrl === expectedUrl) {
    console.log("Successfully navigated to the expected URL:", currentUrl);
  } else {
    throw new Error(`Failed to navigate to the expected URL. Current URL is: ${currentUrl} - expected URL is: ${expectedUrl}`);
  }
}

async function interactWithElements(page) {
  const elements = [
    { selector: '#firstMenu', name: "firstMenu" },
    { selector: "a[href='http://www.raceconnect.ca/race-app/']", name: "Race App Link" },
    { selector: "#openReactApp", name: "React App Button" }
  ];

  for (const element of elements) {
    await page.waitForSelector(element.selector, { timeout: 10000 });
    console.log(`${element.name} is present on the page.`);
  }
}

module.exports = { verifyUrl, interactWithElements };
