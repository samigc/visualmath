Template.vmstart.rendered = function(){

	setTimeout(function(){
		var y = $(window).scrollTop(); $("html, body").animate({ scrollTop: y + $(".sitemenutemplate").height() }, 1000);
	}, 3000);

	console.log("vmstart wecolme");
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
	el.css("opacity","0.5");

	cubes = [];
	for (var i = 0; i < 200; i++) {
		a = Math.random() * 10 - 5;
		b = Math.random() * 10 - 5;
		c = Math.random() * 10 - 5;
		var mesh = new THREE.Mesh(new THREE.CubeGeometry(a/2, b/2, c/2), new THREE.MeshNormalMaterial({transparent:true,opacity:0.3}));
		three.scene.add(mesh);
		mesh.position.set(3*a*Math.random(),3*b*Math.random(),3*c*Math.random());
		cubes[i] = mesh;
	}


	three.on('update', function () {
		var t = three.Time.now * .3;
		//three.camera.position.set(.6,10*Math.cos(t/3), 3*Math.sin(t/19)*Math.sin(t/3));
		three.camera.position.set(
			5*Math.cos(t),
			5*Math.sin(t),
			5*Math.cos(t*.5)
		);
		three.camera.lookAt(new THREE.Vector3());

		for (var i = 0; i < cubes.length; i++) {
			cx = cubes[i].position.x;
			cy = cubes[i].position.y;
			cz = cubes[i].position.z;
			cubes[i].position.set(cx + 0.001 * (Math.cos(t)-0.5) , cy + 0.001 * (Math.sin(t)-0.5), cz);
		}
	});
}

Template.vmmenu.rendered = function(){

	//El menu aparece apagado,
	pageState = {};
	pageState.menu = false;

	var btnlist = document.getElementById('vmmenubtn');
	btnlist.addEventListener('click', function() {
		$(".vmmenu").animate({width : 250 , opacity : 1 , left:0},{duration : 600})
		$('.vmmenu').css("z-index",20);
		$(".cover").css("width","100%");
		$(".cover").css("height","100%");
		$(".cover").css("z-index",19);
		$(".cover").animate({opacity:0.5},{duration : 600});
		$(function() {
			$({blurRadius: 0}).animate({blurRadius: 2}, {
				duration: 600,
				easing: 'swing', // or "linear"
				// use jQuery UI or Easing plugin for more options
				step: function() {
					$('#vmcontainer').css({
						"-webkit-filter": "blur("+this.blurRadius+"px)",
						"filter": "blur("+this.blurRadius+"px)"
					});
				}
			});
		});
	}, false);

	var cover = document.getElementById('cover');
	cover.addEventListener('click', function() {
		$(".vmmenu").animate({width : 0 , opacity : 0, "z-index": -10 , left:-250},{duration : 300})
		$(".cover").css("width","0%");
		$(".cover").css("height","0%");
		$(".cover").css("z-index","-9");
		$(".cover").animate({opacity:0},{duration : 300});
		$({blurRadius: 2}).animate({blurRadius: 0}, {
			duration: 300,
			easing: 'swing', // or "linear"
			// use jQuery UI or Easing plugin for more options
			step: function() {
				$('#vmcontainer').css({
					"-webkit-filter": "blur("+this.blurRadius+"px)",
					"filter": "blur("+this.blurRadius+"px)"
				});
			}
		});
	}, false);

}
