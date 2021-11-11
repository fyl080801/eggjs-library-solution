'use strict';

const PAGES = Symbol('Application#pages');

module.exports = {
  get pageConfigs() {
    if (!this[PAGES]) {
      this[PAGES] = {};
    }
    return this[PAGES];
  },
  addPageConfig(key, config) {
    this.pageConfigs[key] = config;
  },
};
