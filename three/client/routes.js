// Routes file for the Visual Math library and Page.


//Home route
Router.route('/', function () {
  this.render('home');
});

// Presentation Route
Router.route('/presentation', function () {
  this.render('presentation');
});

//Examples  routes
Router.route('/examples', function () {
  this.render('examples');
});

Router.route('/examples/first', function () {
  this.render('examples_first');
});

Router.route('/examples/second', function () {
  this.render('examples_second');
});
