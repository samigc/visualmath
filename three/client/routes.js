// Routes file for the Visual Math library and Page.


//Home route
Router.route('/', function () {
  this.render('home');
});

// Presentation Route
Router.route('/presentation', function () {
  this.render('presentation');
});

// Presentation Route
Router.route('/slides', function () {
  this.render('slides');
});

//Courses
Router.route('/courses', function () {
  this.render('courses');
});
//Distance Course
Router.route('/courses/distance', function () {
  this.render('courses_distance');
});

//Distance in the space course
Router.route('/courses/distance3', function () {
  this.render('courses_distance3');
});

//Addition of vectors
Router.route('/courses/addition', function () {
  this.render('courses_addition');
});

//linearity
Router.route('/courses/linearity', function () {
  this.render('courses_linearity');
});

//matrix transformation
Router.route('/courses/matrix', function () {
  this.render('courses_matrix');
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
