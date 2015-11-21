Template.mattrat.rendered = function(){
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
			gl.camera = new THREE.PerspectiveCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
			//gl.camera = new THREE.OrthographicCamera(-10 * gl.ASPECT ,10 * gl.ASPECT,10,-10,gl.NEAR,gl.FAR);
			gl.scene = new THREE.Scene();
			gl.grid = new THREE.GridHelper(1,.1);
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
			gl.camera.position.x = 0;
			gl.camera.position.y = 0;
			gl.camera.position.z = 3;
			gl.camera.lookAt(gl.scene.position);

			ticks = [-1,-.8,-.6,-.4,-.2,.2,.4,.6,.8,1.0];
			gl.axes = new Array(2);
			gl.axes[0] = new VM.Axis(ticks,{textSize:0.04});
			gl.axes[1] = new VM.Axis(ticks,{textSize:0.04});
			gl.axes[1].rotation.z = Math.PI/2;
			var txt = gl.axes[0].ticktexts;
			for (var i = 0; i < txt.length; i++) {
				txt[i].position.z += 0.05;
			}
			txt = gl.axes[1].ticktexts;
			for (var i = 0; i < txt.length; i++) {
				txt[i].position.z -= 0.05;
			}
			gl.scene.add(gl.axes[0]);
			gl.scene.add(gl.axes[1]);
			/*
			gl.cube = {};
			cb = gl.cube;
			cb.cube = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), new THREE.MeshNormalMaterial({transparent:true,opacity:0.5}));
			gl.scene.add( cb.cube );
			*/

			gl.knot = {};k= gl.knot;
			k.geometry = new THREE.TorusKnotGeometry( 0.3, 0.05, 100, 16 );
			k.material = new THREE.MeshNormalMaterial( { transparent: true, opacity : 0.7 } );
			k.mesh = new THREE.Mesh( k.geometry, k.material );
			gl.scene.add( k.mesh );

			var light = new THREE.AmbientLight( 0xffffff );
			light.position.set( 20, 10, 50 );
			gl.scene.add( light );

		}

		//Render the scene in the current Page
		gl.container = $('#top');
		//There seems to be no problem with appending the canvas again since the object reference is the same.
		gl.container.append(gl.renderer.domElement);
		drawWindow();
		gl.vars={x:0,y:0,z:0};
	}

	function renderView(){
		step +=0.01;
		requestAnimationFrame(renderView);
		gl.axes[0].lookAt(gl.camera);
		gl.axes[1].lookAt(gl.camera);

		gl.renderer.render(gl.scene,gl.camera);
		gl.controls.update();

		gl.rotvec = VM.V3();
		gl.rotvec = VM.keyControls(gl.rotvec,0.03);

		gl.vars.x += gl.rotvec.x;
		gl.vars.y += gl.rotvec.y;
		gl.vars.z += gl.rotvec.z;

		var x = (gl.vars.x);
		var y = (gl.vars.y);
		var z = (gl.vars.z);


		gl.knot.mesh.matrixAutoUpdate = false;
		ref = new THREE.Matrix4();
		ref.set(1,0,0,x,
			0,1,0,y,
			0,0,1,z,
			0,0,0,1);
		gl.knot.mesh.matrix.copy(ref);


		var elem=$("#translate-matrix");

		katex.render("( x : "+ x +",  y : "+ y +" , z :  "+z+")",elem.get(0));
	}
}

function vadd(v1 , v2){
	for (var i = 0; i < v1.length; i++) {
		v1[i] = v2[i] + v1[i];
	}
}
