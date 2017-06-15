const fs = require('fs');

const compile = templateString => data =>
  templateString.replace(/{{\s*(\w+)\s*}}/g, (m, p1) => data[p1] || '');

/* istanbul ignore else */
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.tpl'] = function extension(module, filename) {
    const templateString = fs.readFileSync(filename, 'utf8');
    module.exports = compile(templateString);
  };
}

module.exports = compile;
