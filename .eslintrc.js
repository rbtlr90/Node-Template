const setting = require('./.eslintrc.default.js');


setting.rules = {
    ...setting.rules,
    ...{ "no-useless-catch": 0 }
}

module.exports = setting