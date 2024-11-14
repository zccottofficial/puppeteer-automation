async function findAppointment(page) {
  await page.waitForSelector('#mygroup_no', { timeout: 10000 });
  console.log("#mygroup_no is present on the page.");

  await page.select('#mygroup_no', '_grp_Knight');
  console.log("Clinic selected successfully");

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
  console.log("Page loaded after selecting clinic");

  const targetUrl = 'https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=2024&month=11&day=11&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1';
  await page.goto(targetUrl, { waitUntil: 'load' });
  console.log("Navigated to the specific appointment Nov 11.");

  await handleActions(page);
}

async function handleActions(page) {
  const selectors = [
    { selector: "img[alt='Video Call Icon']", name: "Voice", action: voiceCallFunction },
    { selector: "img[src='../images/walkin.png']", name: "Walkin", action: walkinFunction },
    { selector: "img[src='https://oscaremr.quipohealth.com/oscar/images/videocall.png']", name: "Video", action: videoFunction }
  ];

  for (const item of selectors) {
    const element = await page.$(item.selector);
    const visible = !!element;
    console.log(`${item.name} element is ${visible ? 'available' : 'not available'} on the page.`);
    if (visible) {
      await item.action(page);
    }
  }
}

async function voiceCallFunction(page) {
  console.log('Executing voice call action...');
  await checkEMR(page);
}

async function walkinFunction(page) {
  console.log('Executing walk-in action...');
}

async function videoFunction(page) {
  console.log('Executing video call action...');
}

module.exports = { findAppointment };
