function vectore (x0,y0,x1,y1,Width,Height) {


    var x= d3.scale.linear()
        .domain([-Width/2,Width/2])
        .range([0,Width]);

    var y=d3.scale.linear()
        .domain([-Height/2,Height/2])
        .range([Height,0]);

 console.log(d3.select(".board").append("marker"));

 var triangle = d3.select(".board")
      .append("svg:marker")
      .attr("id","selmark")
      .attr("viewBox","0 0 30 20")
      .attr("refX",30)
      .attr("refY",10)
      .attr("markerWidth",8)
      .attr("markerHeight", 15)
      .attr("orient","to")
      .append("svg:path")
        .attr("d","M0,0L30,10L0,20")
        .style("fill","blue")
        .style("stroke-linecap","round")
        .style("stroke-width","5px");

d3.select(".board")
  .append("svg:line")
     .attr("x1", x(x0))
     .attr("y1", y(y0))
     .attr("x2", x(x1))
     .attr("y2", y(y1))
      .style("stroke", "rgb(6,120,155)")
      .style("stroke-width","2px")
      .attr("marker-end","url(#selmark)")
      ;

var tpx= (x0+x1)*0.5,
    tpy= (y0+y1)*0.5;

d3.select(".board")
      .append("text")
        .attr("x",x(tpx))
        .attr("y",y(tpy))
        .style("writing-mode","tb")
        .text("("+ x1 + ","+ y1 + ")")
  ;

//.attr("y", function(d) { return d.y;})
//.interpolate("linear");

// window.svg.append("path")
//   .attr("d","M"+ x0 +" "+y0+"L"+x1+" "+y1)
//   .attr("stroke-width","2px")
//   .attr("stroke","red")
  //.attr("marker-end","url(#triangel)");


  // var triangel=window.svg
  // .append("marker")
  // .attr("id","triangel1")
  // .attr("viewBox"," 0 0 60 40")
  // .attr("refX",0)
  // .attr("refY", 20)
  // .attr("markerWidth",15)
  // .attr("markerHeight",40)
  // .attr("orient","auto")
  // .append("svg:path")

  //
  // .attr("d","M 0,0 L 60,20 L 0,40")
  // .style("fill","blue")
  //     .style("stroke-linecap","round")
  //     .style("stroke","blue")

  console.log("hola pollin")

}

//.attr("id","weise").attr("marker-end","url(#triangel1)")
