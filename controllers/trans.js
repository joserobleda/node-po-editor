
	var Trans = require('../models/trans');

	module.exports = {

		/***
		   * Show the current user
		   *
		   *
		   *
		   */
		index: function (req, res, next) {
			res.render('index.twig');
		},


		/***
		   * Show the current user
		   *
		   *
		   *
		   */
		show: function (req, res, next) {
			var trans = new Trans({
				lang: req.params.lang, 
				file: req.params.file
			});
			
			trans.load(function (err) {
				var filter;

				if (err) {
					return 'Error: ' + err;
				}

				if (req.query.all) {
					filter = null;
				} else {
					filter = function (item) {
						return item.msgstr[0].length === 0;
					};
				}

				res.render('trans.twig', {
					'trans': trans.toArray({
						filter: filter
					})
				});
			});
		},


		/***
		   * Show the current user
		   *
		   *
		   *
		   */
		edit: function (req, res, next) {
			var trans, slug, string;

			trans = new Trans({
				lang: req.params.lang, 
				file: req.params.file
			});

			slug = req.params.slug;

			trans.load(function (err) {
				if (err) {
					return res.end('Error: ' + err);
				}

				if (!(string = this.findSlug(slug))) {
					return res.end('Error: string not found');
				}

				res.render('string.twig', {
					'string': string
				});
			});
		},


		/***
		   * Show the current user
		   *
		   *
		   *
		   */
		update: function (req, res, next) {
			var trans, slug, string;

			trans = new Trans({
				lang: req.params.lang, 
				file: req.params.file
			});

			slug = req.params.slug;

			trans.load(function (err) {
				if (err) {
					return res.end('Error: ' + err);
				}

				if (!(string = this.findSlug(slug))) {
					return res.end('Error: string not found');
				}

				trans.updateString(string, req.body.msgstr);

				trans.save(function (err) {
					if (err) {
						return res.end('Error: ' + err);
					}

					string.saved = true;

					res.render('string.twig', {
						'string': string
					});
				});
			});
		}
	};