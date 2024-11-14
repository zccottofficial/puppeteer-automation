const { waitForElement } = require('./browser-utils');

const LOGIN_URL = 'https://oscaremr.quipohealth.com/oscar/index.jsp';
const TIMEOUTS = {
  navigation: 60000,
  element: 10000,
};

const SELECTORS = {
  login: {
    username: '#username',
    password: '#password2',
    pin: '#pin2',
    submit: "button[name='submit']"
  }
};

async function login(page, credentials) {
  await page.goto(LOGIN_URL, { 
    waitUntil: 'networkidle2', 
    timeout: TIMEOUTS.navigation 
  });

  await fillInput(page, SELECTORS.login.username, credentials.username);
  await fillInput(page, SELECTORS.login.password, credentials.password);
  await fillInput(page, SELECTORS.login.pin, credentials.pin);

  await page.click(SELECTORS.login.submit);
  await page.waitForNavigation({ 
    waitUntil: 'networkidle2', 
    timeout: TIMEOUTS.navigation 
  });
}

async function fillInput(page, selector, value) {
  await waitForElement(page, selector, TIMEOUTS.element);
  await page.type(selector, value);
  console.log(`Input filled for ${selector}`);
}

module.exports = { login };
