Package.describe({
  name: 'dascire:threestrap',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'threestrap for three r71',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/unconed/threestrap',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('dascire:three')
  api.addFiles('threestrap.js','client');
  api.addFiles('new.js','client');
});
