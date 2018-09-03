'use strict';


/*
 * Tips for simple codebase:
 *
 * - No callbacks, please. Make async function or return a Promise explicitely.
 *
 * - Throw errors if needed.
 */

/**
 * Checks for the package updates, https://www.npmjs.com/package/update-notifier
 */
module.exports.checkForUpdates = function () {
  const updateNotifier = require('update-notifier');
  const pkg = require('../package.json');
  updateNotifier({
    pkg,
    updateCheckInterval: 0 // always check for updates, default is 1 day
  }).notify();
}

const asyncExec = require('util').promisify(require('child_process').exec);
/**
 * Runs the command and captures the stdout
 */
async function run(cmd) {
  const {stdout} = await asyncExec(cmd);
  return stdout;
}
module.exports.run = run;


const spawn = require('cross-spawn');
/**
 * Runs the command without opening a new shell.
 * It prints stdout and stderr at the same time that captures it in
 * order to be passed in the resolved promise.
 */
async function exe(cmd, quiet) {
  const args = cmd.split(/ +/);
  const child = spawn(args[0], args.slice(1));

  let out = '';
  const capture = data => {
    const s = data.toString('utf-8');
    !quiet && process.stdout.write(s);
    out += s;
  };

  child.stdout.on('data', capture);
  child.stderr.on('data', capture);

  return new Promise((resolve, reject) => child.on('exit', async function(code) {
    if (code == 0) {
      resolve(out);
    } else {
      reject(`${(quiet ? out : '')}\n!!! ERROR !!! Process '${cmd}' exited with code ${code}`);
    }
  }));
}
module.exports.exe = exe;

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
module.exports.workingPackage = workingPackage;
module.exports.elementName = workingPackage.name.replace(/^@.+?\//, '');

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
