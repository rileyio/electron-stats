/// <reference path="../typings/index.d.ts" />

import * as request from 'request';
import * as os from 'os';
import * as url from 'url';
import { app, BrowserWindow } from 'electron';
import { machineIdSync } from 'node-machine-id';
import { EventEmitter } from 'events';

const v5 = require('uuid/v5');

export class ElectronStats extends EventEmitter {
  protected app: Electron.App
  public hasSent: boolean = false
  public hasSentError: boolean
  public stats: ElectronStats.Stats
  public options: ElectronStats.Options
  public readonly autoSend: boolean = true
  public readonly autoCollect: boolean = true
  public readonly uuid: string

  constructor(options: ElectronStats.Options)
  constructor(options: ElectronStats.Options, _app?: Electron.App) {
    super()
    let pcUUID = machineIdSync({ original: true })
    
    this.options = options
    this.uuid = v5('electron-stats:uuid::', pcUUID)
    // Parse some override options first
    this.autoSend = (options.autoSend !== undefined) ? options.autoSend : true
    this.autoCollect = (options.autoCollect !== undefined) ? options.autoCollect : true

    // Verify that app has been passed or is auto-loadable
    this.verifyElectron(_app)
      .then(() => {
        if (this.autoCollect) {
          return this.getStats()
        }
      })
      .then(() => {
        if (this.autoSend) {
          this.send()
        }
      })
  }

  protected async verifyElectron(_app: Electron.App) {
    if (_app !== undefined) {
      this.app = _app
      await this.app.isReady()
    }
    else {
      await this.getElectronManually()
    }
  }

  protected async getElectronManually() {
    console.warn(`electron-stats -> Fetching whatever electron is readily accessible`)
    this.app = app
    if (this.app.isReady()) {
      await this.app.isReady()
    }
    else {
      await this.app.on('ready', () => {
        return true
      })
    }
  }

  protected getCPU(): ElectronStats.StatsCPU {
    let _cpu = os.cpus()
    let cores = 0
    let model = _cpu[0].model
    let speed = _cpu[0].speed

    _cpu.forEach(cpu => {
      cores += 1
    })

    return {
      cores: cores,
      model: model,
      speed: speed
    }
  }

  protected getOS(): ElectronStats.StatsOS {
    return {
      release: os.release(),
      platform: os.platform(),
      memory: os.totalmem()
    }
  }

  protected getStats(): ElectronStats.Stats {
    return this.stats = {
      app: {
        version: this.app.getVersion(),
        electron: process.versions.electron,
        arch: process.arch
      },
      cpu: this.getCPU(),
      os: this.getOS()
    }
  }

  private sendHandler(err: Error, res: request.RequestResponse) {
    if (err) {
      this.hasSent = false
      this.hasSentError = true
      this.emit('error', err)
      return false;
    }
    if (res.body === 'ok') {
      this.hasSent = true
      this.hasSentError = false
      this.emit('sent', true)
      return true
    }
    else {
      this.hasSent = true
      this.hasSentError = true
      return false
    }
  }

  public send() {
    return new Promise((resolve, reject) => {
      this.hasSent = false
      this.hasSentError = undefined

      request({
        method: 'POST',
        url: `http://${this.options.host}:${this.options.port}/submit`,
        json: this.stats,
        headers: {
          'User-Agent': 'es-client',
          'ESS-App': this.options.application_id,
          'ESS-Auth': this.options.authentication,
          'ESS-Client-ID': this.uuid
        }
      }, (err, res) => { resolve(this.sendHandler(err, res)) })
    })
  }
}