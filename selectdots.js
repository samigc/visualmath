//Svg parameters
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//axis
var x= d3.scale.linear()
.domain([-width/2,width/2])
.range([0,width]);

var y=d3.scale.linear()
.domain([-height/2,height/2])
.range([height,0]);

var xAxis =d3.svg.axis()
.scale(x)
.orient("bottom")
.ticks(10)
.tickSize(-height);

var yAxis =d3.svg.axis()
.scale(y)
.orient("left")
.ticks(10)
.tickSize(-width);


console.log(d3.behavior.zoom()
    /*.x(x)
    .y(y)*/
    
    .on("zoom",zoomed));



//data
var states = [
    { x : 44, y : 68, label : "first" },
    { x : 340, y : 150, label : "second" },
    ]
//svg inside windows and zoom behavior of
window.svg = d3.select("body")
.append("svg")
.attr("width", width )
.attr("height", height )
.append("g")
.call(d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1,32])
    .on("zoom",zoomed))
.append("g");



//function zoomed
function zoomed() {
    window.svg.attr("transform","translate("+d3.event.translate+")scale("+d3.event.scale+")")
};

window.svg.append("rect")
    .attr("width", width )
    .attr("height", height );

window.svg.append("g")
    .attr("class", "x axis")
    .attr("transform","translate(0,"+height+")")
    .call(xAxis);
window.svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

//select all dots
var SelDots=svg.selectAll( "g.state")
.data(states);
//insert dots
var SelDot= SelDots
.enter()
.append( "g")
    .attr({
        'transform' : function(d){
            return "translate (" + [d.x,d.y] + ")";
        },
        'class'   : 'state',
     
    })
   /* .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
    .on("mouseout", function(){d3.select(this).style("fill", "white");})*/;
   

//svg.append("circle").attr("class","selected").attr("r",13);


console.log(d3.behavior.drag().on("dragstart",dragini));

//drag functions
function dragini (d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging",true);
};
function drag0 (d) {
    d3.select(this)
        .attr("cx",function (d,i){ d.x+=d3.event.dx;  return d.x;})
        .attr("cy",function (d,i){ d.y+=d3.event.dy; return d.y;})
};

function dragfini (d) {
    d3.select(this)
        .classed("dragging",false);
};
//var funcion=function(d,i){ return d3.event.dx;};
var drag= d3.behavior.drag()
    .origin(function (d){
        
        return d;
        
    })
    .on("dragstart",dragini)
    .on("drag",drag0)
    .on("dragend",dragfini);
    /*.on("drag",  function (d,i) {
        
        var selected= d3.selectAll(".selected");

        if(selected.indexOf(this)==-1){
            selected.classed("selected",false);
            selected= d3.select(this);
            selected.classed("selected",true);    
        }
        selected.attr("transform", function(d,i){
            d.x+=d3.event.dx    
            d.y+=d3.event.dy    
        return "translate (" + [d.x,d.y]+ ")";
        })
        selected.attr("transition",100);
        

        this.parentNode.appendChild(this);
        d3.event.sourceEvent.stopPropagation();

        return console.log(!(!d3.event.ctrlKey));
    });*/

//drag dots
SelDot.call(drag);
//draw dots
SelDot.append("circle")
    .attr({
        r : 15,
        class : 'outer' 
    });

SelDot.append("circle")
    .attr(
        {
        r : 13,
        class : 'inner' 
    })
    .on("click", function(d,i){
        //
        d3.select(this.parentNode).classed("selected")
        console.log("Es" +this +"y esta contenido en"+this.parentNode)   
        console.log(!!d3.event.ctrlKey)
    })
    .on("mouseover", function(){d3.select(this).style("fill","rgba(10,100,200,1)")})
    .on("mouseout", function(){d3.select(this).style("fill","rgba(10,200,100,1)").style("opacity",0.5)})
    ;


/*svg
.on( "mousedown", function() {
    var p = d3.mouse(this);

    svg.append( "rect")
    .attr({
        rx      : 10,
        ry      : 10,
        class   : "selection",
        x       : p[0],
        y       : p[1],
        width   : 0,
        height  : 0
    })
})
.on( "mousemove", function() {
    var s = svg.select( "rect.selection");

    if( !s.empty()) {
        var p = d3.mouse( this),

            d = {
                x       : parseInt( s.attr( "x"), 10),
                y       : parseInt( s.attr( "y"), 10),
                width   : parseInt( s.attr( "width"), 10),
                height  : parseInt( s.attr( "height"), 10)
            },
            move = {
                x : p[0] - d.x,
                y : p[1] - d.y
            }
        ;

        if( move.x < 1 || (move.x*2<d.width)) {
            d.x = p[0];
            d.width -= move.x;
        } else {
            d.width = move.x;       
        }

        if( move.y < 1 || (move.y*2<d.height)) {
            d.y = p[1];
            d.height -= move.y;
        } else {
            d.height = move.y;       
        }
       
        s.attr( d);
        //console.log( d);
    }
})
.on( "mouseup", function() {
    svg.select( ".selection").remove();
});*/

console.log("hola soyfeliz");