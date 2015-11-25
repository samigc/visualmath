Package.describe({
  name: 'dascire:mathbox',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Mathbox packaged for meteor.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('mathbox-core.js','client');
  api.addFiles('mathbox.css','client');
  api.addFiles('shaders.js','client');
});
