export default class PluginAPI {
  constructor(id, servive) {
    this.id = id;
    this.servive = servive;
  }

  configProcess(fn) {
    this.servive.processFn.push(fn);
  }
}
