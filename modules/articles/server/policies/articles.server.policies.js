'use strict';

module.exports = function (acl) {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/articles',
			permissions: '*'
		}, {
			resources: '/api/articles/:articleId',
			permissions: '*'
		}]
	}, {
		roles: ['user'],
		allows: [{
			resources: '/api/articles',
			permissions: ['get', 'post']
		}, {
			resources: '/api/articles/:articleId',
			permissions: ['get']
		}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/articles',
			permissions: ['get']
		}, {
			resources: '/api/articles/:articleId',
			permissions: ['get']
		}]
	}]);
};
