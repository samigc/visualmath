Template.courses_distance.rendered = function(){

  var gl;
  var step = 0;

  window.addEventListener( 'resize', drawWindow, false );

  function drawWindow(){
    if(gl.renderer){
      //gl.WIDTH = window.innerWidth - 10;
      //gl.HEIGHT = window.innerHeight - 10;
      gl.ASPECT = gl.WIDTH / gl.HEIGHT;
      gl.camera.aspect = gl.ASPECT;
      gl.camera.updateProjectionMatrix();
      console.log(gl.WIDTH);;
      gl.renderer.setSize( gl.WIDTH, gl.HEIGHT );
      gl.renderer.render(gl.scene,gl.camera);
    }
  }


  if(VM.Storage.distance){
    //Recover from detached context
    console.log("Recovering from lost context")
    VM.Storage.distance = {}
    gl = VM.Storage.distance;
    init(gl);
  }
  else {
    //Initialize all inside the storage
    console.log("Starting first example")
    VM.Storage.distance = {}
    gl =VM.Storage.distance;
    init(gl);

  }

  function init(gl){

    //Redraw camera calculating variables
    gl.WIDTH = 800;
    gl.HEIGHT =  600;
    gl.ASPECT = gl.WIDTH / gl.HEIGHT;
    gl.VIEW_ANGLE = 45
    gl.NEAR = 0.1;
    gl.stepp = 0;
    gl.FAR = 10000;
    //Check if renderer exists to not to re-initi the scene and just redraw it.
    if(!gl.renderer) {
      //Initialize the Scene
      console.log("Initializing the scene for the first time");
      gl.renderer = new THREE.WebGLRenderer({alpha : true, antialias : true});
      gl.camera = new THREE.PerspectiveCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
      gl.scene = new THREE.Scene();
      gl.grid = new THREE.GridHelper(20,2);
      gl.grid.rotation.x = Math.PI/2;
      gl.grid.setColors("#334488","#88ccff");
      gl.scene.add(gl.camera);
      gl.scene.add(gl.grid);
      //controls
      console.log(gl.renderer.domElement);
      gl.controls = new THREE.TrackballControls( gl.camera);
      gl.controls.target = new VM.V3(4,4,0);
      gl.controls.addEventListener( 'change', renderView );
      gl.controls.rotateSpeed = 2.0;
      gl.controls.zoomSpeed = 1.2;
      gl.controls.panSpeed = 1.2;
      gl.controls.noZoom = false;
      gl.controls.noPan = false;
      gl.controls.staticMoving = true;
      gl.controls.dynamicDampingFactor = 0.3;
      //Initial camera position
      gl.camera.position.x = -3;
      gl.camera.position.y = 5;
      gl.camera.position.z = 13.5;
      ticks = [-10,-8,-6,-4,-2,2,4,6,8,10];
      gl.axes = new Array(2);
      gl.axes[0] = new VM.Axis(ticks,{textSize:0.4});
      gl.scene.add(gl.axes[0]);
      gl.axes[1] = new VM.Axis(ticks,{textSize:0.4});
      gl.axes[1].rotation.z = Math.PI/2;

      gl.scene.add(gl.axes[1]);


      //Now vectors !!
      var vinit={x: 4, y:6, z: 0};
      var  v_xf={x:4, y:0, z:0};
      var v_yf={x: 0, y:6, z: 0};
      gl.v_x= new VM.Vector(VM.V3(4,6));
      gl.v_y= new VM.Vector(VM.V3(4,6));
      gl.v_y2=new VM.Vector(VM.V3(4,6));
      gl.scene.add(gl.v_x).add(gl.v_y2).add(gl.v_y);

      var proyx= new TWEEN.Tween(vinit)
      .to(v_xf, 2000 ).onUpdate(function () {
        gl.v_x.UpdateTarget(VM.V3(this.x, this.y, this.z))
      })
      .start();

      var proyy= new TWEEN.Tween(vinit)
      .to(v_yf, 2000 )
      .onUpdate(function () {
        gl.v_y.UpdateTarget(VM.V3(this.x, this.y, this.z))})
        .start();

        gl.container = $('.courses_distance');

        gl.v_x.activateTag("v_{x}",{id: "vecx", jQueryContainer : gl.container , katex : true});
        gl.v_y.activateTag("v_{y}",{id: "vecy", jQueryContainer : gl.container , katex : true});
        gl.v_y2.activateTag("v",{id: "vec", jQueryContainer : gl.container, katex : true});
      }

      //Render the scene in the current Page

      //There seems to be no problem with appending the canvas again since the object reference is the same.
      gl.container.append(gl.renderer.domElement);
      drawWindow();
      renderView();
    }

    function renderView(){
      step +=0.01;
      gl.controls.update();
      //gl.camera.lookAt(new VM.V3(4,4,0));
      requestAnimationFrame(renderView);

      TWEEN.update();

      gl.axes[0].lookAt(gl.camera);
      gl.axes[1].lookAt(gl.camera);
      gl.renderer.render(gl.scene,gl.camera);

      var positionx = THREEx.ObjCoord.cssPosition(gl.axes[0].ticktexts[9] , gl.camera , gl.renderer);
      $("#axisx").css('left',(positionx.x-$("#axisx").width() /2)+40+600+'px');
      $("#axisx").css('top',(positionx.y-$("#axisx").height() /2)+'px');

      var positiony = THREEx.ObjCoord.cssPosition(gl.axes[1].ticktexts[9] , gl.camera , gl.renderer);
      $("#axisy").css('left',(positiony.x-$("#axisy").width() /2)+600+'px');
      $("#axisy").css('top',(positiony.y-$("#axisy").height() /2)+'px');

      gl.v_x.updateTag(gl.camera,gl.renderer);
      gl.v_y.updateTag(gl.camera,gl.renderer);
      gl.v_y2.updateTag(gl.camera,gl.renderer);

      var up = VM.keyControls(gl.v_y2.destination,0.1,{z:true});
      var ejey = new VM.V3(0,up.y,0);
      var ejex = new VM.V3(up.x,0,0);
      gl.v_y2.UpdateTarget(up);
      gl.v_y.UpdateTarget(ejey);
      gl.v_x.UpdateTarget(ejex);

      var elem= $("#katexfield1")
      katex.render(VM.Round(gl.v_y2.destination.length()) +"^{2}="+VM.Round(gl.v_x.destination.length()) +"^{2}+"+ VM.Round(gl.v_y.destination.length())+"^{2}",elem.get(0) )
      //console.log(gl.v_y.destination.length());
    }


  }
