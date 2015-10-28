Template.courses_matrix.rendered = function() {

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
                gl.HEIGHT = 800;
                gl.ASPECT = gl.WIDTH / gl.HEIGHT;
                gl.VIEW_ANGLE = 45
                gl.NEAR = 0.1;
                gl.FAR = 10000;
                //Check if renderer exists to not to re-initi the scene and just redraw it.
                if(!gl.renderer) {
                        //Initialize the Scene
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

                        //Draw vctors
                        gl.vector = {v3: new Array(3), geom: new Array(3) };
                        for (var i = 0; i < gl.vector.v3.length; i++) {
                                gl.vector.v3[i]=VM.V3(Math.random()*20,Math.random()*20,Math.random()*20)
                                                                        .multiplyScalar((Math.random()-0.5))
                        }

                        for (var i = 0; i < gl.vector.geom.length; i++) {
                                var vborn = new VM.V3().copy(gl.vector.v3[i]);
                                gl.vector.geom[i] = new VM.Vector(vborn);
                                gl.vector.geom[i].setColor(0x0099ff);
                                gl.scene.add(gl.vector.geom[i]);
                        }
                        var material = new THREE.LineBasicMaterial({
                                color: 0x0000ff
                        });

                        var geometry = new THREE.Geometry();
                        geometry.vertices.push(
                                gl.vector.v3[0],
                                gl.vector.v3[1],
                                gl.vector.v3[2],
                                gl.vector.v3[0]
                        );

                        var line = new THREE.Line( geometry, material );
                        gl.scene.add( line );


                        gl.container=$(".courses_distance");


                }
                gl.container.append(gl.renderer.domElement);
                drawWindow();
        }


        function renderView() {
                step += 0.01;

                gl.controls.update();
                requestAnimationFrame(renderView);
                gl.axes[0].lookAt(gl.camera);
                gl.axes[1].lookAt(gl.camera);
                gl.axes[2].lookAt(gl.camera);
                gl.renderer.render(gl.scene,gl.camera);
                gl.camera.lookAt(gl.scene.position);

        }

}

Template.courses_matrix.events({
        "submit .matrixinput": function (event) {


                console.log($("#a11").get(0));
                return false;

        }
})
