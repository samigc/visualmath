Template.examples_second.rendered = function(){
        var gl;
        var step = 0;

        window.addEventListener( 'resize', drawWindow, false );

        function drawWindow(){
                if(gl.renderer){
                        gl.WIDTH = window.innerWidth - 10;
                        gl.HEIGHT = window.innerHeight - 10;
                        gl.ASPECT = gl.WIDTH / gl.HEIGHT;
                        gl.camera.aspect = gl.ASPECT;
                        gl.camera.updateProjectionMatrix();
                        gl.renderer.setSize( gl.WIDTH, gl.HEIGHT );
                        gl.renderer.render(gl.scene,gl.camera);
                }
        }

        if(VM.Storage.firstexample){
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
                gl.WIDTH = window.innerWidth - 10;
                gl.HEIGHT = window.innerHeight - 10;
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
                        gl.camera.position.x = 15;
                        gl.camera.position.y = 15;
                        gl.camera.position.z = 15;
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
                        gl.vector.v3[0] = VM.V3(5,0,0);
                        gl.vector.v3[1] = VM.V3(0,5,0);
                        //Third vector is addition of first two vectors
                        gl.vector.v3[2] = VM.V3();
                        gl.vector.v3[2].addVectors(gl.vector.v3[0],gl.vector.v3[1]);
                        gl.activevector = undefined;

                        var coordstr  = "A : " + VM.V3String(gl.vector.v3[0]) + "B : " +VM.V3String(gl.vector.v3[1])  + " = C : "  + VM.V3String(gl.vector.v3[2]) ;
                        $("#secveccoord").html(coordstr);
                        for (var i = 0; i < gl.vector.geom.length; i++) {

                                gl.vector.geom[i] = new VM.Vector(gl.vector.v3[i]);
                                gl.vector.geom[i].setColor(0xff0000)
                                gl.scene.add(gl.vector.geom[i]);
                        }
                        gl.vector.geom[2].setColor(0x0000ff);
                        //Translate the second vector to the head of the first
                        gl.vector.geom[1].translateTo(gl.vector.v3[0]);


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

                //Render the scene in the current Page
                gl.container = $('#top');

                //katex.render("c = \\pm\\sqrt{a^2 + b^2}", gl.container[0]);
                //There seems to be no problem with appending the canvas again since the object reference is the same.
                gl.container.append(gl.renderer.domElement);
                drawWindow();

        }

        function renderView(){
                step +=0.01;
                gl.controls.update();
                requestAnimationFrame(renderView);
                gl.axes[0].lookAt(gl.camera);
                gl.axes[1].lookAt(gl.camera);
                gl.axes[2].lookAt(gl.camera);
                gl.renderer.render(gl.scene,gl.camera);
                gl.camera.lookAt(gl.scene.position)
                if(gl.activevector){
                        var up = VM.keyControls(gl.activevector.destination);
                        gl.activevector.UpdateTarget(up);
                }
                //Retrieve vector heads
                gl.vector.v3[0].copy(gl.vector.geom[0].destination);
                gl.vector.v3[1].copy(gl.vector.geom[1].destination);
                gl.vector.v3[2].addVectors(gl.vector.v3[0],gl.vector.v3[1]);
                gl.vector.geom[2].UpdateTarget(gl.vector.v3[2]);
                //Translate vector to head
                gl.vector.geom[1].translateTo(gl.vector.v3[0]);

                //Print coordinates
                gl.coordstr  = "A : " + VM.V3String(gl.vector.v3[0]) + " + <br>B : " +VM.V3String(gl.vector.v3[1])  + " <br>= C : "  + VM.V3String(gl.vector.v3[2]) ;
                $("#secveccoord").html(gl.coordstr);

                //Update vector tags
                var position = THREEx.ObjCoord.cssPosition(gl.vector.geom[0].cone , gl.camera , gl.renderer);
                $("#veca").css('left',(position.x-$("#veca").width() /2)+'px');
                $("#veca").css('top',(position.y-$("#veca").height() /2)+'px');
                var position = THREEx.ObjCoord.cssPosition(gl.vector.geom[1].cone , gl.camera , gl.renderer);
                $("#vecb").css('left',(position.x-$("#vecb").width() /2)+'px');
                $("#vecb").css('top',(position.y-$("#vecb").height() /2)+'px');

        }



}
