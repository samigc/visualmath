Template.examples_first.rendered = function(){
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
                gl = VM.Storage.firstexample;
                location.reload();
                init(gl);
        }
        else {
                //Initialize all inside the storage
                console.log("Starting first example")
                VM.Storage.firstexample = {}
                gl = VM.Storage.firstexample;
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
                        gl.camera = new THREE.PerspectiveCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
                        gl.scene = new THREE.Scene();
                        gl.grid = new THREE.GridHelper(20,2);
                        gl.grid.rotation.x = Math.PI/2;
                        gl.grid.setColors("#334488","#88ccff");
                        gl.scene.add(gl.camera);
                        gl.scene.add(gl.grid);

                        //Initial camera position
                        gl.camera.position.x = -10;
                        gl.camera.position.y = -10;
                        gl.camera.position.z = 20;
                        gl.camera.lookAt(gl.scene.position);
                        ticks = [-10,-8,-6,-4,-2,2,4,6,8,10];
                        gl.axes = new Array(2);
                        gl.axes[0] = new VM.Axis(ticks,{textSize:0.4});
                        gl.scene.add(gl.axes[0]);
                        gl.axes[1] = new VM.Axis(ticks,{textSize:0.4});
                        gl.axes[1].rotation.z = Math.PI/2;
                        var txt = gl.axes[0].ticktexts;
                        for (var i = 0; i < txt.length; i++) {
                                txt[i].position.z += 1;
                        }
                        var txt = gl.axes[1].ticktexts;
                        for (var i = 0; i < txt.length; i++) {
                                txt[i].position.z -= 1;
                        }
                        gl.scene.add(gl.axes[1]);


                        //Now vectors !!

                        gl.vectors = new Array(800);
                        for (var i = 0; i < gl.vectors.length; i++) {
                                var vec = new THREE.Vector3(Math.sin(i)*i,Math.cos(i)*gl.vectors.length/(i*2),0);
                                gl.vectors[i] = new VM.Vector(vec);
                                gl.scene.add(gl.vectors[i])
                        }

                        for (var i = 0; i < gl.vectors.length; i++) {
                                gl.vectors[i].position.x = Math.sin(i*Math.PI*8/gl.vectors.length)*i/60;
                                gl.vectors[i].position.y = Math.cos(i*Math.PI*8/gl.vectors.length)*i/60;
                        }

                }

                //Render the scene in the current Page
                gl.container = $('#top');
        	//There seems to be no problem with appending the canvas again since the object reference is the same.
                gl.container.append(gl.renderer.domElement);
                drawWindow();
        }

        function renderView(){
                step +=0.01;
                requestAnimationFrame(renderView);
                gl.axes[0].lookAt(gl.camera);
                gl.axes[1].lookAt(gl.camera);
                gl.renderer.render(gl.scene,gl.camera);
                for (var i = 0; i < gl.vectors.length; i++) {
                        var vec = new THREE.Vector3(Math.sin(step)*i*0.01+Math.sin(step*10)+Math.sin(step*40)*0.1
                                                                           ,Math.cos(step)*i*0.01+Math.cos(step*10)+Math.cos(step*40)*0.1,
                                                                           i*10/gl.vectors.length);
                        gl.vectors[i].UpdateTarget(vec);
                }
                gl.camera.position.x = Math.sin(step)*20;
                gl.camera.position.y = Math.cos(step)*20;
                gl.camera.position.z = Math.sin(step)*30;
                gl.camera.lookAt(gl.scene.position)
        }

}
