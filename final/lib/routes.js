
Router.route('/notFound' , function(){
        this.render('notFound');
});

//Page routes


Router.route('/smart' , function(){
        this.render('smart');
});

Router.route('/simulacro' , function(){
        this.render('simulacro');
});

Router.route('/vm' , function(){
        this.render('visualmath');
});

Router.route('/contact' , function(){
        this.render('contact');
});

Router.configure({
        notFoundTemplates : 'notFound'
});

/*Route pointing to the root of the whole site*/
Router.route('/', function () {
  this.render('home');
});
Router.route('/login', function () {
  if(Meteor.userId()){
    this.render('home');
  }
  else{
  this.render('loginpage');
}
});
AccountsTemplates.configureRoute('signIn');






//////////////vm routes

Router.route('/vm/start' , function(){
        this.render('vmstart');
});

Router.route('/vm/conceptos/linealidad' , function(){
        this.render('vmlinearity');
});

Router.route('/vm/conceptos/matrices' , function(){
        this.render('vmmatricesc');
});

Router.route('/vm/conceptos/espacioshomogeneos' , function(){
        this.render('vmesphomo');
});

Router.route('/vm/transformaciones/rotacionreflexion' , function(){
        this.render('vmtrrotref');
});


Router.route('/vm/transformaciones/escalamiento' , function(){
        this.render('vmtresc');
});


Router.route('/vm/transformaciones/deformacion' , function(){
        this.render('vmtrdef');
});
