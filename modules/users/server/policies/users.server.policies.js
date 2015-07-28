'use strict';

module.exports = function (acl) {
	acl.allow([{
		roles: ['user'],
		allows: [{
			resources: '/api/users/password',
			permissions: 'post'
		}]
	}]);
};
