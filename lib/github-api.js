'use strict';

const {ask, config, getGitHubToken} = require('./tools.js');
const GitHub = require('github-api');

async function getGitHubApi(auth) {
  let token = getGitHubToken();
  if (auth || !token) {
    console.log('Please provide your GitHub personal access token, https://github.com/settings/tokens/new?scopes=repo')
    const tokenAnswer = await ask(`Token${token ? ' (press enter to use saved)' : ''}: `);
    if (tokenAnswer) token = tokenAnswer;
    if (!token) {
      throw 'Empty GitHub token';
    } else {
      config.set('github.com.token', token);
    }
  }

  return new GitHub({token});
}

module.exports.getGitHubApi = getGitHubApi;
