Template.courses_addition.rendered = function() {

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
                  gl.camera.position.x = 17;
                  gl.camera.position.y = 12;
                  gl.camera.position.z = 8;
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


                  //Now draw two vectors
                  gl.vector = {v3 : new Array(3) , geom : new Array(3)};
                  gl.vector.v3[0] = VM.V3(5,6,2);
                  gl.vector.v3[1] = VM.V3(-4,-8,3);
                  //Third vector is addition of first two vectors
                  gl.vector.v3[2] = VM.V3();
                  gl.vector.v3[2].addVectors(gl.vector.v3[0],gl.vector.v3[1]);
                  gl.activevector = undefined;


                  for (var i = 0; i < gl.vector.geom.length; i++) {
                          var vborn = new VM.V3().copy(gl.vector.v3[i]);
                          gl.vector.geom[i] = new VM.Vector(vborn);
                          gl.vector.geom[i].setColor(0x0099ff);
                          gl.scene.add(gl.vector.geom[i]);
                  }
                  //Render the scene in the current Page
                  gl.container = $('.courses_distance');
                  gl.vector.geom[0].activateTag("u",{top : 50 , fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectoru"});
                   gl.vector.geom[1].activateTag("v",{top : 50 , fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorv"});
                    gl.vector.geom[2].activateTag("u + v",{top : 50 ,fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorvu"});
                     $("#vectoru").css('opacity',0);
                     $("#vectorv").css('opacity',0);
                     $("#vectorvu").css('opacity',0);

                  gl.vector.geom[2].setColor(0x003d99);
                  //Translate the second vector to the head of the first
                  gl.vector.geom[1].translateTo(gl.vector.v3[0]);
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
                      $("#vectoru").css('opacity',this.t);
                    }
                  )
                  .start();

                  var v2scale = new TWEEN.Tween({t:0.001})
                  .to({t:1}, 2000).onUpdate(
                    function() {
                      var vborn = new VM.V3().copy(gl.vector.v3[1]);
                      vborn.multiplyScalar(this.t)
                      gl.vector.geom[1].UpdateTarget(vborn);
                       $("#vectorv").css('opacity',this.t);
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
                       $("#vectorvu").css('opacity',this.t);
                    }
                  )
                  .delay(4000)
                  .start();

          }

          //Now add the domevent
          var domEvents = new THREEx.DomEvents(gl.camera,gl.renderer.domElement);

          //If the vector is clicked in its cone , then it is the active vector
          domEvents.addEventListener(gl.vector.geom[1].vectorObject.cone,'click',
          function(e){
                  gl.activevector = gl.vector.geom[1];

          },false);
          domEvents.addEventListener(gl.vector.geom[0].vectorObject.cone,'click',
          function(e){
                  gl.activevector = gl.vector.geom[0];
          },false);


          //There seems to be no problem with appending the canvas again since the object reference is the same.
          gl.container.append(gl.renderer.domElement);
          drawWindow();
  }

  function renderView(){
          step +=0.01;

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

          if(gl.activevector){
                  var cont = VM.keyControls(gl.activevector.destination);
                  gl.activevector.UpdateTarget(cont);
                  gl.vector.geom[1].translateTo(gl.vector.geom[0].destination);
                  gl.vector.geom[2].UpdateTarget(VM.V3().addVectors(gl.vector.geom[0].destination,gl.vector.geom[1].destination));
                  console.log(gl.activevector.destination);
          };
        /*  console.log("\\begin{pmatrix}"+
          VM.Round(gl.vector.v3[0].x) +"\\\\"+
           VM.Round(gl.vector.v3[0].y) +"\\\\"+
            VM.Round(gl.vector.v3[0].z)+"\\end{pmatrix} + \\begin{pmatrix}"+
            VM.Round(gl.vector.v3[1].x) +"\\\\"+
             VM.Round(gl.vector.v3[1].y) +"\\\\"+
              VM.Round(gl.vector.v3[1].z)+ "\\end{pmatrix} =\\begin{pmatrix}"+
              VM.Round(gl.vector.v3[2].x) +"\\\\"+
               VM.Round(gl.vector.v3[2].y) +"\\\\"+
                VM.Round(gl.vector.v3[2].z)+"\\end{pmatrix}")*/
          var elem=$("#katexfield3")
          katex.render("\\begin{pmatrix}"+
          VM.Round(gl.vector.geom[0].destination.x) +"\\\\"+
           VM.Round(gl.vector.geom[0].destination.y) +"\\\\"+
            VM.Round(gl.vector.geom[0].destination.z)+"\\end{pmatrix} + \\begin{pmatrix}"+
            VM.Round(gl.vector.geom[1].destination.x) +"\\\\"+
             VM.Round(gl.vector.geom[1].destination.y) +"\\\\"+
              VM.Round(gl.vector.geom[1].destination.z)+ "\\end{pmatrix} =\\begin{pmatrix}"+
              VM.Round(gl.vector.geom[2].destination.x) +"\\\\"+
               VM.Round(gl.vector.geom[2].destination.y) +"\\\\"+
                VM.Round(gl.vector.geom[2].destination.z)+"\\end{pmatrix}",elem.get(0));

  }

}
