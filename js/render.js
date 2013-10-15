function render_svg(jsonObject, max_likes, max_comments) {

  var colors = {"status": "#6363FF", "photo" : "#63FFCB", "video": "#FF7363"};

  var w = 700,
  h = 300,
  pad = 20,
  left_pad = 100

  var svg = d3.select("#punchcard")
          .append("svg")
          .attr("width", w)
          .attr("height", h);
   
  svg.append("text")
      .attr("class", "loading")
      .text("Loading ...")
      .attr("x", function () { return w/2; })
      .attr("y", function () { return h/2-5; });

  // var svg = d3.select('svg');
  // var colors = {"status": "#6363FF", "photo" : "#63FFCB", "video": "#FF7363"};

  // var w = 700,
  // h = 300,
  // pad = 20,
  // left_pad = 100

  // axis
  var x = d3.scale.linear().domain([0, max_likes]).range([left_pad, w-pad]),
      y = d3.scale.linear().domain([max_comments, 0]).range([pad, h-pad*2]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(5);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0, "+(h-pad)+")")
  .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+(left_pad-pad)+", 0)")
      .call(yAxis);

  y = d3.scale.linear().domain([0, max_comments]).range([pad, h-pad*2]);

  function translate(jsonObject) {
    var jsonArray = [];
    // for (var i in jsonObject) {

    // }
  };

  // circles 

  function first(obj) {
    for (var a in obj) return a;
  }

  jsonArray = translate(jsonObject);
  jsonArray =  [{
    "status" : {
      "likes" : 5,
      "comments" : 10
    }
  }]
  svg.selectAll("circle")
      .data(jsonArray)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", function (d) { return x(d[first(d)]["likes"]); })
      .attr("cy", function (d) { return y(d[first(d)]["comments"]); }) 
      .transition()
      .duration(800)
      .attr("r", function (d) { return 5; })
      .style("fill", function(d) { return colors[first(d)]} );

  d3.selectAll(".loading").remove();   
}
