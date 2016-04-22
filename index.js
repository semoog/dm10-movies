var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./config.json');

var moviesController = require('./controllers/movies_controller');
var moviesPolicies = require('./policies/movies_policies');

var logger = require('./middleware/logger');
var idParser = require('./middleware/id_parser');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));

app.use(function (req, res, next) {
  console.log(req.session);
  next();
});

// app.use(logger);
app.use(idParser);

app.get('/');
app.get('/movies', moviesController.index);
app.get('/movies/:id', moviesController.show);
app.post('/movies', moviesController.create);
app.put('/movies/:id', moviesController.update);
app.delete('/movies/:id', moviesPolicies.canDestroy, moviesController.destroy);

app.get('/favorites', function(req, res, next) {
  if (req.session.favorites) {
    res.status(200).json(req.session.favorites);
  }
  else {
    res.sendStatus(404);
  }
});

app.post('/favorites', function(req, res, next) {
  if (!req.session.favorites) {
    req.session.favorites = [];
  }
  req.session.favorites.push(req.body.name);
  res.status(200).json(req.session.favorites);
});

var port = 3000;
app.listen(port, function() {
  console.log('listening to port ', port);
});
