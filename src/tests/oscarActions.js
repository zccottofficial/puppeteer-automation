
async function findAppointment(page) {
    await page.waitForSelector('#mygroup_no', { timeout: 10000 });
    console.log("#mygroup_no is present on the page.");

    await page.select('#mygroup_no', '_grp_Knight'); // change the value if the clinic is different
    console.log("Selected successfully");
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
    console.log("page loading after selecting clinic");

    await page.waitForSelector("tbody tr td[align='center'] b a:nth-child(1)", { timeout: 10000 });
    console.log("page loaded correctly");

    const selectors = [
        { selector: "img[alt='Video Call Icon']", name: "Voice", visible: false, action: voiceCallFunction },
        { selector: "img[src='../images/walkin.png']", name: "Walkin", visible: false, action: walkinFunction },
        { selector: "img[src='https://oscaremr.quipohealth.com/oscar/images/videocall.png']", name: "Video", visible: false, action: videoFunction }
      ];
      
      // First loop to check visibility
      for (const item of selectors) {
        const element = await page.$(item.selector); // Checking availability
        item.visible = !!element; // Set visible to true if the element exists
        console.log(`${item.name} element is ${item.visible ? 'available' : 'not available'} on the page.`);
      }
      

      for (const item of selectors) {
        if (item.visible) {
          console.log(`Calling function for ${item.name}.`);
          await item.action(); // calling associated function
        }
      }
      

      

      async function voiceCallFunction() {
        console.log('Executing voice call action...');
      }
      
      async function walkinFunction() {
        console.log('Executing walk-in action...');
      }
      
      async function videoFunction() {
        console.log('Executing video call action...');
      }
      

      

}

module.exports = { findAppointment };