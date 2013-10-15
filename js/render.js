function render_svg(csvFile) {
  var colors = ["#6363FF", "#63FFCB","#FBFF63", "#FFB363", "#FF7363", "#FF6364"];
  var types = ["Status", "Photo", "Video"];
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var color = d3.scale.ordinal().range(["#6363FF", "#63FFCB","#FBFF63", "#FFB363", "#FF7363", "#FF6364"]);

  var type = d3.scale.ordinal().range(["Status", "Link", "Like", "Photo", "Video"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(csvFile, function(error, data) {
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Time"; }));
      type.domain(d3.keys(data[0]).filter(function(key) { return key !== "Time"; }));

    data.forEach(function(d) {
      var y0 = 0;
      d.types = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.types[d.types.length - 1].y1;
    });

    x.domain(data.map(function(d) { return d.Time; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");

    var Time = svg.selectAll(".Time")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.Time
     ) + ",0)"; });

    Time.selectAll("rect")
        .data(function(d) { return d.types; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); })
        .attr("class", function(d) {return type(d.name); });

    var svg_new = svg;
    var legend = svg_new.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .on("mouseover", function(d) {
          current = d3.select(this);
          d3.selectAll("rect").style("opacity", 0.3)
          d3.selectAll("."+d)
          .style("opacity", 1);
          current.style("opacity", 1);
        })
        .on("mouseout", function(d) {
          d3.selectAll("rect").style("opacity", 1);

        })
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

    function mouseover(d) {
      svg.selectAll("rect")
          .attr("fill", red);
    }

    function mouseout(d) {
    svg.selectAll("path.link.source-" + d.key)
        .attr("fill", blue);
    }

  });
}