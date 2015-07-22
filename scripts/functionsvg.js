function board(width,height,margin, tcks) {

  alert("hola te hablo desde otro mundo")
  alert("Si estas leyendo esto es porque perteneces a otro mundo")
  // alert("Sabe a que planeta perteneces")
  // alert("Te brindaré una pista: hay alas y garritas ")
  // alert("y los siguientes sonidos")
  // alert("ñawwww ñawww ñawww ñawwww ñawww ñawww ñawwww ñawww ñawww")
  //   alert("pio pio pio pio pio pio pio pio pio pio pio pio pio pio pio pio")
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
//Axes
   var xAxis =d3.svg.axis()
      .scale(x)
      .orient("top")
      .tickSize(5)

  //     .tickSize(-Height);
  //
  var yAxis =d3.svg.axis()
      .scale(y)
      .orient("left")
      //.ticks(20)
    //  .tickSize(-Width);

var svg = d3.select("body")
    .append("svg")
      .attr("class","board")
      .attr("width", Width )
      .attr("height", Height )
      .attr("margin",margin)
      .append("g")
      .attr("transform","translate ("+Margin.left+","+Margin.bottom+")")

  var grid=function(height,width,tcks){
  svg.selectAll("line.VerticalGrid")
  .data(x.ticks(tcks))
  .enter().append("line")
  .attr(
    {
      "class":"VerticalGrid",
      "x1": function(d){ return x(d)},
      "y1": 0,
      "x2": function(d){ return x(d)},
      "y2": height,
      "shape-rendering":"crispEdges",
      "stroke": "black",
      "stroke-width": "1px"
  })

  svg.selectAll("line.HorizontalGrid")
  .data(y.ticks(tcks))
  .enter().append("line")
  .attr(
    {
      "class":"HorizontalGrid",
      "x1": 0,
      "y1": function(d){ return y(d)},
      "x2": width,
      "y2": function(d){ return y(d)},
      "shape-rendering":"crispEdges",
      "stroke": "black",
      "stroke-width": "1px"
  })


  };
console.log(svg);

  grid(Height,Width,10  );

      // window.svg.append("rect")
      //     .attr("width", width )
      //     .attr("height", height );

      svg.append("g")
          .attr("class", "x axis")
          //.attr("transform","translate(0,"+height-margin.bottom+")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);


    return [x,y];
}
