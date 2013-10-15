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

  // y = d3.scale.linear().domain([0, max_comments]).range([pad, h-pad*2]);

  function isIn(wd, arrValues) {
    if (arrValues.indexOf(wd) > -1) {return true;}
    else {return false;}
  };

  function translate(jsonObject) {
    var ts = {"statuses": "status", "photos": "photo", "videos": "photo"};
    var jsonArray = [];
    var ids = [];
    for (var i in jsonObject) {
      var monthData = jsonObject[i];
      for (var j in monthData) {
        var typeData = monthData[j];
        var t = ts[j];
        
        for (var m in typeData) {
          var likes = -1;
          var comments = -1;
          var info = typeData[m];
          if (info.id) {
            if(!isIn(info.id, ids)) {
              ids.push(info.id);
            } else {
              continue;
            };
          };
          if (info.likes) {
            if (info.likes.data) {
              likes = info.likes.data.length;
              comments = 0;
            };
          };
          if (info.comments) {
            if (info.comments.data) {
              comments = info.comments.data.length;
              if(likes == -1) {
                likes = 0;
              };             
            };
          };

          if(likes != -1) {
            var txt = "{'" + t + "' : { 'likes': " + likes + ", 'comments': " + comments + '}}';
            var obj = eval ("(" + txt + ")");
            jsonArray.push(obj);  
          };
        };
        
      };
      
    };
    return jsonArray;
  };

  // circles 

  function first(obj) {
    for (var a in obj) return a;
  }

  jsonArray = translate(jsonObject);

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
      .style("opacity", 0.7)
      .attr("class", function(d) {return first(d); })
      .style("fill", function(d) { return colors[first(d)]} );

  d3.selectAll(".loading").remove();   
  var svg_new = d3.select("svg");
  var colorSteph = d3.scale.ordinal().range(["#6363FF", "#63FFCB", "#FF7363"]);
  
  var colorS = ["#6363FF", "#63FFCB", "#FF7363"];
  
  var legend = svg_new.selectAll(".legend")
      .data(["Status", "Photo", "Video"])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
  legend.append("circle")
      .attr("cx", 5)
      .attr("cy", 20)
      .attr("r", 5)
      .style("opacity", 0.8)     
      .on("mouseover", function(d) {
        current = d3.select(this);
        d3.selectAll("circle").style("opacity", 0.2)
        d3.selectAll("."+d.toLowerCase()).style("opacity", 0.8);
        current.style("opacity", 0.8);
      })
      .on("mouseout", function(d) {
        d3.selectAll("circle").style("opacity", 0.8);
      })
      .style("fill", colorSteph);

  legend.append("text")
      .attr("x", 45)
      .attr("y", 20)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
}

function re_render_svg(jsonObject, max_likes, max_comments) {
  d3.select("svg").remove();
  render_svg(jsonObject, max_likes, max_comments);
}
