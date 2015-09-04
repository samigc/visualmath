/*Radar Graph
  -Data: Trazos latentes theta en [-3,3] por cada habilidad,
  -Tipo de data: JSON
  -Dibujar ejes dependiendo de los datos
  *Colocar los datos agrupados http://bl.ocks.org/enjalot/1425402
  -Ubicar en cada eje un theta
  -Dibujar el polígono
  -Representar el área

  https://www.blogger.com/blogin.g?blogspotURL=http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html
  */

var n=5;

var data ={
  theta: [(Math.random()*3)*Math.pow(-1,Math.floor(Math.random()*10))]
};

 for (i = 0; i<n; i++) {
   data.theta.push((Math.random()*3)*Math.pow(-1,Math.floor(Math.random()*10)));
 }
/*
***************Rearranging a Json file from other*******************+

function RandomData() {
data.map(function(d,i){
  return {
    theta: d.theta.map( function(theta) {
      return {
        theta: (Math.random()*3)*Math.pow(-1,Math.floor(Math.random()*10))
      }
    })
  }
})
};*/
console.log(data.theta);

var width = 700, height = 700, margin = 50;

var Margin = {top: margin, right: margin, bottom: margin, left: margin},
    Width = width - Margin.left - Margin.right,
    Height = height - Margin.top - Margin.bottom;

// Scales
var x= d3.scale.linear()
    .domain([-Width/2,Width/2])
    .range([0,Width]);

var y=d3.scale.linear()
    .domain([-Height/2,Height/2])
    .range([Height,0]);
//svg
