Template.slides.rendered = function(){
	Reveal.initialize();

	function CreatePresentation(){
		if(!VM.Storage.presentation){
			console.log("New presentation");
			VM.Storage.presentation = {};
			VM.Storage.presentation.renderer =  new THREE.WebGLRenderer({alpha : true, antialias : true});
		}
		else {
			location.reload();
			;
		}
	}

	CreatePresentation();
}

Template.distance.rendered = function(){
Reveal.addEventListener('distance', function(event){


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


        if(VM.Storage.distance){
                //Recover from detached context
                console.log("Recovering from lost context")
		VM.Storage.distance = {}
                gl = VM.Storage.distance;
                init(gl);
        }
        else {
                //Initialize all inside the storage
                console.log("Starting first example")
		VM.Storage.distance = {}
                gl =VM.Storage.distance;
                init(gl);

        }

        function init(gl){

                //Redraw camera calculating variables
		gl.WIDTH =  960;
		gl.HEIGHT =  700;
		gl.ASPECT = gl.WIDTH / gl.HEIGHT;
		gl.VIEW_ANGLE = 45
		gl.NEAR = 0.1;
		gl.stepp = 0;
		gl.FAR = 10000;
                //Check if renderer exists to not to re-initi the scene and just redraw it.
                if(!gl.renderer) {
                        //Initialize the Scene
                        console.log("Initializing the scene for the first time");
                        gl.renderer =VM.Storage.presentation.renderer;
                        gl.camera = new THREE.PerspectiveCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
                        gl.scene = new THREE.Scene();
                        gl.grid = new THREE.GridHelper(20,2);
                        gl.grid.rotation.x = Math.PI/2;
                        gl.grid.setColors("#334488","#88ccff");
                        gl.scene.add(gl.camera);
                        gl.scene.add(gl.grid);
//controls
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
                        gl.camera.position.z = 35;
                        gl.camera.lookAt(gl.scene.position);
                        ticks = [-10,-8,-6,-4,-2,2,4,6,8,10];
                        gl.axes = new Array(2);
                        gl.axes[0] = new VM.Axis(ticks,{textSize:0.4});
                        gl.scene.add(gl.axes[0]);
                        gl.axes[1] = new VM.Axis(ticks,{textSize:0.4});
                        gl.axes[1].rotation.z = Math.PI/2;

                        gl.scene.add(gl.axes[1]);


                        //Now vectors !!
		var vinit={x: 4, y:6, z: 0};
		var  v_xf={x:4, y:0, z:0};
		var v_yf={x: 0, y:6, z: 0};
		gl.v_x= new VM.Vector(VM.V3(4,6));
		gl.v_y= new VM.Vector(VM.V3(4,6));
		gl.v_y2=new VM.Vector(VM.V3(4,6));
		gl.scene.add(gl.v_x).add(gl.v_y2).add(gl.v_y);

		var proyx= new TWEEN.Tween(vinit)
		.to(v_xf, 2000 ).onUpdate(function () {
			gl.v_x.UpdateTarget(VM.V3(this.x, this.y, this.z))
		})
		.start();

		var proyy= new TWEEN.Tween(vinit)
		.to(v_yf, 2000 )
		.onUpdate(function () {
			gl.v_y.UpdateTarget(VM.V3(this.x, this.y, this.z))})
		.start();

		gl.v_x.activateTag("Vx",{id: "vecx", jQueryContainer : gl.cointainer });
		gl.v_y.activateTag("Vy",{id: "vecy", jQueryContainer : gl.cointainer });
		gl.v_y2.activateTag("V",{id: "vec", jQueryContainer : gl.cointainer });
                }

                //Render the scene in the current Page
                gl.container = $('#distance');
        	//There seems to be no problem with appending the canvas again since the object reference is the same.
                gl.container.append(gl.renderer.domElement);
                drawWindow();
		renderView();
        }

        function renderView(){
                step +=0.01;
		gl.controls.update();
                requestAnimationFrame(renderView);

		TWEEN.update();

		gl.axes[0].lookAt(gl.camera);
                gl.axes[1].lookAt(gl.camera);
                gl.renderer.render(gl.scene,gl.camera);

		var positionx = THREEx.ObjCoord.cssPosition(gl.axes[0].ticktexts[9] , gl.camera , gl.renderer);
		$("#axisx").css('left',(positionx.x-$("#axisx").width() /2)+40+'px');
		$("#axisx").css('top',(positionx.y-$("#axisx").height() /2)+'px');

		var positiony = THREEx.ObjCoord.cssPosition(gl.axes[1].ticktexts[9] , gl.camera , gl.renderer);
		$("#axisy").css('left',(positiony.x-$("#axisy").width() /2)+'px');
		$("#axisy").css('top',(positiony.y-$("#axisy").height() /2)+'px');

		gl.v_x.updateTag(gl.camera,gl.renderer);
		gl.v_y.updateTag(gl.camera,gl.renderer);
		gl.v_y2.updateTag(gl.camera,gl.renderer);
	}
})

}


Template.metrics.rendered= function(){
	Reveal.addEventListener('metrics', function (event) {
		var gl={};

		if (VM.Storage.presentation.distance) {
			delete VM.Storage.presentation.distance;
			init();

		}
		else {
			init()
		}

		function init(){
			VM.Storage.presentation.distance={}
			gl=VM.Storage.presentation.distance;

			gl.container = $('#metrics');

			gl.WIDTH =  960;
			gl.HEIGHT =  700;
			gl.ASPECT = gl.WIDTH / gl.HEIGHT;
			gl.VIEW_ANGLE = 45
			gl.NEAR = 0.1;
			gl.FAR = 10000;

			//gl.renderer = new THREE.WebGLRenderer({alpha : true, antialias : true});
			gl.renderer = VM.Storage.presentation.renderer;
			gl.camera = new THREE.PerspectiveCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
			gl.scene = new THREE.Scene();

			//Camera initial position
			gl.camera.position.x = 8;
			gl.camera.position.y = 8;
			gl.camera.position.z = 12;

			gl.scene.add(gl.camera);

			gl.container.append(gl.renderer.domElement);

			gl.grid = new THREE.GridHelper(20,2);
			gl.grid.rotation.x = Math.PI/2;
			gl.grid.setColors("#334488","#88ccff");
			gl.scene.add(gl.camera);
			gl.scene.add(gl.grid);
			//controls
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
			gl.camera.lookAt(gl.scene.position);
			ticks = [-10,-8,-6,-4,-2,2,4,6,8,10];
			gl.axes = new Array(2);
			gl.axes[0] = new VM.Axis(ticks,{textSize:0.4});
			gl.scene.add(gl.axes[0]);
			gl.axes[1] = new VM.Axis(ticks,{textSize:0.4});
			gl.axes[1].rotation.z = Math.PI/2;

			gl.scene.add(gl.axes[1]);


			//Now vectors !!
			var vinit={x: 4, y:6, z: 0};
			var  v_xf={x:4, y:0, z:0};
			var v_yf={x: 0, y:6, z: 0};
			var v_x= new VM.Vector(VM.V3(4,6));
			var v_y= new VM.Vector(VM.V3(4,6));
			var v_y2=new VM.Vector(VM.V3(4,6));
			gl.scene.add(v_x).add(v_y2).add(v_y);

			var proyx= new TWEEN.Tween(vinit)
			.to(v_xf, 2000 ).onUpdate(function () {
				v_x.UpdateTarget(VM.V3(this.x, this.y, this.z))
			})

			.start();

			var proyy= new TWEEN.Tween(vinit)
			.to(v_yf, 2000 )
			.onUpdate(function () {
				v_y.UpdateTarget(VM.V3(this.x, this.y, this.z))
			})
			.easing(TWEEN.Easing.Bounce.Out)
			.start();

			var proyy2= new TWEEN.Tween( v_yf )
			.to({ x: 4, y:0 });


			gl.renderer.setSize( gl.WIDTH, gl.HEIGHT );
			console.log(gl);
			console.log(gl.camera.position);
			gl.renderer.render(gl.scene,gl.camera);

			renderView();
		}

		var step=0;

		function renderView(){
			step +=0.01;
			gl.controls.update();
			requestAnimationFrame(renderView);

			TWEEN.update();

			gl.axes[0].lookAt(gl.camera);
			gl.axes[1].lookAt(gl.camera);
			gl.renderer.render(gl.scene,gl.camera);

			var positionx = THREEx.ObjCoord.cssPosition(gl.axes[0].ticktexts[9] , gl.camera , gl.renderer);
			$("#axisx").css('left',(positionx.x-$("#axisx").width() /2)+20+'px');
			$("#axisx").css('top',(positionx.y-$("#axisx").height() /2)+5+'px');

			var positiony = THREEx.ObjCoord.cssPosition(gl.axes[1].ticktexts[9] , gl.camera , gl.renderer);
			$("#axisy").css('left',(positiony.x-$("#axisy").width() /2)+'px');
			$("#axisy").css('top',(positiony.y-$("#axisy").height() /2)-10+'px');
		}
	})

}



Template.linearity.rendered= function(){
	Reveal.addEventListener('linearity', function (event) {
		console.log("esta funcionando")
		var gl={};

		//If exists the presentation the check wether is the same or not
		//If it does not exists or is not the same, then delete and create a new one.


		if (VM.Storage.presentation.linearity) {
			delete VM.Storage.presentation.linearity;
			init();
		}
		else {
			init();
		}

		function init(){
			VM.Storage.presentation.linearity={}
			gl=VM.Storage.presentation.linearity;

			gl.container = $('#linearity');

			gl.WIDTH =  960;
			gl.HEIGHT =  700;
			gl.ASPECT = gl.WIDTH / gl.HEIGHT;
			gl.VIEW_ANGLE = 45
			gl.NEAR = 0.1;
			gl.stepp = 0;
			gl.FAR = 10000;

			//gl.renderer = new THREE.WebGLRenderer({alpha : true, antialias : true});
			gl.renderer = VM.Storage.presentation.renderer;
			gl.camera = new THREE.PerspectiveCamera(gl.VIEW_ANGLE,gl.ASPECT,gl.NEAR,gl.FAR);
			gl.scene = new THREE.Scene();

			//Camera initial position
			gl.camera.position.x = 8;
			gl.camera.position.y = 8;
			gl.camera.position.z = 12;

			gl.scene.add(gl.camera);

			gl.container.append(gl.renderer.domElement);

			gl.grid = new THREE.GridHelper(20,2);
			gl.grid.rotation.x = Math.PI/2;
			gl.grid.setColors("#334488","#88ccff");
			gl.scene.add(gl.camera);
			gl.scene.add(gl.grid);
			//controls
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
			gl.camera.lookAt(gl.scene.position);
			ticks = [-10,-8,-6,-4,-2,2,4,6,8,10];
			gl.axes = new Array(2);
			gl.axes[0] = new VM.Axis(ticks,{textSize:0.4});
			gl.scene.add(gl.axes[0]);
			gl.axes[1] = new VM.Axis(ticks,{textSize:0.4});
			gl.axes[1].rotation.z = Math.PI/2;

			gl.scene.add(gl.axes[1]);


			//Now vectores.
			gl.vs = new Array(4);
			for (var i = 0; i < gl.vs.length; i++) {
				gl.vs[i] = {};
			}

			//Initial vectors drawn.
			for (var i = 0; i < gl.vs.length; i++) {
				gl.vs[i].vector = new VM.Vector(VM.V3(6,8,3));
				gl.scene.add(gl.vs[i].vector);

			}

			//Now tween.
			gl.y = 0;
			gl.tween = new TWEEN.Tween({x: 6 , y: 8, z: 3})
			.to({x:0,y:0,z:0},5000)
			.onUpdate(function(){
				//x
				gl.vs[1].vector.UpdateTarget(VM.V3(6,this.y,this.z));
				//y
				gl.vs[2].vector.UpdateTarget(VM.V3(this.x,8,this.z));
				//z
				gl.vs[3].vector.UpdateTarget(VM.V3(this.x,this.y,3));
			})
			.delay(i * 1000)
			.easing(TWEEN.Easing.Bounce.Out)
			.start();

			gl.vs[1].vector.activateTag("x",{id:"vecx",jQueryContainer : gl.container})
			gl.vs[2].vector.activateTag("y",{id:"vecy",jQueryContainer : gl.container});
			gl.vs[3].vector.activateTag("z",{id:"vecz",jQueryContainer : gl.container});

			gl.vt = new Array(3);

			/*
			gl.y = 0;
			for (var i = 0; i < gl.vs.length; i++) {
				gl.vs[i].tween = new TWEEN.Tween(gl.vs[i].vinit)
				.to(gl.vs[i].finish,5000)
				.onUpdate(function(){
					//console.log(gl)
					//console.log(gl.vs);
					//console.log(gl.y);
					//console.log(gl.vs[gl.y])
					gl.y=gl.y+1;

					if(gl.y == gl.vs.length){gl.y = 0}
					//gl.y = Math.ceil(gl.y);
					console.log(gl.y);
					console.log(gl.vs)
					newvec = new VM.V3(this.x,this.y,this.z);
					console.log(newvec);
					gl.vs[gl.y].vector.UpdateTarget(VM.V3(this.x,this.y,this.z));
				})
				.delay(i * 1000)
				.easing(TWEEN.Easing.Bounce.Out)
				.start();
				console.log(i);
			}
			*/

			//Now vectors !!


			elem = $('#katexfield');
			elem.css({"font-size" : "50px"})

			katex.render("(\\sum { x_i }^{2})^\\frac {1}{2}",elem.get(0) )

			var textween = new TWEEN.Tween({opacity : 0, left : 0 , top : 0})
			.to({opacity : 1 , left : 300 , top : 300}, 2000)
			.onUpdate(function(){
				elem.css({opacity : this.opacity}).css({left:this.left,top:this.top})
			})
			.delay(1000)
			.start()

			var textween2 = new TWEEN.Tween({opacity : 1 , ftsize : 50 , left : 300})
			.to({opacity : 0 , ftsize : 30 , left : 800})
			.onUpdate(function(){
				elem.css(this);
			})
			.delay(6000)
			.start()

			//Vector tags

			//Try to animate a grid in the position of x drawing the cube.

			var geometry = new THREE.BoxGeometry( 6, 8,3 );
			var material = new THREE.MeshNormalMaterial( {color: 0x00ff00, transparent : true, opacity : 0.4} );
			gl.cube = new THREE.Mesh( geometry, material );
			gl.scene.add( gl.cube );
			gl.cube.position.copy(VM.V3(3,4,1.5));

			//proyx.chain(proyy);
			//var proyy2= new TWEEN.Tween( v_yf )
			//.to({ x: 4, y:0 });


			gl.renderer.setSize( gl.WIDTH, gl.HEIGHT );
			gl.renderer.render(gl.scene,gl.camera);
			renderView();


		}

		var step=0;

		function renderView(){
			step +=0.01;
			gl.controls.update();
			requestAnimationFrame(renderView);
			gl.stepp += 0.01;

			TWEEN.update();

			gl.axes[0].lookAt(gl.camera);
			gl.axes[1].lookAt(gl.camera);
			gl.renderer.render(gl.scene,gl.camera);

			var positionx = THREEx.ObjCoord.cssPosition(gl.axes[0].ticktexts[9] , gl.camera , gl.renderer);
			$("#axisx").css('left',(positionx.x-$("#axisx").width() /2)+20+'px');
			$("#axisx").css('top',(positionx.y-$("#axisx").height() /2)+5+'px');

			var positiony = THREEx.ObjCoord.cssPosition(gl.axes[1].ticktexts[9] , gl.camera , gl.renderer);
			$("#axisy").css('left',(positiony.x-$("#axisy").width() /2)+'px');
			$("#axisy").css('top',(positiony.y-$("#axisy").height() /2)-10+'px');

			gl.vs[1].vector.updateTag(gl.camera,gl.renderer);
			gl.vs[2].vector.updateTag(gl.camera,gl.renderer);
			gl.vs[3].vector.updateTag(gl.camera,gl.renderer);

			//For the cube, y scales x and x scales y.
			//Starting position, the dots and arrows of the two arrows.

		}
	})

}
