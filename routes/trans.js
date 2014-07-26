
	var app 	= require('neasy');
	var Trans 	= require('../controllers/trans.js');
	
    // show the list of files to translate
	app.get('/', Trans.index);

    // show a strings list
    app.get('/:lang/:file', Trans.show);

    // edit and update a string
    app.get('/:lang/:file/:slug', Trans.edit);
    app.post('/:lang/:file/:slug', Trans.update);