<h1 align="center">
  electron-stats (ES)
</h1>
<p align="center">
  <a href="https://travis-ci.org/tdmio/electron-stats"><img src="https://img.shields.io/travis/tdmio/electron-stats/master.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/electron-stats"><img src="https://img.shields.io/npm/v/electron-stats.svg?style=flat-square"></a>
</p>

## What is electron-stats?

electron-stats is an application/system stats (info) collector & report module best paired 
with [electron-stats-server (ess)](https://github.com/tdmio/ess/).

## What is currently supported for collection/reporting
```ts
App ->
  version:  string  // Application version
  electron: string  // Electron version
  arch:     string  // Architecture used
CPU ->
  cores:    number  // Count determined from os.cpu
  model:    string  // Example: Intel(R) Core(TM) i7-4770K CPU @ 3.50GHz
  speed:    number  // Speed in MHz
OS  ->
  release:  string  // OS release number, Example (from MacOS): 16.6.0
  platform: string  // OS base, Example (from MacOS): darwin
  memory:   string  // System memory in MBs
```

## How to implement

Install the package as a dependancy to your electron application `npm install electron-stats`

Initializing the collector
```js
const ElectronStats = require('electron-stats')

const es = new ElectronStats({
  // Specify your server's host & port
  host: '127.0.0.1', port: 8080,
  // Provide the application ID generated from the ESS interactive menu
  application_id: '05cf11ee-c58e-45a8-8092-3efb91ca5d04',
  // Provide the server's authentication key,
  // also generated via the ESS interactive menu
  authentication: '49c33448343f63abc...'
})
```

## Usage

#### `new ElectronStats( {options} )`

- `options` Object (required)
  - `host` string (required) - IP or host of the collection server
  - `port` number (required) - Collection server's listening port
  - `application_id` string (required) - See ESS Documentation