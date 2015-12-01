Template.addformm.events({
        'submit form' : function (event) {
                event.preventDefault();
                gl = VM.Storage.matrix;
                var a11=event.target.a11.value;
                a12=event.target.a12.value;
                a13=event.target.a13.value;
                a21=event.target.a21.value;
                a22=event.target.a22.value;
                a23=event.target.a23.value;
                a31=event.target.a31.value;
                a32=event.target.a32.value;
                a33=event.target.a33.value;

                var gl=three.matrices.innerObjects;
                gl.m3.set(a11,a12,a13,a21,a22,a23,a31,a32,a33);
                for (var i = 0; i < gl.vector.v3.length; i++) {
                        gl.vector.v3[i].transvec.copy(gl.vector.v3[i]);
                        gl.vector.v3[i].transvec.applyMatrix3(gl.m3);
                }
                gl.def = true;
                gl.vector.v3[1].transvec.copy(gl.vector.v3[1]);
                gl.vector.v3[1].transvec.applyMatrix3(gl.m3);
                console.log(gl.m3);

                elem=$("#katexfield5")
                katex.render("\\begin{pmatrix} "+
                a11+"&"+a12 +"&"+a13 +"\\\\"+
                a21+"&"+a22 +"&"+a23 +"\\\\"+
                a31+"&"+a32 +"&"+a33 +
                "\\end{pmatrix}",elem.get(0));
                return false;

        }
})

Template.vmmatricesc.rendered = function(){
        $('.eqfield').remove();
        //Reset to scrolltop when entering
        window.scrollTo(0, 0);
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

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //// Scene 1 , Insert objects inside three.sc1
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        three.matrices = three.matrices || {};
        three.matrices.innerObjects = three.matrices.innerObjects || {};
        var gl=three.matrices.innerObjects;
        gl.scene = three.sc1;
        gl.camera = three.camera;
        gl.renderer = three.renderer;

        gl.grid = new THREE.GridHelper(20,2);
        gl.grid.rotation.x = Math.PI/2;
        gl.grid.setColors("#338844","#88ddaa");

        gl.scene.add(gl.grid);

        gl.grid = new THREE.GridHelper(20,2);
        gl.grid.setColors("#338844","#88ddaa");

        gl.scene.add(gl.grid);

        //Initial camera position
        gl.camera.position.x = 17;
        gl.camera.position.y = 12;
        gl.camera.position.z = 8;
        gl.camera.lookAt(gl.scene.position);


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

        gl.m3 = new THREE.Matrix3() ;
        //console.log(gl.m3);
        //Draw vctors
        gl.vector = {v3: new Array(3), geom: new Array(3) };
        for (var i = 0; i < gl.vector.v3.length; i++) {
                gl.vector.v3[i]=VM.V3(Math.random()*20,Math.random()*20,Math.random()*20)
                .multiplyScalar((Math.random()-0.5))
        }

        for (var i = 0; i < gl.vector.geom.length; i++) {
                var vborn = new VM.V3().copy(gl.vector.v3[i]);
                gl.vector.geom[i] = new VM.Vector(vborn);
                gl.vector.geom[i].setColor(0x0099ff);
                gl.scene.add(gl.vector.geom[i]);
        }
        var material = new THREE.LineBasicMaterial({
                color: 0x0000ff
        });

        for (var i = 0; i < gl.vector.v3.length; i++) {
                gl.vector.v3[i].transvec = VM.V3();
        }

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
                gl.vector.v3[0],
                gl.vector.v3[1],
                gl.vector.v3[2],
                gl.vector.v3[0]
        );

        var line = new THREE.Line( geometry, material );
        gl.scene.add( line );

        gl.line = line;
        gl.def= false;

        function f1(){
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                //// Animation loop, Event 1
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                var gl=three.matrices.innerObjects;
                var t = three.Time.now;

                step = t;

                gl.axes[0].lookAt(gl.camera);
                gl.axes[1].lookAt(gl.camera);
                gl.axes[2].lookAt(gl.camera);
                gl.axes[0].reposition();
		gl.axes[1].reposition();
		gl.axes[2].reposition();

                gl.camera.lookAt(gl.scene.position);
                //console.log(gl.m3.elements);
                if(gl.def){
                        for (var i = 0; i < gl.vector.geom.length; i++) {
                                gl.vector.geom[i].UpdateTarget(gl.vector.v3[i].transvec)
                        }
                }

                gl.line.geometry.vertices[0] = gl.vector.geom[0].destination;
                gl.line.geometry.vertices[1] = gl.vector.geom[1].destination;
                gl.line.geometry.vertices[2] = gl.vector.geom[2].destination;
                gl.line.geometry.vertices[3] = gl.vector.geom[0].destination;

                gl.line.geometry.verticesNeedUpdate = true;
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                //**************************************************************
                ///*************************************************************
        }



        three.scene.add(three.sc1);


        three.on('update', function () {
                var t = three.Time.now;
                //// Three camera control is inside every f'()
                f1();
        });

}
