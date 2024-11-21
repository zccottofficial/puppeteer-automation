// oscarActions.js
const { navigateToUrl, waitForNavigation, waitAndCheck } = require('../utils/utils');

async function findAppointment(page) {
  await waitAndCheck(page, '#mygroup_no');
  await page.select('#mygroup_no', '_grp_Knight'); // change the value if the clinic is different
  console.log("Clinic selected successfully");

  await waitForNavigation(page);

  const targetUrl = 'https://oscaremr.quipohealth.com/oscar/provider/providercontrol.jsp?year=2024&month=11&day=11&view=0&displaymode=day&dboperation=searchappointmentday&viewall=1';
  await navigateToUrl(page, targetUrl);

  await handleActions(page);
}

async function handleActions(page) {

  const selectors = [
    { name: "Patient 3", number: " (613) 456-0988 | ", selector: "img[alt='Video Call Icon']", name: "Voice", action: voiceCallFunction },
    { name: "Patient 1", number: " (613) 454-6546 | ", selector: "img[src='../images/walkin.png']", name: "Walkin", action: walkinFunction },
    { name: "Patient 2", number: " (613) 454-6546 | ", selector: "img[src='https://oscaremr.quipohealth.com/oscar/images/videocall.png']", name: "Video", action: videoFunction }
  ];

  for (const item of selectors) {
    const element = await page.$(item.selector);
    const visible = !!element;
    console.log(`${item.name} element is ${visible ? 'available' : 'not available'} on the page.`);
    if (visible) await item.action(page, item.name, item.number);
  }
}



async function voiceCallFunction(page,name,number) {
  console.log(` ${name} ${number}`);
  console.log('Executing voice call action...');
}

async function walkinFunction(page,name,number) {
  console.log(` ${name} ${number}`);
  console.log('Executing walk-in action...');
}

async function videoFunction(page,name,number) {
  console.log(` ${name} ${number}`);
  console.log('Executing video call action...');
}

module.exports = { findAppointment };
