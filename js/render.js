function render_svg(jsonObject) {
  var max_likes = 0;
  var max_comments = 0;
  var colors = {"status": "#6363FF", "photo" : "#63FFCB", "video": "#FF7363"};
  var mapSteph = {"statuses":"message", "videos":"source", "photos":"source"};
  

  var w = 900,
  h = 450,
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

  function translate(jsonObject) {
    var ts = {"statuses": "status", "photos": "photo", "videos": "video"};
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
            if (info.likes) {
              likes = info.likes.summary.total_count;
              if(likes > max_likes) {
                max_likes = likes;
              };
              comments = 0;
            };
          };
          if (info.comments) {
            if (info.comments) {
              comments = info.comments.summary.total_count;
              if(comments > max_comments) {
                max_comments = comments;
              };
              if(likes == -1) {
                likes = 0;
              };             
            };
          };
          var obj = info[mapSteph[j]];

          if(likes != -1) {
            var v = {};
            v[t] = {};
            v[t].obj = obj;
            v[t].likes = likes;
            v[t].comments = comments;
            jsonArray.push(v);  
          };
        };
        
      };
      
    };
    console.log(jsonArray);
    return jsonArray;
  };

  function roundToFive(n) {
    if (n%5 == 0) {
      return n;
    } else {
      return roundToFive(n+=1);
    }
  };

  // circles 

  function first(obj) {
    for (var a in obj) return a;
  }
  
  jsonArray = translate(jsonObject);
  console.log(max_comments);
  console.log(max_likes);
  max_likes = roundToFive(max_likes);
  max_comments = roundToFive(max_comments);

  // axis
  var x = d3.scale.linear().domain([0, max_likes]).range([left_pad, w-pad]);
  var y = d3.scale.linear().domain([max_comments, 0]).range([pad, h-pad*2]);

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

  //y = d3.scale.linear().domain([0, max_comments]).range([pad, h-pad*2]);

  function isIn(wd, arrValues) {
    if (arrValues.indexOf(wd) > -1) {return true;}
    else {return false;}
  };

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span>" + d[first(d)]["obj"] + "</span>";
    });

  svg.call(tip);

  svg.selectAll("circle")
      .data(jsonArray)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", function (d) { return x(d[first(d)]["likes"]); })
      .attr("cy", function (d) { return y(d[first(d)]["comments"]); }) 
      .attr("r", function (d) { return 5; })
      .style("opacity", 0.7)
      .attr("class", function(d) {return first(d); })
      .style("fill", function(d) { return colors[first(d)]} )
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  d3.selectAll(".loading").remove(); 

  svg.append("text")      // text label for the x axis
        .attr("x", w/2 )
        .attr("y",  h )
        .style("text-anchor", "middle")
        .text("Likes");

  var svg_new = d3.select("#legend_div")
          .append("svg")
          .attr("width", w)
          .attr("height", 100);

  // var legend_div = d3.select("#legend_div");
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

  max_comments = 0;
  max_likes =0;
}

function re_render(jsonObject) {
  var types = ["statuses", "photos", "videos"];
  var typs = ["status", "photo", "video"];
  for (var ty in types) {
    arg = getMostPopular(types[ty], jsonObject);
    update(typs[ty], arg);
  };
}

function re_render_svg(jsonObject) {
  d3.select("svg").remove();
  d3.select("svg").remove();
  re_render(jsonObject);
  render_svg(jsonObject);
}
