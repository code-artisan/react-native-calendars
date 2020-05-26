const get = require('lodash/get');
const isEqual = require('lodash/isEqual');

function shouldUpdate(a, b, paths) {
  for (let i = 0; i < paths.length; i++) {
    const equals = isEqual(get(a, paths[i]), get(b, paths[i]));
    if (!equals) {
      return true;
    }
  }
  return false;
}

module.exports = {
  shouldUpdate
};
