'use strict';

module.exports = function (acl) {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/users',
			permissions: '*'
		}, {
			resources: '/api/users/:userId',
			permissions: '*'
		}]
	}]);
};
