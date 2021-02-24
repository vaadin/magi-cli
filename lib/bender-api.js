'use strict';

const {ask, config, createAPI} = require('./tools.js');

function getURL(prefix) {
  return `https://bender.vaadin.com${prefix || ''}/app/rest/10.0`;
}

async function getBenderApi(auth) {
  let {token} = config.has('bender.vaadin.com') ? config.get('bender.vaadin.com') : {};
  if (auth || !token) {
    console.log('Please provide your bender.vaadin.com token')
    console.log('To generate a token, go to https://bender.vaadin.com/profile.html?item=accessTokens',
      'then paste the token below')
    const tokenAnswer = await ask(`token${token ? ` (${token})` : ''}: `);
    if (tokenAnswer) token = tokenAnswer;
    if (!token) {
      throw 'Empty token';
    } else {
      config.set('bender.vaadin.com.token', token);
    }
  }

  return createAPI({baseURL: getURL(), headers: {
    'Authorization': `Bearer ${token}`
  }});
}

module.exports = {getBenderApi};
