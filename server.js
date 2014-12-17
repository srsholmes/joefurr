//SSH Server Settings
// ssh root@178.62.102.137
// pwcd


var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
  	swig = require('swig'),
  	people;

var fs = require('fs');

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.use(express.static(__dirname + '/public'));

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!



app.get('/', function (req, res) {
  	res.render('index', JSON.parse(fs.readFileSync(__dirname + '/data/index.json')));

});

app.get('/portfolio', function (req, res) {
  	res.render('portfolio',  JSON.parse(fs.readFileSync(__dirname + '/data/portfolio.json')));

});

//To set up environment on server (using forever).... NODE_ENV=production forever start server.js
//
console.log(app.settings.env);

if (app.get('env') === 'development') {
	app.listen(1337);
	console.log('Application Started on http://localhost:1337/');
}

if (app.get('env') === 'production') {
	app.listen(80);
	console.log('Application Started on http://localhost:80/');
}

