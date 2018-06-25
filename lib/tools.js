'use strict';


/*
 * Tips for simple codebase:
 *
 * - No callbacks, please. Make async function or return a Promise explicitely.
 *
 * - Throw errors if needed.
 */


const asyncExec = require('util').promisify(require('child_process').exec);

/**
 * Runs the command and captures the stdout
 */
async function run(cmd) {
  const {stdout} = await asyncExec(cmd);
  return stdout;
}
module.exports.run = run;


const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/**
 * Asks the user and capture the response
 */
const ask = (query) => new Promise((resolve, reject) => rl.question(query, resolve));
module.exports.ask = ask;


const path = require('path');
const workingPackage = require(path.resolve(process.cwd(), 'package.json'));
workingPackage.name = (workingPackage.name || '').replace(/^@vaadin\//, '');
module.exports.workingPackage = workingPackage;


const cliPackageName = require('../package.json').name;
const cliPackageVersion = require('../package.json').version;

const Configstore = require('configstore');

/**
 * Configstore instance for the app
 */
const config = new Configstore(cliPackageName);
module.exports.config = config;


function applyDefaults(apiConfig) {
  const defaults = {
    timeout: 300000,
    headers: {
      'Accept': 'application/json',
      'User-Agent': `${cliPackageName}/${cliPackageVersion}`
    }
  };
  return {
    ...defaults,
    ...apiConfig,
    headers: {
      ...defaults.headers,
      ...apiConfig.headers
    }
  }
}

const axios = require('axios');

/**
 * Creates and returns configured Axios API for specified config. The API has
 * JSON and magi-cli User-Agent headers pre-configured, default timeout — 300 s.
 * Throws request errors.
 */
function createAPI(apiConfig) {
  const api = axios.create(applyDefaults(apiConfig));
  api.interceptors.response.use(
    function(response) { return response },
    function(error) {
      throw `Error: ${error.message}\n${error.response.data}`;
    }
  );
  return api;
}
module.exports.createAPI = createAPI;
