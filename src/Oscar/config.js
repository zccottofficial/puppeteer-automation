require('dotenv').config();

const CONFIG = {
  extensionPath: process.env.EXTENSION_PATH || './src/extensions/build',
  credentials: {
    username: process.env.USERNAME1,
    password: process.env.PASSWORD,
    pin: process.env.PIN
  },
  urls: {
    login: 'https://oscaremr.quipohealth.com/oscar/index.jsp',
    base: 'https://oscaremr.quipohealth.com/oscar'
  },
  timeouts: {
    navigation: 60000,
    element: 10000,
    longWait: 50000
  },
  selectors: {
    login: {
      username: '#username',
      password: '#password2',
      pin: '#pin2',
      submit: "button[name='submit']"
    },
    navigation: {
      firstMenu: '#firstMenu',
      reactApp: '#openReactApp'
    }
  }
};

module.exports = CONFIG;
