var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var	a=1,
	b= 2,
	c= .2;
var d=(c+1)*0.5;
var datatang=[];
var datacurv=[];

var paso=0.1;

var param=function(d){
	return (c+(1-c)/(1+Math.exp(-a*(d-b))))	;
};
var pendiente= function(d){
	return -(param(b)-param(b+paso))/paso;
}

console.log(pendiente(2));

var pend=(c+(1-c)/(1+Math.exp(-a*(1.9-b))))
console.log((0.6-(c+(1-c)/(1+Math.exp(-a*(1.9-b)))))/(0.1));

var datatang = d3.range(-60,60,0.2).map(function(i) {
  return {x: i  , y: (pendiente(b)*i)-(pendiente(b)*b)+0.6}
});

// for ( var k=0; k<100; k++){
// 	datatang.push( 0.1*k*a - a*b + c)
// }

var data = d3.range(-60,60,0.2).map(function(i) {
  return {x: i  , y: c+(1-c)/(1+Math.exp(-a*(i-b)))};
});
//(1-c)/(1+Math.exp(-a*(0.1*k-b)))
console.log(datatang[0]);

for ( var k=-50; k<50; k++){
	var num=1-c
	var den=1+Math.exp(-a*(0.1*k-b))
	datacurv.push( c+num/den )
}

console.log(datacurv);

var x = d3.scale.linear()
	.domain([-4,4])
    .range([0, width]);

var y = d3.scale.linear()
	.domain([0,1])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(-height)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(10)
    .orient("left");

//var circles=d3.svg.circle;

var container=d3.select("body")
		.append("svg")
		.attr("width",width+ margin.left+ margin.right)
		.attr("height",height+margin.top + margin.bottom)
		.append("g")
			.attr("class","zona")
			.attr("transform","translate("+margin.left+","+margin.top+")");

container.append("g")
	.attr("class","xaxis")
	.attr("transform","translate ("+ (margin.left)+","+(height-margin.bottom)+")")
	.call(xAxis);

container.append("g")
	.attr("class","yaxis")
	.attr("transform","translate ("+(margin.left)+",0)")
	.call(yAxis);

container.append("g")
	.append("svg:circle")
	.attr("cx",x(b) )
	.attr("cy", y(param(b)) )
	.attr("r",4)
	.style("fill","red");

container.append("g")
	.append("svg:path")
	.attr("d","m"+ b +" 0 l "+b+" "+param(b)+" ")
	.attr("stroke-width",2);

console.log( container.select(".zona").append("circle").attr("cx",b).attr("cy",param(b)));


var lineas=d3.svg.line()
	.x(function(d,i){
		//console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
		return x(d.x);
	})
	.y(function(d,i){
		//console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
		return y(d.y);});

var curve=d3.svg.line()
		.interpolate("linear")
		.x(function(d,i){
			//console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
			return x(d.x);
		})
		.y(function(d,i){
			//console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
			return y(d.y);
		});


console.log(curve);
container.append("svg:path")
		.attr("d",lineas(datatang));

container.append("svg:path")
		.attr("d",curve(data));
			/*function(){ 
			var x1= d.b-100
			var y1= -199+d.c
			var x2= d.b+100
			var y2= 201+d.c
			return"M"+x1+","+y1+" L "+x2+","+y2+" ";*/
		