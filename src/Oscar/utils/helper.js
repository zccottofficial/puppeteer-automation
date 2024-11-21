
const { waitAndCheckInnerHtml } = require('./utils')


async function checkExtensionData(page, name, number){
    console.log(`Checking ${name} ${number}`);
    await waitAndCheckInnerHtml(page, '.qpeHeaderH1', "Quipo")

}

module.exports = { checkExtensionData }