
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var states = [
    { x : 44, y : 68, label : "first" },
    { x : 340, y : 150, label : "second" },
    { x : 300, y : 350, label : "third" },
    { x : 300, y : 350, label : "fourth" },
    { x : 50, y : 270, label : "fifth" },
    { x : 500, y : 400, label : "last" }
]

window.svg = d3.select("body")
.append("svg")
.attr("width", width   )
.attr("height", height );    



var SelDots=svg.selectAll( "g.state")
.data(states);

var SelDot= SelDots
.enter()
.append( "g")
    .attr({
        'transform' : function(d){
            return "translate (" + [d.x,d.y] + ")";
        },
        'class'   : 'state',
        /*r       : 10,
        cx      : function( state) {
            return state.x;
        },
        cy      : function( state) {
            return state.y;
        }*/
    })
   /* .on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
    .on("mouseout", function(){d3.select(this).style("fill", "white");})*/;
   

//svg.append("circle").attr("class","selected").attr("r",13);


console.log("first flag");


//var funcion=function(d,i){ return d3.event.dx;};
var drag= d3.behavior.drag()
    
    .on("drag",  function (d,i) {
        
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
        });
        /*selected.attr("transform",function(d,i) {
            return "scale (" + d3.event.dy + ")";
        })
        ;*/
        this.parentNode.appendChild(this)
        d3.event.sourceEvent.stopPropagation();

        //return console.log(!(!d3.event.ctrlKey));
    });

SelDot.call(drag);

SelDot.append("circle")
    .attr({
        r : 10,
        class : 'outer' 
    });

SelDot.append("circle")
    .attr(
        {
        r : 8,
        class : 'inner' 
    })
    .on("click", function(d,i){
        
        d3.select(this.parentNode).classed("selected")
        console.log("Es" +this +"y esta contenido en"+this.parentNode)   
        console.log(!!d3.event.ctrlKey)
          
    })
    .on("mouseover", function(){d3.select(this).style("fill","aliceblue")})
    .on("mouseout l", function(){d3.select(this).style("fill","blue")})
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