(function (app) {
  'use strict';

  // Use Applicaion configuration module to register a new module
  app.registerModule('articles');
  app.registerModule('articles.routes', ['ui.router']);
})(ApplicationConfiguration);
