# magi-cli
Elements team command-line member

[![npm version](https://badgen.net/npm/v/magi-cli)](https://www.npmjs.com/package/magi-cli)
[![semantic-release badge](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/vaadin/magi-cli/blob/master/CHANGELOG.md)

## Requirements
- Node.js
- Git

## Install

    $ npm i -g magi-cli

## Usage

```sh
  Usage: magi [options] [command]

  Options:

    -V, --version                            output the version number
    -h, --help                               output usage information

  Commands:

    release-notes <fromVersion> <toVersion>  Draft release notes for the specified version range
    add-milestone <fromVersion> <toVersion>  Add milestone for <toVersion> to all issues and PRs closed during the specified version range
    deploy <version>                         Build and deploy version <version> to CDN origin
    webjar <version>                         Deploy version <version> on https://www.webjars.org
    directory                                Update https://vaadin.com/directory
    release <version> [--draft]              Release new <version> of the component and publish to npm
    p3-convert [modulizerArgs...]            Prepares package.json and runs modulizer with pre-configured arguments
    help [cmd]                               display help for [cmd]
```


## Development

1. Fork and clone this repository
2. Navigate to your working copy on command line: `$ cd magi-cli`
3. `$ npm link`
4. `$ magi` now runs your cloned working copy
