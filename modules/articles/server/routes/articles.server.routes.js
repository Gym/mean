'use strict';

/**
 * Module dependencies.
 */
var articles = require('../controllers/articles.server.controller');

module.exports = function (app, acl) {
	// Custom Policy
	var isAllowed = function (req, res, next) {
		var roles = (req.user) ? req.user.roles : ['guest'];

		// If an article is being processed and the current user created it then allow any manipulation
		if (req.article && req.user && req.article.user.id === req.user.id) {
			return next();
		}

		return acl.isAllowed(req, res, next);
	};

	// Articles collection routes
	app.route('/api/articles').all(isAllowed)
		.get(articles.list)
		.post(articles.create);

	// Single article routes
	app.route('/api/articles/:articleId').all(isAllowed)
		.get(articles.read)
		.put(articles.update)
		.delete(articles.delete);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};
