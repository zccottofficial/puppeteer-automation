const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
    console.log("Launching browser...");

    const username = process.env.USERNAME2;
    const password = process.env.PASSWORD2;

    const browser = await puppeteer.launch({
        headless: true,
        timeout: 120000,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox', 
            '--disable-extensions-except=C:\\Users\\apr32\\OneDrive\\Desktop\\my-extension-testing-project\\src\\extensions\\build',
        ]
    });

    const page = await browser.newPage();
    console.log("Navigating to the target page...");

    try {
        await page.goto('https://dev.quipohealth.com/', { waitUntil: 'networkidle2', timeout: 90000 });
        console.log("Target URL loaded. Waiting for the input fields...");

        // Wait for the input fields
        await page.waitForSelector('#inputEmail', { timeout: 15000 });
        console.log("1");
        await page.waitForSelector('#password', { timeout: 15000 });
        console.log("2");
        await page.waitForSelector("body quipo-root quipo-authentication div div div div div div form div button[type='button']", { timeout: 15000 });
        console.log("3");
        console.log("Input fields found.");

        // Fill in the input fields
        await page.type('#inputEmail', username);
        console.log(`Username entered.`);
        
        await page.type('#password', password);
        console.log("Password entered.");

        // Click the login button
        await page.click("body quipo-root quipo-authentication div div div div div div form div button[type='button']");
        console.log("Login button clicked.");

        // Wait for navigation or a specific element that confirms login success
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
        console.log("Login successful!");
    } catch (error) {
        console.error("Error during the login process:", error);
        process.exit(1);
    } finally {
        try {
            await browser.close();
            console.log("Browser closed.");
        } catch (closeError) {
            console.error("Error closing the browser:", closeError);
            process.exit(1);
        }
    }

    console.log("All tests passed successfully!");
    process.exit(0);
})();

