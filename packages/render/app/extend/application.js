'use strict';

const renderToken = Symbol('Application#renderToken');

module.exports = {
  get renders() {
    return this[renderToken];
  },
  set renders(value) {
    this[renderToken] = value;
  },
};
