'use strict';

module.exports = function (acl) {
	// Attach custom middleware
	acl.isAllowed = function (req, res, next) {
		var roles = (req.user) ? req.user.roles : ['guest'];

		// Check for user roles
		acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
			if (err) {
				// An authorization error occurred.
				return res.status(500).send('Unexpected authorization error');
			} else {
				if (isAllowed) {
					// Access granted! Invoke next middleware
					return next();
				} else {
					return res.status(403).json({
						message: 'User is not authorized'
					});
				}
			}
		});
	};
};
