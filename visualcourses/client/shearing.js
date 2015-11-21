Template.matshet.rendered = function(){
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

			gl.cube = {};
			cb = gl.cube;
			cb.cube = new THREE.Mesh(new THREE.CubeGeometry(.5, .5, .5), new THREE.MeshNormalMaterial({transparent:true,opacity:0.5}));
			gl.scene.add( cb.cube );

			var light = new THREE.AmbientLight( 0xffffff );
			light.position.set( 20, 10, 50 );
			gl.scene.add( light );

		}

		gl.shear = "x";
		$('a#x-b').toggleClass("selec");

		$('a#x-b').click(function(){
			$(".selec").toggleClass("selec");
			gl.shear = "x";
			$(this).toggleClass("selec");
		});
		$('a#y-b').click(function(){
			$(".selec").toggleClass("selec");
			gl.shear = "y";
			$(this).toggleClass("selec");
		});
		$('a#z-b').click(function(){
			$(".selec").toggleClass("selec");
			gl.shear = "z";
			$(this).toggleClass("selec");
		});
		$('a#z-reset').click(function(){
			gl.vars={s:0,t:0};
			gl.camera.position.x = 0;
			gl.camera.position.y = 0;
			gl.camera.position.z = 3;
			gl.camera.lookAt(gl.scene.position);
			//gl.camera.rotation.copy(VM.V3());
		});
		//Render the scene in the current Page
		gl.container = $('#top');
		//There seems to be no problem with appending the canvas again since the object reference is the same.
		gl.container.append(gl.renderer.domElement);
		drawWindow();
		gl.vars={s:0,t:0};
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

		gl.vars.s += gl.rotvec.x;
		gl.vars.t += gl.rotvec.y;

		var s = (gl.vars.s);
		var t = (gl.vars.t);


		gl.cube.cube.matrixAutoUpdate = false;
		ref = new THREE.Matrix4();
		if(gl.shear == "x"){
		ref.set(1,0,0,0,
			0,1,0,0,
			s,t,1,0,
			0,0,0,1);
		}
		if(gl.shear == "y"){
		ref.set(1,0,0,0,
			s,1,t,0,
			0,0,1,0,
			0,0,0,1);
		}
		if(gl.shear == "z"){
		ref.set(1,s,t,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1);
		}
		gl.cube.cube.matrix.copy(ref);


		var elem=$("#shear-matrix");

		katex.render("( s : "+ s +",  t : "+ t +" )",elem.get(0));
	}
}

function vadd(v1 , v2){
	for (var i = 0; i < v1.length; i++) {
		v1[i] = v2[i] + v1[i];
	}
}
