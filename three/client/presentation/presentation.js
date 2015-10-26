Template.presentation.rendered = function(){
	Reveal.initialize();
	console.log("Initializn revel");
}

function CreatePresentation(){
	if(!VM.Storage.presentation){
		console.log("New presentation");
		VM.Storage.presentation = {};
	}
	else {
		location.reload();
	}
}


Template.presentationmetrica.rendered = function(){
	console.log("Metrica was rendered.");
	//CreatePresentation(); //Carefull
	var gl;
	// Step for animation
	var step = 0;
	//Resize event listener
	window.addEventListener( 'resize', drawWindow, false );
	console.log(VM.Storage);
	//Storage space Initialization
	if(VM.Storage.presentation.metrica){
		//Recover from detached context
		console.log("Recovering from lost context")
		gl = VM.Storage.presentation.metrica;
	}
	else {
		//Initialize all inside the storage
		console.log("Starting metrica")
		VM.Storage.presentation.metrica = {}
		gl = VM.Storage.presentation.metrica;
	}

	//init(gl);
	//animate();


	function drawWindow(){
		if(gl.renderer){
			gl.container = $("#canvasholder");
			gl.WIDTH = gl.container.width() + 400;
			gl.HEIGHT = gl.container.height() +400;
			gl.ASPECT = gl.WIDTH / gl.HEIGHT;
			gl.camera.aspect = gl.ASPECT;
			gl.camera.updateProjectionMatrix();
			gl.renderer.setSize( gl.WIDTH, gl.HEIGHT );
			gl.renderer.render(gl.scene,gl.camera);
			console.log(gl);

			var container = $('.subtxt');
			container.hide();
			container.css("text-shadow","-3px 0 20px #33bb88, 0 3px 20px  #33bb88, 3px 0 20px  #33bb88, 0 -3px 20px  #33bb88");
			container.show();
		}
	}

	Reveal.addEventListener( 'metrica', function( event ) {
		// event.previousSlide, event.currentSlide, event.indexh, event.indexv
		console.log("Metrica is initialized here cast ?")
		drawWindow();
	} );
}

//Three background for the initial presentation

Template.introbackground.rendered = function(){
	// Reference to storage space
	console.log("Got to first slide template");
	CreatePresentation();
	var gl;
	// Step for animation
	var step = 0;
	//Resize event listener
	window.addEventListener( 'resize', drawWindow, false );
	console.log(VM.Storage);
	//Storage space Initialization
	if(VM.Storage.presentation.introbackground){
		//Recover from detached context
		console.log("Recovering from lost context")
		gl = VM.Storage.presentation.introbackground;
	}
	else {
		//Initialize all inside the storage
		console.log("Starting first example")
		VM.Storage.presentation.introbackground = {}
		gl = VM.Storage.presentation.introbackground;
	}

	init(gl);
	animate();


	function drawWindow(){
		if(gl.renderer){
			gl.container = $("#introbackground");
			gl.WIDTH = gl.container.width() + 400;
			gl.HEIGHT = gl.container.height() +400;
			gl.ASPECT = gl.WIDTH / gl.HEIGHT;
			gl.camera.aspect = gl.ASPECT;
			gl.camera.updateProjectionMatrix();
			gl.renderer.setSize( gl.WIDTH, gl.HEIGHT );
			gl.renderer.render(gl.scene,gl.camera);
			console.log(gl);

			var container = $('.subtxt');
			container.hide();
			container.css("text-shadow","-3px 0 20px #33bb88, 0 3px 20px  #33bb88, 3px 0 20px  #33bb88, 0 -3px 20px  #33bb88");
			container.show();
		}
	}

	Reveal.addEventListener( 'introbackground', function( event ) {
		// event.previousSlide, event.currentSlide, event.indexh, event.indexv
		console.log("Showuld i init here cast ?")
		drawWindow();
		var container = $('.subtxt');
		container.hide();
		container.css("text-shadow","-3px 0 20px #33bb88, 0 3px 20px  #33bb88, 3px 0 20px  #33bb88, 0 -3px 20px  #33bb88");
		container.show();
	} );




	// Initialization
	function init(gl){

		gl.container = $('#introbackground');

		gl.WIDTH =  gl.container.width() - 10;
		gl.HEIGHT =  gl.container.height() - 10;
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

			//Camera initial position
			gl.camera.position.x = 0;
			gl.camera.position.y = 1;
			gl.camera.position.z = 20;

			gl.scene.add(gl.camera);

			//Make the grid
			gl.grid = new Array(2);
			gl.grid[0] = new THREE.GridHelper( 50, 5 );
			gl.grid[1] = new THREE.GridHelper( 50, 5 );
			gl.scene.add( gl.grid[0] );
			gl.scene.add( gl.grid[1] );
			gl.grid[0].rotation.x = Math.PI/2;
			gl.grid[0].setColors(0x113333,0x88aaaa);
			gl.grid[1].setColors(0x113333,0x88aaaa);

			// Make the ticks
			//Define the tick positions


			gl.ticksBig = [-20,-10,0,10,20];
			gl.ticksSmall = [-15,-5,5,15];

			gl.tickgeoms = new Array(4);

			gl.tickgeoms[0] = new VM.Axis(gl.ticksBig,{textSize : 0.8 , textColor : 0x229966 , lineColor : 0x119944});
			gl.tickgeoms[1] = new VM.Axis(gl.ticksSmall,{textSize : 0.6, textColor : 0x229966, lineColor : 0x119944});
			gl.tickgeoms[2] = new VM.Axis(gl.ticksBig,{textSize : 0.8, textColor : 0x229966, lineColor : 0x119944});
			gl.tickgeoms[3] = new VM.Axis(gl.ticksBig,{textSize : 0.8, textColor : 0x229966, lineColor : 0x119944});
			gl.tickgeoms[3].rotation.z = Math.PI/2
			gl.tickgeoms[2].rotation.y=Math.PI/2

			gl.scene.add(gl.tickgeoms[0]).add(gl.tickgeoms[1]).add(gl.tickgeoms[2]).add(gl.tickgeoms[3]);

			gl.vects = new Array(4);
			gl.vectpos = new Array(4)
			for (var i = 0; i < gl.vects.length; i++) {
				gl.vectpos[i] = new THREE.Vector3(i*5+3,i*4+4,i*3+5);
				gl.vects[i] = new VM.Vector(gl.vectpos[i])
				gl.scene.add(gl.vects[i])
			}

		}

		//There seems to be no problem with appending the canvas again since the object reference is the same.
		gl.container.append(gl.renderer.domElement);
		drawWindow();
		render(gl);
	}

	// Animation

	function animate(){
		step+=0.005;
		faraway  = (Math.sin(step)*30);
		faraway2  = (Math.cos(step)*30);
		requestAnimationFrame(animate);
		newpos = Math.sin(step + Math.PI);
		//console.log(newpos)
		gl.camera.position.x = newpos*20;
		newpos = Math.cos(step);
		gl.camera.position.z = newpos*20 ;
		gl.camera.position.y = Math.cos(step + Math.PI/3) * faraway;
		gl.camera.lookAt(gl.scene.position);

		//Animat the vectors
		for (var i = 0; i < gl.vects.length; i++) {
			//x =
			var newDir = new THREE.Vector3( this.x, this.y, this.z);
			gl.vectpos[i].x += Math.sin(step + i) * 5;
			gl.vectpos[i].z += Math.cos(step + i) * 5;
			gl.vectpos[i].y += Math.tan(step + i) * 5;
			gl.vects[i].UpdateTarget(gl.vectpos[i]);
		}
		render(gl);
	}

	function render(gl){
		//console.log(renderer);
		gl.renderer.render(gl.scene,gl.camera);
		if(gl.tickgeoms){
			for (var i = 0; i < gl.tickgeoms.length; i++) {
				if(gl.tickgeoms[i]){
					gl.tickgeoms[i].lookAt(gl.camera)
				};
			}}
		}


	}
