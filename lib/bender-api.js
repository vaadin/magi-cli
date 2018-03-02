'use strict';

const {ask, config, createAPI} = require('./tools.js');

function getURL(prefix) {
  return `https://bender.vaadin.com${prefix || ''}/app/rest/10.0`;
}

async function getBenderApi(auth) {
  let {username, password} = config.has('bender.vaadin.com') ? config.get('bender.vaadin.com') : {};
  if (auth || !username || !password) {
    console.log('Please provide your bender.vaadin.com authentication credentials')
    const usernameAnswer = await ask(`Username${username ? ` (${username})` : ''}: `);
    if (usernameAnswer) username = usernameAnswer;
    if (!username) {
      throw 'Empty username';
    } else {
      config.set('bender.vaadin.com.username', username);
    }

    const passwordAnswer = await ask(`Password${password ? ' (press enter to use saved)' : ''}: `);
    if (passwordAnswer) password = passwordAnswer;
    if (!password) {
      throw 'Empty password';
    } else {
      config.set('bender.vaadin.com.password', password);
    }
  }

  const authApi = createAPI({
    baseURL: getURL('/httpAuth'),
    auth: {username, password},
    headers: {'Origin': 'https://bender.vaadin.com'}
  });
  const authResponse = await authApi.get('/server');
  try {
    const cookie = authResponse.headers['set-cookie']
      .find(cookie => /^TCSESSIONID=/.test(cookie))
      .split(/;\s+/)[0];
    return createAPI({baseURL: getURL(), headers: {
      'Origin': 'https://bender.vaadin.com',
      'Cookie': cookie
    }});
  } catch (error) {
    throw `API Authentication error: incorrect response`;
  }
}

module.exports = {getBenderApi};
