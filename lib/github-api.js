'use strict';

const {ask, config, createAPI} = require('./tools.js');
const GitHub = require('github-api');

async function getGitHubApi(auth) {
  let token = process.env.GH_TOKEN || config.get('github.com.token');
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
