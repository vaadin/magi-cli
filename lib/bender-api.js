const cliPackageName = require('../package.json').name;
const cliPackageVersion = require('../package.json').version;
const Configstore = require('configstore');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const ask = (query) => new Promise((resolve, reject) => rl.question(query, resolve));

function getURL(prefix) {
  return `https://bender.vaadin.com${prefix || ''}/app/rest/10.0`;
}

function createAPI(config) {
  const api = axios.create(config);
  api.interceptors.response.use(
    function(response) { return response },
    function(error) {
      throw `Error: ${error.message}\n${error.response.data}`;
    }
  );
  return api;
}

const defaults = {
  timeout: 300000,
  headers: {
    'Accept': 'application/json',
    'Origin': 'https://bender.vaadin.com',
    'User-Agent': `${cliPackageName}/${cliPackageVersion}`
  }
};

const axios = require('axios');

async function getBenderApi(auth) {
  const conf = new Configstore(cliPackageName);
  let {username, password} = conf.has('bender.vaadin.com') ? conf.get('bender.vaadin.com') : {};
  if (auth || !username || !password) {
    console.log('Please provide your bender.vaadin.com authentication credentials')
    const usernameAnswer = await ask(`Username${username ? ` (${username})` : ''}: `);
    if (usernameAnswer) username = usernameAnswer;
    if (!username) {
      throw 'Empty username';
    } else {
      conf.set('bender.vaadin.com.username', username);
    }

    const passwordAnswer = await ask(`Password${password ? ' (press enter to use saved)' : ''}: `);
    if (passwordAnswer) password = passwordAnswer;
    if (!password) {
      throw 'Empty password';
    } else {
      conf.set('bender.vaadin.com.password', password);
    }
  }
  const authApi = createAPI({
    ...defaults,
    baseURL: getURL('/httpAuth'),
    auth: {username, password}
  });
  const authResponse = await authApi.get('/server');
  try {
    const cookie = authResponse.headers['set-cookie']
      .find(cookie => /^TCSESSIONID=/.test(cookie))
      .split(/;\s+/)[0];
    return createAPI({
      ...defaults,
      baseURL: getURL(),
      headers: {
        ...defaults.headers,
        'Cookie': cookie
      }
    });
  } catch (error) {
    throw `API Authentication error: incorrect response`;
  }
}

module.exports = {getBenderApi};
