'use strict';

const renderToken = Symbol('Application#render');
const renderConfigToken = Symbol('Application#renderConfig');

module.exports = {
  get renders() {
    return this[renderToken];
  },
  set renders(value) {
    this[renderToken] = value;
  },

  get renderConfig() {
    return this[renderConfigToken];
  },
  set renderConfig(value) {
    this[renderConfigToken] = value;
  },
};
