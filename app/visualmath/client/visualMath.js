// Visual Math, a library for math visualization

VM = {}


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
  THREE.Object3D.call( this );
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

VM.Axis.prototype = Object.create(THREE.Object3D.prototype);
VM.Axis.prototype.constructor = VM.Axis;


/***
LookAt Camera

Call this function inside the main render loop when the camera changes position to make the ticknums face the camera.

  Axis.lookAt(camera)

***/
VM.Axis.prototype.lookAt = function(camera){
  var scenetemp = new THREE.Object3D();
  for (var i = 0; i < this.ticks.length; i++) {
    THREE.SceneUtils.detach(this.ticktexts[i],this,scenetemp);
    this.ticktexts[i].lookAt(camera.position);
    this.ticktexts[i].rotation.x = camera.rotation.x;
    this.ticktexts[i].rotation.y = camera.rotation.y;
    this.ticktexts[i].rotation.z = camera.rotation.z;
    this.ticktexts[i].updateMatrix();
    THREE.SceneUtils.attach(this.ticktexts[i],scenetemp,this);
  }
};


/****

VM.Vector a vector object for displaying in the visualizations



****/

VM.Vector = function(destination , origin , options){
  THREE.Object3D.call( this );
  this.origin = origin || new THREE.Vector3(0,0,0);
  this.destination = new THREE.Vector3(0,0,0);
  this.destination.copy(destination);
  this.vectorLen = destination.length();
  this.direction = destination.normalize();
  this.options = options || {};
  this.vectorColor = this.options.color || new THREE.Color(Math.random(),Math.random(), Math.random());
  this.vectorObject = new THREE.ArrowHelper( this.direction , this.origin , this.vectorLen , this.vectorColor , this.vectorLen / 10, this.vectorLen / 20 );
  this.add(this.vectorObject);
};

VM.Vector.prototype = Object.create(THREE.Object3D.prototype);
VM.Vector.prototype.constructor = VM.Vector;

VM.Vector.prototype.UpdateTarget = function(destination){
  //Updating the vector
  //First, save the new vector and extract the usual.
  this.destination.copy(destination);
  this.vectorLen = destination.length();
  this.direction = destination.normalize();
  this.vectorObject.setDirection(this.direction);
  this.vectorObject.setLength(this.vectorLen, this.vectorLen/10 , this.vectorLen/20);
};

VM.Vector.prototype.setColor = function(hex){
  this.vectorObject.setColor(hex);
};
