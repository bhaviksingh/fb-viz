function change_input() {
  //get start and end from input
  getData(start, end);
}

function re_render(jsonObject) {
  update_svg();
  var types = ["statuses", "photos", "videos"];
  var typs = ["status", "photo", "video"];
  for (var ty in types) {
    arg = getMostPopular(types[ty], jsonObject);
    update(typs[ty], arg);
  };
}

function getMostPopular(type, JsonSubset) {
  var popObject = 0;
  var pops = 0;
  var popLikes = 0;
  var popComments = 0;
  var mapSteph = {"statuses":"message", "videos":"url", "photos":"url"};
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
        popularity += typeObject.likes.data.length; 
      }; 
      if (typeObject.comments) {
        popularity += typeObject.comments.data.length;
      };
      if ((pops < popularity) || (pops == 0)) {
        pops = popularity;
        popObject = object;
      }
    }
    
  };
  return popObject;
}