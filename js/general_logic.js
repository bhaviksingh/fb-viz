function change_input() {
  //get start and end from input
  getData(start, end);
}

function getMostPopular(type, JsonSubset) {
  var popObject = "None to display";
  var pops = 0;
  var popLikes = 0;
  var popComments = 0;
  var mapSteph = {"statuses":"message", "videos":"source", "photos":"source"};
  var data = mapSteph[type];
  for (var time in JsonSubset) {
    var timeSubset = JsonSubset[time];
    if(!timeSubset) {
      continue;
    };
    var typeData = timeSubset[type];
    for (var i in typeData) {
      var typeObject = typeData[i];
      var object = typeObject[data];
      var popularity = 0;
      if (typeObject.likes) {
        popularity += typeObject.likes.summary.total_count; 
      }; 
      if (typeObject.comments) {
        popularity += typeObject.comments.summary.total_count;
      };
      if ((pops < popularity) || (pops == 0)) {
        pops = popularity;
        popObject = object;
      }
    }
    
  };
  console.log(popObject);
  return popObject;
}