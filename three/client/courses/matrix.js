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

                        //Create container
                        gl.container=$(".courses_distance");

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

                        gl.m3 = new THREE.Matrix3() ;
                        //console.log(gl.m3);
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

                         for (var i = 0; i < gl.vector.v3.length; i++) {
                                 gl.vector.v3[i].transvec = VM.V3();
                         }

                        var geometry = new THREE.Geometry();
                        geometry.vertices.push(
                                gl.vector.v3[0],
                                gl.vector.v3[1],
                                gl.vector.v3[2],
                                gl.vector.v3[0]
                        );

                        var line = new THREE.Line( geometry, material );
                        gl.scene.add( line );
                        console.log(line);
                }
                gl.line = line;
                gl.container.append(gl.renderer.domElement);
                drawWindow();
                gl.def= false;
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
                //console.log(gl.m3.elements);
                if(gl.def){
                for (var i = 0; i < gl.vector.geom.length; i++) {
                        gl.vector.geom[i].UpdateTarget(gl.vector.v3[i].transvec)
                }
                }

                gl.line.geometry.vertices[0] = gl.vector.geom[0].destination;
                                gl.line.geometry.vertices[1] = gl.vector.geom[1].destination;
                                                gl.line.geometry.vertices[2] = gl.vector.geom[2].destination;
                                                                gl.line.geometry.vertices[3] = gl.vector.geom[0].destination;

                console.log(gl.line.geometry.vertices[1]);
                gl.line.geometry.verticesNeedUpdate = true;
                //console.log(gl.vector.v3);
                //console.log(a11);
        }

}

Template.addform.events({
        'submit form' : function (event) {
                event.preventDefault();
                gl = VM.Storage.secondexample;
                 var a11=event.target.a11.value;
                 a12=event.target.a12.value;
                 a13=event.target.a13.value;
                 a21=event.target.a21.value;
                 a22=event.target.a22.value;
                 a23=event.target.a23.value;
                 a31=event.target.a31.value;
                 a32=event.target.a32.value;
                 a33=event.target.a33.value;
                 gl.m3.set(a11,a12,a13,a21,a22,a23,a31,a32,a33);
                 for (var i = 0; i < gl.vector.v3.length; i++) {
                         gl.vector.v3[i].transvec.copy(gl.vector.v3[i]);
                         gl.vector.v3[i].transvec.applyMatrix3(gl.m3);
                 }
                 gl.def = true;
                 //gl.vector.v3[1].transvec.copy(gl.vector.v3[1]);
                 //gl.vector.v3[1].transvec.applyMatrix3(gl.m3);
                 //console.log(gl.m3);

                                         elem=$("#katexfield5")
                                         katex.render("\\begin{pmatrix} "+
                                         a11+"&"+a12 +"&"+a13 +"\\\\"+
                                         a21+"&"+a22 +"&"+a23 +"\\\\"+
                                         a31+"&"+a32 +"&"+a33 +
                                          "\\end{pmatrix}",elem.get(0));
                return false;

        }
})
