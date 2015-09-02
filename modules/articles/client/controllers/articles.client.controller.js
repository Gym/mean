(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'Authentication', 'articleResolve'];

  function ArticlesController($scope, $state, Authentication, articleResolve) {
    var vm = this;

    vm.article = articleResolve;
    vm.authentication = Authentication;
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      var article = vm.article;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');
        return false;
      }

      if (article._id) {
        article.$update(successCallback, errorCallback);
      } else {
        article.$save(successCallback, errorCallback);
      }

      function successCallback(response) {
        $state.go('articles.view', {
          articleId: response._id
        });
      }

      function errorCallback(errorResponse) {
        vm.error = errorResponse.data.message;
      }
    }
  }
})();
