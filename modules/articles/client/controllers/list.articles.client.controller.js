(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['Articles'];

  function ArticlesListController(Articles) {
    var vm = this;

    vm.articles = Articles.query();
  }
})();
