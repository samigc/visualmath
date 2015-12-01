Template.vmlinearity.rendered = function(){

	// container to select
	// COme back to the beggining
	window.scrollTo(0, 0);
	$('.eqfield').remove();
	container = document.getElementById('vmcontainer');
	THREE.new("three",{element : container, plugins : ['core','controls'], controls : {klass : THREE.TrackballControls}});
	three.Size.set({
		height: $(window).height()
	});

	el = $(three.renderer.domElement);
	el.css("top","0");
	el.css("position","fixed");
	el.css("z-index","-1");
	el.css("opacity","0.2");

	uivisible = true;
	three.raycaster = new THREE.Raycaster();
	three.mouse = new THREE.Vector2();

	//Set mouse events
	$('#vmcontainer').click(
		function(evt){
			var wh = $(window).height();
			var ww = $(window).width();
			three.mouse.y = 1 - 2 *(evt.clientY / wh);
			three.mouse.x = 2 * (evt.clientX / ww) - 1;
			three.raycaster.setFromCamera(three.mouse,three.camera);
			// List to query
			var elems = [three.sc2.innerObjects.vector.geom[0].vectorObject.cone
			, three.sc2.innerObjects.vector.geom[1].vectorObject.cone];


			var material = new THREE.LineBasicMaterial({
				color: 0x0000ff
			});
			var geometry = new THREE.Geometry();
			var intersects = three.raycaster.intersectObjects(elems,true);
			//Initialize colors
			if(intersects.length > 0){
				elems[0].material.color.setHex(0x0099ff);
				elems[1].material.color.setHex(0x0099ff);
			}
			//Select vector and color it red.
			for (var i = 0; i < intersects.length; i++) {
				three.sc2.innerObjects.activevector = intersects[i].object.parent.parent;
				three.sc2.innerObjects["activevector"].vectorObject.cone.material.color.setHex(0xed2233);
			}
		}
	);

	//Get z key
	if (typeof zkey == 'undefined') {
    	// the variable is undefined
    		zkey = true;
		$(window).bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			//Z
			if(code == 122){
				VM.toggleUI();
			}
		});
	}


	three.sc1 = new THREE.Object3D();
	three.sc2 = new THREE.Object3D();

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//// Scene 1 , Insert objects inside three.sc1
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	three.sc1.innerObjects = {};
	var gl = three.sc1.innerObjects;
	gt = gl; // To support tweens;
	gl.scene = three.sc1;

	gl.grid = new THREE.GridHelper(20,2);
	gl.grid.rotation.x = Math.PI/2;
	gl.grid.setColors("#338844","#88ddaa");

	gl.scene.add(gl.grid);

	gl.grid = new THREE.GridHelper(20,2);
	gl.grid.setColors("#338844","#88ddaa");

	gl.scene.add(gl.grid);
	//Controls (?move to VM)
	ticks = [-10,-8,-6,-4,-2,-1,1,2,4,6,8,10];
	gl.axes = new Array(3);
	gl.axes[0] = new VM.Axis(ticks,{textSize:0.15});
	gl.scene.add(gl.axes[0]);
	gl.axes[1] = new VM.Axis(ticks,{textSize:0.15});
	gl.axes[1].rotation.z = Math.PI/2;
	gl.scene.add(gl.axes[1]);
	gl.axes[2] = new VM.Axis(ticks,{textSize:0.15});
	gl.axes[2].rotation.y = Math.PI/2;
	gl.scene.add(gl.axes[2]);

	//Now draw the basis

	gl.base= {v3 : new Array(3), geom : new Array(3)};
	for (var i = 0; i < gl.base.v3.length; i++) {
		gl.base.v3[i]=VM.V3(0,0,0);
		gl.base.v3[i].setComponent(i,1);
	};

	for (var i = 0; i < gl.base.geom.length; i++) {
		var vborn = new VM.V3().copy(gl.base.v3[i]);
		gl.base.geom[i] = new VM.Vector(vborn);
		gl.base.geom[i].setColor(0xff1e33);
		gl.scene.add(gl.base.geom[i]);
	}

	gl.container = $('#vmcontainer');
	gl.base.geom[0].activateTag("\\cdot {\\hat{i}}",{top : 0 , fontSize : 19 , jQueryContainer : gl.container , katex:true , id : "basevx", color: "#ff0033"});
	gl.base.geom[1].activateTag(" \\cdot {\\hat{j}}",{top : 0 , fontSize : 19 , jQueryContainer : gl.container , katex:true , id : "basevy", color: "#ff0033"});
	gl.base.geom[2].activateTag(" \\cdot {\\hat{k}}",{top : 0 ,fontSize : 19 , jQueryContainer : gl.container , katex:true , id : "basevz", color: "#ff0033"});
	$("#basevy").css("position","fixed").addClass("f1 vecUI f1ui").css("opacity",0);
	$("#basevx").css("position","fixed").addClass("f1 vecUI f1ui").css("opacity",0);
	$("#basevz").css("position","fixed").addClass("f1 vecUI f1ui").css("opacity",0);
	//Now draw the vector projections
	gl.vector= {v3 : new Array(4), geom : new Array(4)};

	gl.vector.v3[3] = VM.V3(1   ,-3,2);
	gl.vector.v3[0] = VM.V3(gl.vector.v3[3].x,0,0);
	gl.vector.v3[1] = VM.V3(0,gl.vector.v3[3].y,0);
	gl.vector.v3[2] = VM.V3(0,0,gl.vector.v3[3].z);

	for (var i = 0; i < gl.vector.geom.length; i++) {
		var vborn = new VM.V3().copy(gl.vector.v3[i]);
		gl.vector.geom[i] = new VM.Vector(vborn);
		gl.vector.geom[i].setColor(0x0099ff);
		gl.scene.add(gl.vector.geom[i]);
	}
	gl.vector.geom[3].setColor(0x004d99);

	//Translate the vectors to the path
	gl.vector.geom[1].translateTo(gl.vector.v3[0]);
	var sumavect01 = VM.V3();
	sumavect01.addVectors(gl.vector.v3[0],gl.vector.v3[1])
	gl.vector.geom[2].translateTo(sumavect01 );

	//Render it in the container  and put the tags


	gl.vector.geom[0].activateTag("v_{x} \\cdot {\\hat{i}}",{top : 0 , fontSize : 27 , jQueryContainer : gl.container , katex:true , id : "vectorvx"});
	gl.vector.geom[1].activateTag("v_{y} \\cdot {\\hat{j}}",{top : 0 , fontSize : 27 , jQueryContainer : gl.container , katex:true , id : "vectorvy"});
	gl.vector.geom[2].activateTag("v_{z} \\cdot {\\hat{k}}",{top : 0 ,fontSize : 27 , jQueryContainer : gl.container , katex:true , id : "vectorvz"});
	gl.vector.geom[3].activateTag("v",{top : 0 ,fontSize :27 , jQueryContainer : gl.container , katex:true , id : "vectorv"});
	$("#vectorvx").css('opacity',0).css("position",'fixed').addClass("f1 vecUI  f1ui");
	$("#vectorvy").css('opacity',0).css("position",'fixed').addClass("f1 vecUI f1ui");
	$("#vectorvz").css('opacity',0).css("position",'fixed').addClass("f1 vecUI f1ui");
	$("#vectorv").css('opacity',0).css("position",'fixed').addClass("f1 vecUI f1ui");

	for (var i = 0; i < gl.vector.geom.length; i++) {
		var vdir = VM.V3().copy(gl.vector.geom[i].destination);
		vdir.multiplyScalar(0.001)
		gl.vector.geom[i].UpdateTarget(vdir);
	}

	//TWEENS of vectors, Check if the animation is finished

	gl.finishedv=false;
	var v1scale = new TWEEN.Tween({t:0.001})
	.to({t:1}, 2000).onUpdate(
		function() {
			var vborn = new VM.V3().copy(gt.vector.v3[0]);
			vborn.multiplyScalar(this.t)
			gt.vector.geom[0].UpdateTarget(vborn);
			//$("#vectorvx").css('opacity',this.t);
		}
	)
	.start();

	var v2scale = new TWEEN.Tween({t:0.001})
	.to({t:1}, 2000).onUpdate(
		function() {
			var vborn = new VM.V3().copy(gt.vector.v3[1]);
			vborn.multiplyScalar(this.t)
			gt.vector.geom[1].UpdateTarget(vborn);
			//$("#vectorvy").css('opacity',this.t);
		}
	)
	.delay(2000)
	.start();

	var v3scale = new TWEEN.Tween({t:0.001})
	.to({t:1}, 2000).onUpdate(
		function() {
			var vborn = new VM.V3().copy(gt.vector.v3[2]);
			vborn.multiplyScalar(this.t)
			gt.vector.geom[2].UpdateTarget(vborn);
			//$("#vectorvz").css('opacity',this.t);
		}
	)
	.delay(4000)
	.start();

	var vscale = new TWEEN.Tween({t:0.001})
	.to({t:1}, 2000).onUpdate(
		function() {
			var vborn = new VM.V3().copy(gt.vector.v3[3]);
			vborn.multiplyScalar(this.t)
			gt.vector.geom[3].UpdateTarget(vborn);
			//$("#vectorv").css('opacity',this.t);
			if (this.t>0.99) {
				gt.finishedv=true

			}
		}
	)
	.delay(6000)
	.start();




	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//**************************************************************
	///*************************************************************

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//// Scene 2 , Insert objects inside three.sc2
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	// ObjectsForStorage
	three.sc2.innerObjects = {};
	var gl = three.sc2.innerObjects;
	gl.scene = three.sc2;
	gl.camera = three.camera;

	gl.grid = new THREE.GridHelper(20,2);
	gl.grid.rotation.x = Math.PI/2;
	gl.grid.setColors("#334488","#88aadd");

	gl.scene.add(gl.grid);

	gl.grid = new THREE.GridHelper(20,2);
	gl.grid.setColors("#334488","#88aadd");

	gl.scene.add(gl.grid);

	//Initial camera position
	gl.camera.position.x = 17;
	gl.camera.position.y = 12;
	gl.camera.position.z = 8;
	gl.camera.lookAt(gl.scene.position);
	// If it is buggy
	window.setTimeout(
		function(x){
			three.camera.position.x = 17;
			three.camera.position.y = 12;
			three.camera.position.z = 8;
			three.camera.lookAt(three.scene.position);
		},50)
	// Camera

	//Controls (?move to VM)


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


	//Now draw two vectors
	gl.vector = {v3 : new Array(3) , geom : new Array(3)};
	gl.vector.v3[0] = VM.V3(5,6,2);
	gl.vector.v3[1] = VM.V3(-4,-8,3);
	//Third vector is addition of first two vectors
	gl.vector.v3[2] = VM.V3();
	gl.vector.v3[2].addVectors(gl.vector.v3[0],gl.vector.v3[1]);
	gl.activevector = undefined;


	for (var i = 0; i < gl.vector.geom.length; i++) {
		var vborn = new VM.V3().copy(gl.vector.v3[i]);
		gl.vector.geom[i] = new VM.Vector(vborn);
		gl.vector.geom[i].setColor(0x0099ff);
		gl.scene.add(gl.vector.geom[i]);
	}
	//Render the scene in the current Page



	gl.vector.geom[2].setColor(0x003d99);
	//Translate the second vector to the head of the first
	gl.vector.geom[1].translateTo(gl.vector.v3[0]);
	for (var i = 0; i < gl.vector.geom.length; i++) {
		var vdir = VM.V3().copy(gl.vector.geom[i].destination);
		vdir.multiplyScalar(0.001)
		gl.vector.geom[i].UpdateTarget(vdir);
	}
	var v1scale = new TWEEN.Tween({t:0.001})
	.to({t:1}, 2000).onUpdate(
		function() {
			var vborn = new VM.V3().copy(gl.vector.v3[0]);
			vborn.multiplyScalar(this.t)
			gl.vector.geom[0].UpdateTarget(vborn);
			//$("#vectoru").css('opacity',this.t);
		}
	)
	.start();

	var v2scale = new TWEEN.Tween({t:0.001})
	.to({t:1}, 2000).onUpdate(
		function() {
			var vborn = new VM.V3().copy(gl.vector.v3[1]);
			vborn.multiplyScalar(this.t)
			gl.vector.geom[1].UpdateTarget(vborn);
			//$("#vectorv").css('opacity',this.t);
		}
	)
	.delay(2000)
	.start();

	var v3scale = new TWEEN.Tween({t:0.001})
	.to({t:1}, 2000).onUpdate(
		function() {
			var vborn = new VM.V3().copy(gl.vector.v3[2]);
			vborn.multiplyScalar(this.t)
			gl.vector.geom[2].UpdateTarget(vborn);
			//$("#vectorvu").css('opacity',this.t);
		}
	)
	.delay(4000)
	.start();

	pos = $(three.renderer.domElement).position();

	//console.log(pos);
	gl.vector.geom[0].activateTag("u",{top : pos.top/2 , left: pos.left / 2, fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectoru"});
	gl.vector.geom[1].activateTag("v",{top : pos.top/2 , left: pos.left / 2, fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorv"});
	gl.vector.geom[2].activateTag("u + v",{top : pos.top/2 , left: pos.left / 2,fontSize : 35 , jQueryContainer : gl.container , katex:true , id : "vectorvu"});
	$("#vectoru").css('opacity',0).css("position",'fixed').addClass("f2 vecUI f2ui");
	$("#vectorv").css('opacity',0).css("position",'fixed').addClass("f2 vecUI f2ui");
	$("#vectorvu").css('opacity',0).css("position",'fixed').addClass("f2 vecUI f2ui");


	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//**************************************************************
	///*************************************************************


	function f0(){
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//// Animation loop, Event null
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////////////////////////////////////

		var t = three.Time.now;
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
		var gl = three.sc1.innerObjects;

		for (var i = 0; i < gl.base.geom.length; i++) {

			gl.base.geom[i].updateTag(three.camera,three.renderer);
		};

		for (var i = 0; i < gl.vector.geom.length; i++) {
			gl.vector.geom[i].updateTag(three.camera,three.renderer);
		}

		gl.axes[0].lookAt(three.camera);
		gl.axes[0].reposition();
		gl.axes[1].lookAt(three.camera);
		gl.axes[1].reposition();
		gl.axes[2].lookAt(three.camera);
		gl.axes[2].reposition();

		if (gl.finishedv) {
			var up= VM.keyControls(gl.vector.geom[3].destination,0.1);
			var right= gl.vector.geom[1].translateTo(gl.vector.geom[0].destination);
			var left= gl.vector.geom[2].translateTo(VM.V3().addVectors(gl.vector.geom[1].destination, gl.vector.geom[1].translation));
			gl.vector.geom[3].UpdateTarget(up);
			gl.vector.geom[0].UpdateTarget( VM.V3(gl.vector.geom[3].destination.x ,0,0) );
			gl.vector.geom[1].UpdateTarget( VM.V3(0,gl.vector.geom[3].destination.y,0) );
			gl.vector.geom[2].UpdateTarget( VM.V3(0,0,gl.vector.geom[3].destination.z));

		};
		var elem=$("#katexfield4")

		katex.render(" \\begin{pmatrix} "+
		VM.Round(gl.vector.geom[0].destination.x) +" \\\\ " +
		VM.Round(gl.vector.geom[1].destination.y)+" \\\\" +
		VM.Round(gl.vector.geom[2].destination.z)+" \\end{pmatrix} ="+
		VM.Round(gl.vector.geom[0].destination.x) +" \\begin{pmatrix} 1\\\\ 0 \\\\ 0 \\end{pmatrix} + "+
		VM.Round(gl.vector.geom[1].destination.y) +" \\begin{pmatrix} 0 \\\\ 1 \\\\ 0 \\end{pmatrix} + "+
		VM.Round(gl.vector.geom[2].destination.z)+" \\begin{pmatrix} 0 \\\\ 0 \\\\ 1 \\end{pmatrix} ",elem.get(0));
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
		var gl = three.sc2.innerObjects;
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		//**************************************************************
		///*************************************************************
		for (var i = 0; i < gl.vector.geom.length; i++) {
			gl.vector.geom[i].updateTag(three.camera,three.renderer);
		}
		gl.camera = three.camera;
		gl.axes[0].lookAt(three.camera);
		gl.axes[0].reposition();
		gl.axes[1].lookAt(three.camera);
		gl.axes[1].reposition();
		gl.axes[2].lookAt(three.camera);
		gl.axes[2].reposition();

		if(gl.activevector){
			//console.log("gl active");
			//console.log(gl.activevector);
			var cont = VM.keyControls(gl.activevector.destination);
			gl.activevector.UpdateTarget(cont);
			gl.vector.geom[1].translateTo(gl.vector.geom[0].destination);
			gl.vector.geom[2].UpdateTarget(VM.V3().addVectors(gl.vector.geom[0].destination,gl.vector.geom[1].destination));


		};

		var elem=$("#katexfield3")
		if(elem.get(0)){         katex.render("\\begin{pmatrix}"+
		VM.Round(gl.vector.geom[0].destination.x) +"\\\\"+
		VM.Round(gl.vector.geom[0].destination.y) +"\\\\"+
		VM.Round(gl.vector.geom[0].destination.z)+"\\end{pmatrix} + \\begin{pmatrix}"+
		VM.Round(gl.vector.geom[1].destination.x) +"\\\\"+
		VM.Round(gl.vector.geom[1].destination.y) +"\\\\"+
		VM.Round(gl.vector.geom[1].destination.z)+ "\\end{pmatrix} =\\begin{pmatrix}"+
		VM.Round(gl.vector.geom[2].destination.x) +"\\\\"+
		VM.Round(gl.vector.geom[2].destination.y) +"\\\\"+
		VM.Round(gl.vector.geom[2].destination.z)+"\\end{pmatrix}",elem.get(0));
	}


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
	TWEEN.update();
	// Trigger controls for two triggers , Use the functions f0 f1 and f2 to set the trigger scene behavior
	tp = $(window).scrollTop()
	t1 = $("#trig1").offset().top;
	t2 = $("#trig2").offset().top;
	wh = $(window).height();

	if((t2) < tp + (wh)){
		trig1();
	}
	else {if(t1 < tp + (wh/2)){
		trig2();
	}else{
		trig0();
	}
}

var t = three.Time.now;

//// Three camera control is inside every f'()
});

function sc1visible(){
	VM.message("Animacion 1 Activada, Presione <b>Z</b> para ocultar el texto.",10000,3000);
	var visible = true;
	three.sc1.traverse(function(child){
		child.visible = visible;
	});
	$(".f1ui").addClass("vecUI");
	if(uivisible){
		$(".f1").animate({opacity: 0.3},300);

	}else{
		$(".f1").animate({opacity: 1},300);
	}
}
function sc1invisible(){
	var visible = false;
	$(".f1ui").removeClass("vecUI");
	three.sc1.traverse(function(child){
		child.visible = visible;
	});
	$(".f1").animate({opacity: 0},300);
}

function sc2visible(){
	VM.message("Animacion 2 Activada, Presione <b>Z</b> para ocultar el texto.",10000,3000);
	var visible = true;
	$(".f2ui").addClass("vecUI");
	three.sc2.traverse(function(child){
		child.visible = visible;
	});
	if(uivisible){
		$(".f2").animate({opacity: 0.3},300);
	}else{
		$(".f2").animate({opacity: 1},300);
	}
}
function sc2invisible(){
	var visible = false;
	$(".f2ui").removeClass("vecUI");
	three.sc2.traverse(function(child){
		child.visible = visible;
	});
	$(".f2").animate({opacity: 0},300);
}

trig0 = function(){
	if(three.sc1.visible){
		sc1invisible();
	}else if(three.sc2.visible){
		sc2invisible();
	}else{}
	f0();
}

trig1 = function(){
	if(!three.sc1.visible){
		sc2invisible();
		sc1visible();
	}
	f1();
}
trig2 = function(){
	if(!three.sc2.visible){
		sc2visible();
		sc1invisible();
	}
	f2();
}



}
