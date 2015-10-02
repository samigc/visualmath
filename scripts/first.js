
Meteor.startup(function{

  //Global renderer
  var renderer;
  var scene;
  var camera;
  var controls;
  var tickgeoms;

  // Variables and Constraints
  init();
  animate();


  // Initialization

  function init(){
    var WIDTH = window.innerWidth - 10 ,HEIGHT = window.innerHeight - 10;
    var VIEW_ANGLE = 45,ASPECT = WIDTH / HEIGHT,NEAR = 0.1,FAR = 10000;

    var container = $('#top');
    renderer = new THREE.WebGLRenderer({alpha : true, antialias : true});
    renderer.setSize(WIDTH, HEIGHT);
    container.append(renderer.domElement);
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);
    camera.position.x = 0;
    camera.position.y = 1;
    camera.position.z = 40;

    scene = new THREE.Scene();

    //Camera initial position
    scene.add(camera);


    controls = new THREE.TrackballControls( camera );

  	controls.rotateSpeed = 3.0;
  	controls.zoomSpeed = 1.2;
  	controls.panSpeed = 0.8;

  	controls.noZoom = false;
  	controls.noPan = false;

  	controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
  	controls.addEventListener( 'change',render());

    //Make the grid
    var grid = new Array(2);
    grid[0] = new THREE.GridHelper( 50, 5 );
    grid[1] = new THREE.GridHelper( 50, 5 );
    scene.add( grid[0] );
    scene.add( grid[1] );
    grid[0].rotation.x = Math.PI/2;
    grid[0].setColors(0x111112,0xdddddd);
    grid[1].setColors(0x111112,0xdddddd);

    // Make the ticks
    //Define the tick positions


    ticksBig = [-20,-10,0,10,20];
    ticksSmall = [-15,-5,5,15];

    tickgeoms = new Array(2);

    tickgeoms[0] = new VM.Axis(ticksBig,{textSize : 1});
    tickgeoms[1] = new VM.Axis(ticksSmall,{textSize : 0.6});
    //tickgeoms[0].rotation.z = Math.PI/2

    scene.add(tickgeoms[0]).add(tickgeoms[1]);

    var kvect = new THREE.Vector3(10,4,1);
    var kk = new VM.Vector(kvect);
    scene.add(kk);

    console.log(kk);

    var vmtween = new TWEEN.Tween({
      x: kk.destination.x,
      y: kk.destination.y,
      z: kk.destination.z
  })
      .to({ x: 0 , y : 10 , z : 0 },1000)
      .onUpdate(function() {
          var newDir = new THREE.Vector3( this.x, this.y, this.z);
          kk.UpdateTarget(newDir);
      });

    vmtween.start();
    //Add the Vector
    var vector_a = new THREE.Vector3( 10, 10, 0);
    var vector_abk = new THREE.Vector3(0,0,0);
    vector_abk.copy(vector_a);
    var length = vector_a.length();
    var dir = vector_a.normalize();
    var origin = new THREE.Vector3( 0, 0, 0 );
    var vector1 = new THREE.ArrowHelper( dir, origin, length, 0xdd88cc , 0.2 , 1);
    scene.add( vector1 );

    var vector_b = new THREE.Vector3( 5, -10, -2);
    var vector_bbk = new THREE.Vector3(0,0,0);
    vector_bbk.copy(vector_b);
    var length2 = vector_b.length();
    var dir = vector_b.normalize();
    var vector2 = new THREE.ArrowHelper( dir, origin, length2, 0xddbbcc , 0.5 , 0.5);
    scene.add( vector2 );


    // attach the render-supplied DOM element

    render();

    var cameraTween = new TWEEN.Tween({pos : camera.position.x}).to({pos : -10},3000).onUpdate(function(){
      camera.position.x = this.pos;
    });

    cameraTween.start();
    //Animations
    var trickyObjTween = new TWEEN.Tween({
      x: vector_abk.x,
      y: vector_abk.y,
      z: vector_abk.z
  })
      .to({ x: 100 , y : 10 , z : 0 },1500)
      .onUpdate(function() {
          var newDir = new THREE.Vector3( this.x, this.y, this.z);
          var newLen = newDir.length();
          newDir = newDir.normalize();
          vector1.setDirection(newDir);
          vector1.setLength(newLen);
      }).to({ x: -10 , y : -10 , z : -10 },1500)
      .onUpdate(function() {
          var newDir = new THREE.Vector3( this.x, this.y, this.z);
          var newLen = newDir.length();
          newDir = newDir.normalize();
          vector1.setDirection(newDir);
          vector1.setLength(newLen);
      })

      ;

      trickyObjTween.start();
  }
  ;
  // Animation

  function animate(){
    requestAnimationFrame(animate);
    render();
    controls.update();
    TWEEN.update();
  };

  function render(){
    renderer.render(scene,camera);
    if(tickgeoms){
    for (var i = 0; i < tickgeoms.length; i++) {
      if(tickgeoms[i]){tickgeoms[i].lookAt(camera)};
    }}
  };

});
