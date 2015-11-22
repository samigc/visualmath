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
			gl.camera.position.x = -1;
			gl.camera.position.y = -1;
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

			gl.refplane= {};
			gl.refplane.geom = new THREE.PlaneGeometry(30,30,20,20);
			gl.refplane.material = new THREE.MeshLambertMaterial({color: 0x00ff00, transparent: true, opacity: 0.5});
			gl.refplane.material.side = THREE.DoubleSide;
			gl.refplane.mesh = new THREE.Mesh(gl.refplane.geom,gl.refplane.material);

			gl.scene.add(gl.refplane.mesh);

			gl.planevec = new VM.Vector(VM.V3(5,5,5));
			//gl.planevec.visible = false;
			gl.scene.add(gl.planevec);
		}


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
		gl.vars={a:1,b:1,c:1};
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



		gl.vars.a += gl.rotvec.x;
		gl.vars.b += gl.rotvec.y;
		gl.vars.c += gl.rotvec.z;


		if(gl.vars.a > 4){gl.vars.a = 4}
		if(gl.vars.b > 4){gl.vars.b = 4}
		if(gl.vars.c > 4){gl.vars.c = 4}

		if(gl.vars.a < -4){gl.vars.a = -4}
		if(gl.vars.b < -4){gl.vars.b = -4}
		if(gl.vars.c < -4){gl.vars.c = -4}

		var a = (gl.vars.a);
		var b = (gl.vars.b);
		var c = (gl.vars.c);

		var norm = VM.V3(a,b,c);
		norm.normalize();
		a = norm.x;
		b = norm.y;
		c = norm.z;

		if(gl.zlock){
			gl.camera.position.set(a,b,c);
			gl.camera.position.multiplyScalar(3);
			gl.camera.lookAt(VM.V3());
		}


		gl.cube.cube.matrixAutoUpdate = false;
		ref = new THREE.Matrix4();
		ref.makeRotationAxis(norm,2 * Math.PI*Math.sin(step));
		gl.cube.cube.matrix.copy(ref);
		gl.planevec.UpdateTarget(VM.V3(a,b,c));
		gl.refplane.mesh.matrix .copy(gl.planevec.cone.matrixWorld);


		var rotmatx = new THREE.Matrix4();
		var centmatx = new THREE.Matrix4();
		centmatx.set(0,0,0,-a,
			0,0,0,-b,
			0,0,0,-c,
			0,0,0,0
		);
		rotmatx.makeRotationX(90*Math.PI / 180);
		gl.refplane.mesh.matrix.multiply(rotmatx);
		gl.refplane.mesh.matrixAutoUpdate = false;
		vadd(gl.refplane.mesh.matrix.elements, centmatx.elements);

		var elem=$("#reflect-matrix");
		katex.render(" a : "+ VM.Round(a) +" "+" b : "+ VM.Round(b) +" "+" c : "+ VM.Round(c) +" ",elem.get(0));

		var elem1=$("#reflect-matrix2");
		katex.render("\\begin{pmatrix}"+
		VM.Round(a) +"^2 (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))+Cos("+
		VM.Round(2 * Math.PI*Math.sin(step))+") & "+ VM.Round(a) +" "+ VM.Round(b) +" (1-Cos("+
		VM.Round(2 * Math.PI*Math.sin(step))+"))-"+ VM.Round(c) +" Sin("+
		VM.Round(2 * Math.PI*Math.sin(step))+") & "+ VM.Round(a) +" "+ VM.Round(c) +" (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))-"+
		VM.Round(b) +" Sin("+VM.Round(2 * Math.PI*Math.sin(step))+") \\\\"+
		VM.Round(a) +" "+ VM.Round(b) +" (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))-"+ VM.Round(c) +" Sin("+
		VM.Round(2 * Math.PI*Math.sin(step))+") & "+
		VM.Round(a) +"^2 (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))+ Cos("+VM.Round(2 * Math.PI*Math.sin(step))+")	& "+ VM.Round(b) +" "+
		VM.Round(c) +" (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))-"+ VM.Round(a) +" Sin("+VM.Round(2 * Math.PI*Math.sin(step))+") \\\\"+
		VM.Round(a) +" "+ VM.Round(c) +" (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))-"+ VM.Round(b) +" Sin("+
		VM.Round(2 * Math.PI*Math.sin(step))+") & "+ VM.Round(b) +" "+ VM.Round(c) +" (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))-"+
		VM.Round(a) +" Sin("+VM.Round(2 * Math.PI*Math.sin(step))+") & "+
		VM.Round(a) +"^2 (1-Cos("+VM.Round(2 * Math.PI*Math.sin(step))+"))+Cos("+VM.Round(2 * Math.PI*Math.sin(step))+") \\end{pmatrix}",elem1.get(0));

	}
}

function vadd(v1 , v2){
	for (var i = 0; i < v1.length; i++) {
		v1[i] = v2[i] + v1[i];
	}
}
