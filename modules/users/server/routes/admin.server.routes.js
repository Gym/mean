'use strict';

/**
 * Module dependencies.
 */
var admin = require('../controllers/admin.server.controller');

module.exports = function (app, acl) {
	// Users collection routes
	app.route('/api/users').get(acl.isAllowed, admin.list);

	// Single user routes
	app.route('/api/users/:userId')
		.get(acl.isAllowed, admin.read)
		.put(acl.isAllowed, admin.update)
		.delete(acl.isAllowed, admin.delete);

	// Finish by binding the user middleware
	app.param('userId', admin.userByID);
};
