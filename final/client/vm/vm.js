Template.visualmath.rendered = function(){

	var btnlist = document.getElementById('vmbutton');
	btnlist.addEventListener('click', function() {
		window.location = "/vm/start";
	}, false);

	getScroll = function(){
		return $(window).scrollTop();
	}
	container = document.getElementById('vmcontainer');
	THREE.new("three",container);
	three.Size.set({
		height: $(window).height()
	});

	el = $(three.renderer.domElement);
	el.css("top","0");
	el.css("position","fixed");
	el.css("z-index","-100");
	el.css("opacity","0.5");


	// Insert a cube

	var mesh = new THREE.Mesh(new THREE.CubeGeometry(.5, .5, .5), new THREE.MeshNormalMaterial());
	three.scene.add(mesh);

	var geometry = new THREE.Geometry();
	points = tori();
	colors = [];
	for ( i = 0; i < points.length; i ++ ) {
					geometry.vertices.push( points[ i ] );
					colors[ i ] = new THREE.Color( 0xff0000 );
					colors[ i ].setHSL( 1/(1+Math.exp(-0.3*(points[i].x))) , 1, 0.5 + 0.5/(1+Math.exp(-(points[i].z))) );
	}
	geometry.colors = colors;
	material = new THREE.LineBasicMaterial( { color: 0xaaffff, opacity: 1, linewidth: 30, vertexColors: THREE.VertexColors } );
	line = new THREE.Line( geometry,  material );
	three.camera.position.set(0,0,15)
	three.scene.add(line);

	//three.composer = new THREE.EffectComposer(webGLRenderer);

	// Orbit the camera
	three.on('update', function () {
		var t = three.Time.now * .3;
		//three.camera.position.set(.6,10*Math.cos(t/3), 3*Math.sin(t/19)*Math.sin(t/3));
		three.camera.position.set(
			(2 *  Math.cos(0) + 8)* Math.cos(t)
			,(2 *  Math.cos(0) + 8)* Math.sin(t)
			, 2 * Math.sin(0) * Math.cos(t*.5)
		 );
		 t = t + 20;
		three.camera.lookAt(new THREE.Vector3(
			(2 *  Math.cos(0) + 8)* Math.cos(t)
			,(2 *  Math.cos(0) + 8)* Math.sin(t)
			, 2 //* Math.sin(0) * Math.cos(t*.5)
		));
	});
}

v3sine = function(){
	pts = [];
	idx = 0;
	for (var k = -5; k < 5; k = (k + 0.2)) {
		for (var j = -5; j < 5; j = (j + 0.2)) {
			pts[idx] = new THREE.Vector3(
				Math.sin(k)
				,Math.cos(j)
				,Math.sin(k*j)
			);
			pts[idx].x += Math.sin(idx/100);
			idx ++;
		}
	}
	return pts;
}
v3sine2 = function(){
	pts = [];
	idx = 0;
	range = 3;
	step = 0.05;
	for (var i = 0; i < 10; i = i + 0.1) {
		for (var k = -range; k < range; k = (k + step)) {
				pts[idx] = new THREE.Vector3(
					i * Math.sin(k)
					,i - k - 5
					, i * Math.cos((k+Math.PI))
				);
				idx ++;
		}
	}

	return pts;
}

cardioid = function(){
	pts = [];
	idx = 0;
	range = Math.PI;
	step = 0.1;
	for (var i = 0; i < 20; i = i + 0.5) {
		for (var k = -range; k < range; k = (k + step)) {
				pts[idx] = new THREE.Vector3(
					i * (2 * Math.cos(k) - Math.cos(2*k)) * .1
					,(i - k - 10) * .1
					, i *( 2*Math.sin(k) - Math.sin(2*k)) * .1
				);
				idx ++;
		}
	}
	return pts;
}

cardioid2 = function(){
	pts = [];
	idx = 0;
	range = Math.PI;
	step = 0.1;
	for (var i = 0; i < 20; i = i + 0.5) {
		for (var k = -range; k < range; k = (k + step)) {
				pts[idx] = new THREE.Vector3(
					i * (2 * Math.cos(k) - Math.cos(2*k)) * .1
					,(i - k - 10) * .1
					, i *( 2*Math.sin(k) - Math.sin(2*k)) * .1
				);
				idx ++;
		}
	}
	return pts;
}

tori = function(){
	pts = [];
	idx = 0;
	range = 2 * Math.PI;
	step = 0.1;
	for (var i = 0; i < range; i = i + step*.4) {
		for (var k = 0 ; k < range; k = (k + step)) {
				pts[idx] = new THREE.Vector3(
					(5*(1/2*Math.PI)  *  Math.cos(i) + 8)* Math.cos(k)
					,(5*(1/2*Math.PI)  *  Math.cos(i) + 8)* Math.sin(k)
					, 5*(1/2*Math.PI)  * Math.sin(i) * Math.cos(k*.5)
				);
				idx ++;
		}
	}
	return pts;
}
