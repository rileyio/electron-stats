/* globals describe, before, it */
const should = require('should')
const ElectronStats = require('..')
const { app } = require('electron')
const os = require('os')
const http = require('http');

describe('Initialize electron-stats, (Actual) [FromModule]', () => {
  const es = new ElectronStats({
    host: 'localhost', port: 8080,
    application_id: '05cf11ee-c58e-45a8-8092-3efb91ca5d04',
    authentication: '49c33448343f63abc8bffd6100fe938c07c4e55314a86a777489412092a3f9d0e4455fee2e29fef813242fe3a2794896a2e6f707cd5d811ffeece2f677b62be7',
    autoSend: false
  })
  // Test server
  const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end('ok')
  }).listen(3001)
  var receivedAppID = null
  var receivedAuthentication = null

  describe('method => getCPU()', () => {
    let cpu = os.cpus()
    let getCPU = es.getCPU()

    it(`.cores (${cpu.length})`, () => {
      should(getCPU.cores).equal(cpu.length)
    });
    it(`.model (${cpu[0].model})`, () => {
      should(getCPU.model).equal(cpu[0].model)
    });
    it(`.speed (${cpu[0].speed})`, () => {
      should(getCPU.speed).equal(cpu[0].speed)
    });

    // should(getCPU).deepEqual({
    //   cores: cpu.length,
    //   model: cpu[0].model,
    //   speed: cpu[0].speed
    // })
  });

  describe('method => getStats()', () => {
    let stats = es.getStats()

    it(`.version [${stats.app.version}]`, () => {
      should(stats.app.version).be.a.String()
    });
    it(`.electron [${stats.app.electron}]`, () => {
      should(stats.app.electron).be.a.String()
    });
    it(`.arch [${stats.app.arch}]`, () => {
      should(stats.app.arch).be.a.String()
    });
  });

  describe('method => getOS()', () => {
    let getOS = es.getOS()

    it(`.release [${getOS.release}]`, () => {
      should(getOS.release).be.a.String()
    });
    it(`.platform [${getOS.platform}]`, () => {
      should(getOS.platform).be.a.String()
    });
    it(`.memory [${getOS.memory}]`, () => {
      should(getOS.memory).be.a.Number()
    });
  });

  describe('method => .send() manual', () => {
    it(`.hasSent`, () => {
      should(es.send()).eventually.be.Boolean()
    });
  });
});