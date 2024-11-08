const puppeteer = require('puppeteer');
const path = require('path');
require('dotenv').config();

const username = process.env.QUIPO_USERNAME;
const password = process.env.QUIPO_PASSWORD;

(async () => {
    console.log("Launching browser...");

    const browser = await puppeteer.launch({
        headless: false,
        timeout: 120000,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            `--use-file-for-fake-video-capture=${path.join(__dirname, 'src', 'media', 'video.webm')}`,
            `--use-file-for-fake-audio-capture=${path.join(__dirname, 'src', 'media', 'audio.mp3')}`,
            // '--allow-file-access-from-files'
        ]
    });

    const page = await browser.newPage();
    
    // Ensure permissions are granted before navigation
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://dev.quipohealth.com', ['camera', 'microphone']);
    console.log("Permissions overridden.");

    const screenWidth = 1050;
    const screenHeight = 670;
    await page.setViewport({ width: screenWidth, height: screenHeight });

    console.log("Navigating to the target page...");
    await page.goto('https://dev.quipohealth.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    console.log("Page loaded. Waiting for the button...");

    try {
        // Wait for login elements
        await page.waitForSelector('#inputEmail', { timeout: 10000 });
        await page.waitForSelector('#password', { timeout: 10000 });
        await page.waitForSelector("body quipo-root quipo-authentication div div div div div div form div button[type='button']", { timeout: 10000 });
        console.log("All the expected elements are present...");
        await page.type('#inputEmail', username);
        await page.type('#password', password);
        console.log(`Input fields filled. '${username}' and '${password}' entered.`);
        await page.click("body quipo-root quipo-authentication div div div div div div form div button[type='button']");
        console.log("Button clicked.");
    } catch (error) {
        console.error("Login button not found or other login error.", error);
        await browser.close();
        return;
    }

    console.log("Waiting for navigation or a specific element that confirms login success...");
    const expUrl = "https://dev.quipohealth.com/clinic/physician/consultation/virtual-care";

    try {
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        const currentUrl = page.url();
        if (currentUrl === expUrl) {
            console.log("Login successful. Expected URL: " + expUrl);
        } else {
            console.error("Login failed. Current URL: " + currentUrl);
            await browser.close();
            return;
        }
    } catch (error) {
        console.error("Navigation or login confirmation failed.", error);
        await browser.close();
        return;
    }

    try {
        // Wait for the appointment detail button
        await page.waitForSelector("body > quipo-root:nth-child(1) > quipo-clinic-wrapper:nth-child(2) > div:nth-child(1) > section:nth-child(2) > quipo-virtual-care:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > quipo-accordion-view:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > quipo-appointment-detail:nth-child(1) > div:nth-child(1) > div:nth-child(3) > button:nth-child(1)", { timeout: 30000 });
        console.log("Appointment detail button found. Clicking the button...");
        await page.click("body > quipo-root:nth-child(1) > quipo-clinic-wrapper:nth-child(2) > div:nth-child(1) > section:nth-child(2) > quipo-virtual-care:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > quipo-accordion-view:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > quipo-appointment-detail:nth-child(1) > div:nth-child(1) > div:nth-child(3) > button:nth-child(1)");
        console.log("Button clicked.");
    } catch (error) {
        console.error("Appointment button not found within the timeout period.", error);
        await browser.close();
        return;
    }

    console.log("Waiting for the video call button...");
    try {
        await page.waitForSelector("button[ng-reflect-ng-class='btn-primary-outline']", { timeout: 30000 });
        console.log("Video call button found. Clicking the button...");
        await new Promise(resolve => setTimeout(resolve, 4000));
        await page.click("button[ng-reflect-ng-class='btn-primary-outline']");
        console.log("Button clicked.");
    } catch (error) {
        console.error("Video call button not found within the timeout period.", error);
        await browser.close();
        return;
    }

    // Wait for the video element inside #local-media
    console.log("Waiting for the video element inside #local-media...");
    try {
        await page.waitForSelector("div[id='local-media'] video", { timeout: 60000 });
        console.log("Video element found inside #local-media.");
    } catch (error) {
        console.error("Video element not found inside #local-media within timeout period.", error);
        await browser.close();
        return;
    }

    console.log("Waiting for 5 minutes...");
    await new Promise(resolve => setTimeout(resolve, 300000)); // Waiting for 5 minutes

    console.log("Video call has been initialized. Closing the browser...");
    await browser.close();
})();
