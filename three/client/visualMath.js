// Visual Math, a library for math visualization

VM = {};

//VM Storage
VM.Storage = {};

//Wrapper for threejs vector3
VM.V3 = function(x,y,z){
        x = x || 0;
        y = y || 0;
        z = z || 0;
        var obj = new THREE.Vector3(x,y,z);
        return obj;
}

//Returns a string with a vec2 coordinates.

VM.V3String = function(vec3){
        var str = "( x: ";
        str += (Math.floor(vec3.x*1000)/1000).toString()+ " y: ";
        str += (Math.floor(vec3.y*1000)/1000).toString()+" z: ";
        str +=  (Math.floor(vec3.z*1000)/1000).toString()+ " )";
        return str;
}
//VM.Keyboard , handles keyboard state
VM.keyboard = new THREEx.KeyboardState();

//VM.Keycontrols (v3 , vstep)
/*

Use to enable the wasd - qe keys to change a vec3.
v3 is the vector to change , vstep is the step that it shoul be changed upon the key press.
keys a and d change the x component, w and s change the y component and q and e change the z component
The new vector is returned not changed in the function.

This function is intended for its use in render loops-

*/

VM.keyControls = function(v3,vstep){
        var npos = VM.V3();
        vstep = vstep || 0.1
        npos.copy(v3);
        if(VM.keyboard.pressed("a")){
                npos.x -=vstep;
        }
        if(VM.keyboard.pressed("d")){
                npos.x +=vstep;
        }
        if(VM.keyboard.pressed("s")){
                npos.y -=vstep;
        }
        if(VM.keyboard.pressed("w")){
                npos.y +=vstep;
        }
        if(VM.keyboard.pressed("q")){
                npos.z +=vstep;
        }
        if(VM.keyboard.pressed("e")){
                npos.z -=vstep;
        }
        return npos;
}

/****

VM.Axis --- A reusable axis object with ticks.

usage :

VM.Axis(ticks, options)

Options is a object with the following possible parameters :
  *textSize : Size of the text.
  *textHeight : Depth of the text.
  *font : font, must be loaded.
  *lineColor : Color of the lines that make the ticks
  *textColor : Color of the text.

Examples :

Draw an axis with ticks from -10 to 10.
    ticks = [-10,-5,-2,0,2,5,10]
    axis = new VM.Axis(ticks);
    scene.add(axis)

Draw two axis with different font sizes :

    tickgeoms[0] = new VM.Axis(ticksBig,{textSize : 1});
    tickgeoms[1] = new VM.Axis(ticksSmall,{textSize : 0.6});

****/
VM.Axis = function(ticks, options ) {
  THREE.Group.call( this );
  this.ticks = ticks || [];
  this.options = options || {};

  this.textSize = this.options.textSize || 0.5;
  this.textHeight = this.options.textHeight || 0;
  this.font =  this.options.font || "aller";
  this.lineColor = this.options.lineColor || 0x333333;
  this.textColor = this.options.textColor || 0x111111;

  // Set the materials
  linematerial = new THREE.LineBasicMaterial({color : this.lineColor});
  textmaterial = new THREE.LineBasicMaterial({color : this.textColor});

  //Array to hold the tick text geometries
  tickgeoms = new Array(this.ticks.length);
  //Array to hold the tick number text meshes
  this.ticktexts = new Array(this.ticks.length);
  //Lines for the ticks
  tickline = new Array(this.ticks.length);
  //Construct the geometry.
  for (var i = 0; i < this.ticks.length; i++) {
    tickline[i] = new THREE.Geometry();
    tickline[i].vertices.push(new THREE.Vector3(this.ticks[i],-this.textSize,0));
    tickline[i].vertices.push(new THREE.Vector3(this.ticks[i],this.textSize,0));
    this.add(new THREE.Line(tickline[i],linematerial))

    tickline[i] = new THREE.Geometry();
    tickline[i].vertices.push(new THREE.Vector3(this.ticks[i],0,-this.textSize));
    tickline[i].vertices.push(new THREE.Vector3(this.ticks[i],0,this.textSize));
    this.add(new THREE.Line(tickline[i],linematerial))

    var tickstr = this.ticks[i].toString();
    tickgeoms[i] = new THREE.TextGeometry(tickstr,{size : this.textSize, height: this.textHeight , font : this.font});
    //Center the number
    tickgeoms[i].center()
    this.ticktexts[i] = new THREE.Mesh(tickgeoms[i], textmaterial);
    this.ticktexts[i].position.x = this.ticks[i];
    this.ticktexts[i].position.y = -1*this.textSize -1;
    this.ticktexts[i].position.z = 0;
    this.add(this.ticktexts[i]);
  }

};

VM.Axis.prototype = Object.create(THREE.Group.prototype);
VM.Axis.prototype.constructor = VM.Axis;


/***
LookAt Camera

Call this function inside the main render loop when the camera changes position to make the ticknums face the camera.

  Axis.lookAt(camera)

***/
VM.Axis.prototype.lookAt = function(camera){
  var scenetemp = new THREE.Group();
  for (var i = 0; i < this.ticks.length; i++) {
    THREE.SceneUtils.detach(this.ticktexts[i],this,scenetemp);
    this.ticktexts[i].lookAt(camera.position);
    this.ticktexts[i].rotation.x = camera.rotation.x;
    this.ticktexts[i].rotation.y = camera.rotation.y;
    this.ticktexts[i].rotation.z = camera.rotation.z;
    this.ticktexts[i].updateMatrix();
    THREE.SceneUtils.attach(this.ticktexts[i],scenetemp,this);
  }
}


/*
VM.Axis.textTranslate

In cases where the axis align wrong with the text, use this function to offset the text in a 3D coordinate space.



*/
VM.Axis.prototype.textTranslate = function(x,y,z){
        for (var i = 0; i < this.ticktexts.length; i++) {
                this.ticktexts[i].position.x += x;
                this.ticktexts[i].position.y += y;
                this.ticktexts[i].position.z += z;
        }
}
/****

VM.Vector a vector object for displaying in the visualizations

destination : the destination vec3.
origin : the origin, vec3
options :       vectorColor :  a color to apply to the vector.


****/

VM.Vector = function(destination , origin , options){
  THREE.Group.call( this );
  this.origin = origin || new THREE.Vector3(0,0,0);
  this.destination = new THREE.Vector3(0,0,0);
  this.destination.copy(destination);
  this.vectorLen = destination.length();
  this.direction = destination.normalize();
  this.options = options || {};
  this.vectorColor = this.options.color || new THREE.Color(Math.random(),Math.random(), Math.random());
  this.vectorObject = new THREE.ArrowHelper( this.direction , this.origin , this.vectorLen , this.vectorColor , this.vectorLen / 10, this.vectorLen / 20 );
  this.add(this.vectorObject);
  destination.copy(this.destination);
  this.cone = this.vectorObject.cone;
};

VM.Vector.prototype = Object.create(THREE.Group.prototype);
VM.Vector.prototype.constructor = VM.Vector;

/*
VM.Vector.UpdateTarget(vec3 destination)

Sets a new destination to the vector.

*/

VM.Vector.prototype.UpdateTarget = function(destination){
  //Updating the vector
  //First, save the new vector and extract the usual.
  this.destination.copy(destination);
  this.vectorLen = destination.length();
  this.direction = destination.normalize();
  this.vectorObject.setDirection(this.direction);
  this.vectorObject.setLength(this.vectorLen, this.vectorLen/10 , this.vectorLen/20);
  destination.copy(this.destination);
};


/*
VM.Vector.setColor(color hex)
Assigns a new hexadecimal color or threejs color to the vectorObject
*/
VM.Vector.prototype.setColor = function(hex){
  this.vectorObject.setColor(hex);
};


/*
VM.Vector.translate(vec3)
Translates this vector along the desired coordinates by the magnitude of the argument , note that if the vector is rotated it will be translated along its current rotation
*/
VM.Vector.prototype.translate = function(vec3){
        this.vectorObject.translateX(vec3.x);
        this.vectorObject.translateY(vec3.y);
        this.vectorObject.translateZ(vec3.z);
}

/*
VM.Vector.translateTo(vec3)
translates the vector origin to a new position.

*/

VM.Vector.prototype.translateTo = function(vec3){
        this.vectorObject.position.copy(vec3);
}
