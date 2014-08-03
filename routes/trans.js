
	var app 	= require('neasy');
	var Trans 	= require('../controllers/trans.js');

    // show the list of languages to translate
	app.get('/', Trans.index);

    // show the list of files to translate
    app.get('/commit', Trans.commit);

    // show the list of files to translate
    app.get('/:lang', Trans.files);

    // show a strings list
    app.get('/:lang/:file', Trans.show);

    // parse files
    app.get('/:lang/:file/reload', Trans.reload);

    // edit and update a string
    app.get('/:lang/:file/:slug', Trans.edit);
    app.post('/:lang/:file/:slug', Trans.update);