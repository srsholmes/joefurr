// var express = require('express');
// var app = express();

// app.get('/hello.txt', function(req, res){
//   res.send('Hello World');
// });

// var server = app.listen(3000, function() {
//     console.log('Listening on port %d', server.address().port);
//     console.log('Hello my Lad');
// });

// var swig  = require('swig');

// swig.renderFile('public/index.html', {
    
// });


// var tpl = swig.compileFile('public/index.html');
// console.log(tpl({ article: { title: 'Swig is fun!' }}));

// console.log('swig go');

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
  	swig = require('swig'),
  	people;

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
  	res.render('index', require(__dirname + '/data/index.json'));
});

// swig.renderFile('public/index.html', {
//     pagename: 'awesome people',
//     authors: ['Paul', 'Jim', 'Jane']
// });

app.listen(1337);
console.log('Application Started on http://localhost:1337/');