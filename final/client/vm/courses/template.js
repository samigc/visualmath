/*
Template.vmlinearity.rendered = function(){
	container = document.getElementById('vmcontainer');
	console.log(container);
	THREE.new("three",container);
	three.Size.set({
		height: $(window).height()
	});

	el = $(three.renderer.domElement);
	el.css("top","0");
	el.css("position","fixed");
	el.css("z-index","-1");
	el.css("opacity","0.8");

	uivisible = true;


	//Get scrolling
	$(window).bind('keypress', function(e) {
		var code = e.keyCode || e.which;
		//Z
		if(code == 122){
			toggleUI();
		}
	});

	three.sc1 = new THREE.Object3D();
	three.sc2 = new THREE.Object3D();

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//// Scene 1 , Insert objects inside three.sc1
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	var geometry = new THREE.BoxGeometry( .1, .1, .1 );
	var material = new THREE.MeshBasicMaterial( {color: 0xff0ff0} );
	var cube = new THREE.Mesh( geometry, material );
	three.sc1.add(cube);

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//**************************************************************
	///*************************************************************

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//// Scene 2 , Insert objects inside three.sc1
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	var geometry = new THREE.BoxGeometry( .1, .1, .1 );
	var material = new THREE.MeshBasicMaterial({color: 0x0ff0ff});
	var cube = new THREE.Mesh( geometry, material );
	three.sc2.add(cube);

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//**************************************************************
	///*************************************************************


	function f0(){
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//// Animation loop, Event null
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	var t = three.Time.now;
  	three.camera.position.set(Math.cos(t), .5, Math.sin(t));
  	three.camera.lookAt(new THREE.Vector3());
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//**************************************************************
	///*************************************************************
	}
	function f1(){
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//// Animation loop, Event 1
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	var t = three.Time.now;
  	three.camera.position.set(Math.cos(t), .5, Math.sin(t));
  	three.camera.lookAt(new THREE.Vector3());
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//**************************************************************
	///*************************************************************
	}

	function f2(){
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//// Animation loop, Event 2
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	var t = three.Time.now;
  	three.camera.position.set(Math.cos(t), .5, Math.sin(t));
  	three.camera.lookAt(new THREE.Vector3());
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//**************************************************************
	///*************************************************************
	}

	var visible = false;
	three.sc1.traverse(function(child){
		child.visible = visible;
	});
	three.sc2.traverse(function(child){
		child.visible = visible;
	});

	three.scene.add(three.sc1);
	three.scene.add(three.sc2);


	three.on('update', function () {

		// Trigger controls for two triggers , Use the functions f0 f1 and f2 to set the trigger scene behavior
		tp = $(window).scrollTop()
		t1 = $("#trig1").offset().top;
		t2 = $("#trig2").offset().top;
		wh = $(window).height();

		if((t2) < tp + (wh)){
			trig2();
		}
		else {if(t1 < tp + (wh/2)){
			console.log("tri2");
			trig1();
		}else{
			trig0();
		}
	}

		var t = three.Time.now;

		//// Three camera control is inside every f'()
	});

	trig0 = function(){
		if(three.sc1.visible){
			var visible = false;
			message("Animaciones desactivadas.",3000,100);
			three.sc1.traverse(function(child){
				child.visible = visible;
				//console.log("tvs");
			});
		}else if(three.sc2.visible){
			var visible = false;
			message("Animaciones desactivadas.",3000,100);
			three.sc2.traverse(function(child){
				child.visible = visible;
				//console.log("tvs");
			});
		}else{}
		f0();
	}

	trig1 = function(){
		if(!three.sc1.visible){
		message("Animacion 1 Activada, Presione Z para ocultar el texto.",3000,100);
		var visible = true;
		three.sc1.traverse(function(child){
			child.visible = visible;
		});
		visible = false;
		three.sc2.traverse(function(child){
			child.visible = visible;
		});}
		f1();
	}
	trig2 = function(){
		if(!three.sc2.visible){
		message("Animacion 2 Activada, Presione Z para ocultar el texto.",3000,100);
		var visible = true;
		three.sc2.traverse(function(child){
			child.visible = visible;
		});
		visible = false;
		three.sc1.traverse(function(child){
			child.visible = visible;
		});
	}
	f2();
	}

	function message(msg,t1,t2){
		if($("#messagepad").length == 0){
		$("<div class=\"ui positive message\" id=\"messagepad\"> "+
		"<i class=\"close icon\"></i><div class=\"header\">"+
		msg +"</div></div>").appendTo("body");
		$("#messagepad").css("position","fixed");
		$("#messagepad").css("top","0px");
		$("#messagepad").css("right","0px");
		$("#messagepad").css("width","300px");

		window.setTimeout(function(){
			 $("#messagepad").animate({opacity:0 , top : $(window).height()/2},t2);
		}, t1);
		window.setTimeout(function(){
			 $("#messagepad").remove();
		}, t1+t2);
		}
		else {
			//$("#messagepad").remove();
		}
	}

	function toggleUI(){
		uivisible = (!uivisible);
		if(uivisible){
			$("#explanation").css("z-index","9");
			$("#explanation").animate({"opacity":"1"},500);
			el.animate({"opacity":"0.8"},500);
			el.css("z-index","-9");
			message("Presione Z para volver al modo 3D.",3000,1000);
		}
		else{
			$("#explanation").css("z-index","-20");
			$("#explanation").animate({"opacity":"0"},500);
			el.animate({"opacity":"1"},500);
			el.css("z-index","9");
			message("Texto Ocultado , Presione Z para restaurar.",3000,1000);
		}
	}

}


*/
