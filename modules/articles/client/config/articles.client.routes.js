(function () {
  'use strict';

  angular
  .module('articles.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
        controller: 'ArticlesListController',
        controllerAs: 'vm'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        },
        resolve: {
          articleResolve: newArticle
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: findArticle
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: findArticle
        },
        data: {
          roles: ['user', 'admin']
        }
      });
  }

  findArticle.$inject = ['$stateParams', 'Articles'];

  function findArticle($stateParams, Articles) {
    return Articles.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['Articles'];

  function newArticle(Articles) {
    return new Articles();
  }
})();
