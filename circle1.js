


var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var radio= 100
var center={x:(width + margin.left)/2, y: (height+margin.top)/2 };

var svg = d3.select("#canvas-svg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
   
var kreis1=svg.append("circle")
  .attr("cx", center.x)
  .attr("cy", center.y)
  .style("fill","green")
  .style("opacity", .2)
  .style("stroke","blue")
  .attr("r", radio);
  
var kreis2=svg.append("circle")
  .attr("cx",center.x)
  .attr("cy",center.y)
  .attr("r",3);
  

var triangel1=svg.append("marker")
.attr("id","triangel1")
.attr("viewBox"," 0 0 60 40")
.attr("refX",0)
.attr("refY", 20)
.attr("markerWidth",15)
.attr("markerHeight",40)
.attr("orient","auto")
.append("svg:path")
//.attr("id","weise").attr("marker-end","url(#triangel1)")
.attr("d","M 0,0 L 60,20 L 0,40" )
.style("fill","blue")
    .style("stroke-linecap","round")
    .style("stroke","blue")
;



//.attr("marker-end","url(#Triangle)");


  //var PERIMETRO =  function(i) {Math.cos(i)+Math.sin(i)}
    
  var weise =  svg.append("path")
    .attr("d","M " + center.x +"," + center.y + " l 0 "+ radio )
    .style("fill","none")
    .style("stroke-linecap","round")
    .style("stroke","red")
    .attr("marker-end","url(#triangel1)")
    ;
    
/*weise
.append("svg:path")
.attr("marker-end","url(#triangel1)"); */       
        

svg.append("text")
.style("writing-mode","tb")
  .attr("x", center.x+radio/2)
  .attr("y", center.y)
  .text("I am not lost");



/*function interpolateNumber(a,b) {t=Math.atan2(b.y-a.y) return function(t) {
return a+t*(b-a);
};
}*/
//Angle from 0
var winkle= function(a,b){return Math.atan2(b.y-a.y,b.x-a.x);};
//To Json
var punkte=function(a,b){return{x: a,y: b};};
//angle two vectors
var zweipunkte= function(a,b,c,d) { return Math.abs(winkle(punkte(a,b),punkte(c,d)));};
//interpolacion
var interpolieren=function(a,b,c,d){  return 
 return b+(zweipunkte(a,b,c,d))*(d-b) ;};


console.log( interpolieren( 0,200,0,100));
weise
    .transition()
    .delay(100)
    .duration(1000)
    .style("stroke","blue")
    .attr("d","M " + center.x +"," + center.y + " l" + zweipunkte(0,200,0,100)+ ","+ radio*Math.sin(radio) )
    .attr("marker-end","url(#triangel1)")
    ;
