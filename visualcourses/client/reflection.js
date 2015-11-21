Template.matreft.rendered = function(){
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
                gl.zlock = false;
                //Redraw camera calculating variables


                gl.WIDTH = window.innerWidth - 10;
                gl.HEIGHT = window.innerHeight - 10;
                gl.ASPECT = gl.WIDTH / gl.HEIGHT;
                gl.VIEW_ANGLE = 45;
                gl.NEAR = 0.1;
                gl.FAR = 100000;


                //Check if renderer exists to not to re-initi the scene and just redraw it.
                if(!gl.renderer) {
                        //Initialize the Scene
                        console.log("Initializing the scene for the first time");
                        gl.renderer = new THREE.WebGLRenderer({alpha : true, antialias : true});
                        //gl.camera = new THREE.OrthographicCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
		     gl.camera = new THREE.OrthographicCamera(-10 * gl.ASPECT ,10 * gl.ASPECT,10,-10,gl.NEAR,gl.FAR);
		     gl.scene = new THREE.Scene();
                        gl.grid = new THREE.GridHelper(20,2);
                        gl.grid.rotation.x = Math.PI/2;
                        gl.grid.setColors("#334488","#88ccff");
                        gl.scene.add(gl.camera);
                        gl.scene.add(gl.grid);


			gl.controls = new THREE.TrackballControls( gl.camera );
                        gl.controls.addEventListener( 'change', renderView );
                        gl.controls.rotateSpeed = 2.0;
                        gl.controls.zoomSpeed = 1.2;
                        gl.controls.panSpeed = 1.2;
                        gl.controls.noZoom = false;
                        gl.controls.noPan = false;
                        gl.controls.staticMoving = true;
                        gl.controls.dynamicDampingFactor = 0.3;
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




			var light = new THREE.AmbientLight( 0xffffff );
				light.position.set( 20, 10, 50 );
				gl.scene.add( light );

			gl.refplane= {};
			gl.refplane.geom = new THREE.PlaneGeometry(10,10,20,20);
			gl.refplane.material2 = new THREE.LineBasicMaterial();
			gl.refplane.material = new THREE.MeshLambertMaterial({color: 0x00ff00, transparent: true, opacity: 0.5});
			gl.refplane.material.side = THREE.DoubleSide;
			gl.refplane.mesh = new THREE.Mesh(gl.refplane.geom,gl.refplane.material);
			gl.scene.add(gl.refplane.mesh);

			var geometry = new THREE.PlaneGeometry( 5, 5,2,2 );

			var textures = [THREE.ImageUtils.loadTexture( '/textures/lion.jpg', THREE.UVMapping, renderView ),
		THREE.ImageUtils.loadTexture( '/textures/noil.jpg', THREE.UVMapping, renderView ),
	THREE.ImageUtils.loadTexture( '/textures/blu.jpg', THREE.UVMapping, renderView )];
			textures[0].minFilter = THREE.NearestFilter
			var material = new THREE.MeshLambertMaterial({map: textures[0]})
			material.side = THREE.DoubleSide;
			var materials = [new THREE.MeshLambertMaterial( { map: textures[1] } ),
			new THREE.MeshLambertMaterial( { map: textures[2] } ),
			new THREE.MeshLambertMaterial( { map: textures[0] } ),
			new THREE.MeshLambertMaterial( { map: textures[2] } ),
			new THREE.MeshLambertMaterial( { map: textures[1] } ),
			new THREE.MeshLambertMaterial( { map: textures[0] } )];

			mesh = new THREE.Mesh( geometry, material );
			gl.scene.add( mesh );
			mesh.matrix.set(Math.cos(Math.PI/4),0,Math.sin(Math.PI/4),0,
						 0,1,0,0,
					 	-Math.sin(Math.PI/4),0,Math.cos(Math.PI/4),0,
						0,0,0,1);

				mesh2= new THREE.Mesh(geometry,material);
			gl.scene.add(mesh2);
			mesh2.position.set(6,6,0);
			console.log(gl);
			mesh.matrixAutoUpdate = false;
                }
		console.log(mesh.matrix)

                $('a#z-button').click(function(){
        $(this).toggleClass("down");
        gl.zlock = !(gl.zlock);

        if(gl.zlock){
                gl.camera.rotation.set(new THREE.Vector3( 0, 0,0));
                gl.camera.position.x = 0;
                gl.camera.position.y = 0;
                gl.zlockz = gl.camera.position.z;
                gl.camera.position.z = gl.zlockz;;
                gl.camera.lookAt(gl.scene.position);
        }

    });

                //Render the scene in the current Page
                gl.container = $('#top');
        	//There seems to be no problem with appending the canvas again since the object reference is the same.
                gl.container.append(gl.renderer.domElement);
                drawWindow();
                theta = 0.1;
		gl.vars={};
		gl.vars.a=1;
		gl.vars.b=1;
		gl.vars.c=1;
		console.log(gl);
        }

        function renderView(){
                step +=0.01;
                requestAnimationFrame(renderView);
                gl.axes[0].lookAt(gl.camera);
                gl.axes[1].lookAt(gl.camera);
                if(gl.zlock){

                        gl.camera.position.z = gl.zlockz;
                        gl.camera.lookAt(VM.V3(gl.camera.position.x,gl.camera.position.y,gl.zlockz));
                }
                gl.renderer.render(gl.scene,gl.camera);
		gl.controls.update();
                  theta += 0;

                  gl.rotvec = VM.V3();
                  gl.rotvec = VM.keyControls(gl.rotvec,0.01);
                  theta += gl.rotvec.x;
                  //console.log(gl.rotvec.x);
		  gl.vars.a += gl.rotvec.x;
		 gl.vars.b += gl.rotvec.y;
		 gl.vars.c += gl.rotvec.z

		  var a = gl.vars.a;
		  var b = gl.vars.b;
		  var c = gl.vars.c;

		  //console.log([a,b,c]);

		  gl.refplane.mesh.matrix.set(    a,0,0,0
		  						,0,b,0,0
	  							,0,0,c,0
  								,0,0,0,1);
	gl.refplane.mesh.matrixAutoUpdate = false;

		mesh.matrix.set(1-2*a*a,-2*a*b,-2*a*c,0,
					-2*a*b,1-2*b*b,-2*b*c,0,
					-2*a*c,-2*b*c,1-2*c*c,0,
					0,0,0,1);
		mesh.matrixAutoUpdate = false;


                var elem=$("#reflect-matrix");
                mm      = mesh.matrix.elements.map(function(x){return x});

                katex.render(" Theta : "+ theta +" ",elem.get(0));
        }
}
