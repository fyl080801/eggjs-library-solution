'use strict';

const diloader = function (babel) {
  // console.log(babel);
  return {
    visitor: {},
  };
};

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [[diloader]],
};
