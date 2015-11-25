THREE.new = function(th,args){
	if(typeof window[th] != "undefined"){
		window[th].renderer.forceContextLoss();
		window[th].destroy();
	}
	window[th] = THREE.Bootstrap(args);
	return window[th];
}
