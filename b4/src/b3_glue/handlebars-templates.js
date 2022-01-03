// This file requires handlebars and adds them to window.HandlebarsTemplates
//
// Note: we are doing multiple things to get Handlebars to work
// 1) custom loader config configuring extension and path where to look up partials
// 2) requiring templates via context.require
// 3) registering required templates in window.HandlebarsTemplates
//
// In the learning.gem, this is handled with Grunt for the specs to work

window.HandlebarsTemplates = window.HandlebarsTemplates || {};

var handlebarsTemplatesRequire = require.context(
  '../../../b3/app/assets/learning/templates/',
  true,
  /\.js\.hbs$/
);
handlebarsTemplatesRequire.keys().forEach(function(key) {
  var handlebarKey = key.replace(/^\.\//, '').replace('.js.hbs', '');
  window.HandlebarsTemplates[handlebarKey] = handlebarsTemplatesRequire(key);
});
