'use strict';

const {ask, config, createAPI} = require('./tools.js');
const GitHub = require('github-api');

async function getGitHubApi(auth) {
  let {username, token} = config.has('github.com') ? config.get('github.com') : {};
  if (auth || !username || !token) {
    console.log('Please provide your GitHub.com authentication credentials')
    const usernameAnswer = await ask(`Username${username ? ` (${username})` : ''}: `);
    if (usernameAnswer) username = usernameAnswer;
    if (!username) {
      throw 'Empty username';
    } else {
      config.set('github.com.username', username);
    }

    console.log('Generate OAuth personal access token here: https://github.com/settings/tokens/new?scopes=repo')
    const tokenAnswer = await ask(`Token${token ? ' (press enter to use saved)' : ''}: `);
    if (tokenAnswer) token = tokenAnswer;
    if (!token) {
      throw 'Empty token';
    } else {
      config.set('github.com.token', token);
    }
  }

  return new GitHub({username, token});
}

module.exports.getGitHubApi = getGitHubApi;
