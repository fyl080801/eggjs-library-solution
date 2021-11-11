'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: false,
  },
  '@eggtest/pages': {
    enable: true,
  },
  '@eggtest/test1': {
    enable: true,
  },
};
