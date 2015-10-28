Template.courses_linearity.rendered = function() {

  var gl;
  var step = 0;

  window.addEventListener( 'resize', drawWindow, false );

  function drawWindow(){
    if(gl.renderer){
      //  gl.WIDTH = window.innerWidth - 10;
      //gl.HEIGHT = window.innerHeight - 10;
      gl.ASPECT = gl.WIDTH / gl.HEIGHT;
      gl.camera.aspect = gl.ASPECT;
      gl.camera.updateProjectionMatrix();
      gl.renderer.setSize( gl.WIDTH, gl.HEIGHT );
      gl.renderer.render(gl.scene,gl.camera);
    }
  }

  if(VM.Storage.firstexample){
    location.reload();
    //Recover from detached context
    console.log("Recovering from lost context")
    gl = VM.Storage.secondexample;
    location.reload();
    init(gl);
  }
  else {
    //Initialize all inside the storage
    console.log("Starting second example")
    VM.Storage.secondexample = {}
    gl = VM.Storage.secondexample;
    init(gl)
    renderView();
  }

  function init(gl){
    //Redraw camera calculating variables
    gl.WIDTH = 800;
    gl.HEIGHT = 600;
    gl.ASPECT = gl.WIDTH / gl.HEIGHT;
    gl.VIEW_ANGLE = 45
    gl.NEAR = 0.1;
    gl.FAR = 10000;
    //Check if renderer exists to not to re-initi the scene and just redraw it.
    if(!gl.renderer) {
      //Initialize the Scene
      console.log("Initializing the scene for the first time");
      gl.renderer = new THREE.WebGLRenderer({alpha : true, antialias : true});
      gl.scene = new THREE.Scene();
      gl.camera = new THREE.PerspectiveCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
      gl.scene.add(gl.camera);

      gl.grid = new THREE.GridHelper(20,2);
      gl.grid.rotation.x = Math.PI/2;
      gl.grid.setColors("#338844","#88ddaa");

      gl.scene.add(gl.grid);

      gl.grid = new THREE.GridHelper(20,2);
      gl.grid.setColors("#338844","#88ddaa");

      gl.scene.add(gl.grid);

      //Initial camera position
      gl.camera.position.x = 17.56;
      gl.camera.position.y = 5.2;
      gl.camera.position.z = 6.7;
      gl.camera.lookAt(gl.scene.position);

      //Controls (?move to VM)
      gl.controls = new THREE.TrackballControls( gl.camera );
      gl.controls.addEventListener( 'change', renderView );
      gl.controls.rotateSpeed = 2.0;
      gl.controls.zoomSpeed = 1.2;
      gl.controls.panSpeed = 1.2;
      gl.controls.noZoom = false;
      gl.controls.noPan = false;
      gl.controls.staticMoving = true;
      gl.controls.dynamicDampingFactor = 0.3;
      gl.controls.target = VM.V3( 0.53, -7.25, -1.31);

      ticks = [-10,-8,-6,-4,-2,2,4,6,8,10];
      gl.axes = new Array(3);
      gl.axes[0] = new VM.Axis(ticks,{textSize:0.4});
      gl.scene.add(gl.axes[0]);
      gl.axes[1] = new VM.Axis(ticks,{textSize:0.4});
      gl.axes[1].rotation.z = Math.PI/2;
      gl.scene.add(gl.axes[1]);
      gl.axes[2] = new VM.Axis(ticks,{textSize:0.4});
      gl.axes[2].rotation.y = Math.PI/2;
      gl.scene.add(gl.axes[2]);

      //Now draw the basis

      gl.base= {v3 : new Array(3), geom : new Array(3)};
for (var i = 0; i < gl.base.v3.length; i++) {
  gl.base.v3[i]=VM.V3(0,0,0);
    gl.base.v3[i].setComponent(i,1);
};

for (var i = 0; i < gl.base.geom.length; i++) {
        var vborn = new VM.V3().copy(gl.base.v3[i]);
        gl.base.geom[i] = new VM.Vector(vborn);
        gl.base.geom[i].setColor(0xff0033);
        gl.scene.add(gl.base.geom[i]);
}

  //Now draw the vector projections
      gl.vector= {v3 : new Array(4), geom : new Array(4)};

      gl.vector.v3[3] = VM.V3(8,-6,7);
      gl.vector.v3[0] = VM.V3(gl.vector.v3[3].x,0,0);
      gl.vector.v3[1] = VM.V3(0,gl.vector.v3[3].y,0);
      gl.vector.v3[2] = VM.V3(0,0,gl.vector.v3[3].z);

      for (var i = 0; i < gl.vector.geom.length; i++) {
              var vborn = new VM.V3().copy(gl.vector.v3[i]);
              gl.vector.geom[i] = new VM.Vector(vborn);
              gl.vector.geom[i].setColor(0x0099ff);
              gl.scene.add(gl.vector.geom[i]);
      }
      gl.vector.geom[3].setColor(0x004d99);

      //Translate the vectors to the path
      gl.vector.geom[1].translateTo(gl.vector.v3[0]);
      var sumavect01 = VM.V3();
      sumavect01.addVectors(gl.vector.v3[0],gl.vector.v3[1])
      gl.vector.geom[2].translateTo(sumavect01 );

      //Render it in the container  and put the tags
      gl.container = $('.courses_distance');

      gl.vector.geom[0].activateTag("v_{x} \\cdot {\\hat{i}}",{top : 50 , fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorvx"});
       gl.vector.geom[1].activateTag("v_{y} \\cdot {\\hat{j}}",{top : 50 , fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorvy"});
        gl.vector.geom[2].activateTag("v_{z} \\cdot {\\hat{k}}",{top : 50 ,fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorvz"});
        gl.vector.geom[3].activateTag("v",{top : 50 ,fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorv"});
         $("#vectorvx").css('opacity',0);
         $("#vectorvy").css('opacity',0);
         $("#vectorvz").css('opacity',0);
         $("#vectorv").css('opacity',0);

         for (var i = 0; i < gl.vector.geom.length; i++) {
                 var vdir = VM.V3().copy(gl.vector.geom[i].destination);
                 vdir.multiplyScalar(0.001)
                 gl.vector.geom[i].UpdateTarget(vdir);
         }

         var v1scale = new TWEEN.Tween({t:0.001})
         .to({t:1}, 2000).onUpdate(
           function() {
             var vborn = new VM.V3().copy(gl.vector.v3[0]);
             vborn.multiplyScalar(this.t)
             gl.vector.geom[0].UpdateTarget(vborn);
             $("#vectorvx").css('opacity',this.t);
           }
         )
         .start();

         var v2scale = new TWEEN.Tween({t:0.001})
         .to({t:1}, 2000).onUpdate(
           function() {
             var vborn = new VM.V3().copy(gl.vector.v3[1]);
             vborn.multiplyScalar(this.t)
             gl.vector.geom[1].UpdateTarget(vborn);
             $("#vectorvy").css('opacity',this.t);
           }
         )
         .delay(2000)
         .start();

         var v3scale = new TWEEN.Tween({t:0.001})
         .to({t:1}, 2000).onUpdate(
           function() {
             var vborn = new VM.V3().copy(gl.vector.v3[2]);
             vborn.multiplyScalar(this.t)
             gl.vector.geom[2].UpdateTarget(vborn);
             $("#vectorvz").css('opacity',this.t);
           }
         )
         .delay(4000)
         .start();

         var vscale = new TWEEN.Tween({t:0.001})
         .to({t:1}, 2000).onUpdate(
           function() {
             var vborn = new VM.V3().copy(gl.vector.v3[3]);
             vborn.multiplyScalar(this.t)
             gl.vector.geom[3].UpdateTarget(vborn);
             $("#vectorv").css('opacity',this.t);
           }
         )
         .delay(6000)
         .start();

    }
    gl.container.append(gl.renderer.domElement);
    drawWindow();
  }


  function renderView() {
    step += 0.01;
    gl.controls.update();

    TWEEN.update();

    for (var i = 0; i < gl.vector.geom.length; i++) {
            gl.vector.geom[i].updateTag(gl.camera,gl.renderer);
    }

    gl.controls.update();
    requestAnimationFrame(renderView);
    gl.axes[0].lookAt(gl.camera);
    gl.axes[1].lookAt(gl.camera);
    gl.axes[2].lookAt(gl.camera);
    gl.renderer.render(gl.scene,gl.camera);
    gl.camera.lookAt(gl.scene.position);

    var up= VM.keyControls(gl.vector.geom[3].destination,0.1);
    var ejex = new VM.V3(up.x,0,0);
    var ejey = new VM.V3(0,up.y,0);
    gl.vector.geom[1].translateTo(gl.vector.geom[0].destination);
    var ejez = new VM.V3(0,0,up.z);
    gl.vector.geom[2].translateTo(VM.V3().addVectors(gl.vector.geom[1].destination, gl.vector.geom[1].translation));

    gl.vector.geom[3].UpdateTarget(up);
    gl.vector.geom[0].UpdateTarget(ejex);
    gl.vector.geom[1].UpdateTarget(ejey);
    gl.vector.geom[2].UpdateTarget(ejez);

  }

}
