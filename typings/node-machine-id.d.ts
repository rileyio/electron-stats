declare module 'node-machine-id' {
  /**
   *  Return options { original: boolean }
   * 
   * @interface options
   */
  interface options {
    /**
     * original <Boolean>, If true return original value of machine id, otherwise return hashed value (sha-256), default: false
     * 
     * @type {boolean}
     * @memberof options
     */
    original: boolean
  }

  // namespace NodeMachineId {
  /**
   * Asynchronous call with async/await or Promise options modified
   * 
   * @export
   * @param {options} Return options { original: boolean }
   * @returns {string} sha-256 of machine id | original machine id
   */
  function machineIdSync(options: options): string

  /**
   * Asynchronous call with async/await or Promise options modified
   * 
   * @returns {string} sha-256 of machine id
   */
  function machineIdSync(): string

  /**
   * Asynchronous call returning a promise
   * 
   * @param {options} Return options { original: boolean }
   * @returns {Promise<string>}
   */
  function machineId(options: options): Promise<string>
}
