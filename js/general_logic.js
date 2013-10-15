function change_input() {
  //get start and end from input
  getData(start, end);
}

function re_render(jsonObject) {
  update_svg();
  var types = ["status", "photo", "video"];
  for (var ty in types) {
    arg = getMostPopular(ty, jsonObject);
    update(ty, arg);
  };
}

function getMostPopular(type, JsonSubset) {
  var popObject = 0;
  var pops = 0;
  var popLikes = 0;
  var popComments = 0;
  for (var time in JsonSubset) {
    var timeSubset = JsonSubset[time];
    var typeData = timeSubset[type];
    for (var i in typeData) {
      var typeObject = typeData[i];
      var object = typeObject.data;
      var popularity = typeObject.likes.length + typeObject.comments.length;
      if ((pops < popularity) || (pops == 0)) {
        pops = popularity;
        popObject = object;
        popComments = typeObject.comments.length;
        popLikes = typeObject.likes.length;
      }
    }
    
  };
  return popObject;
}

var exampleDataset = {
    "january 2010": {
      "status": [
        {
          "data":"he is so cute",
          "likes":["stephanie"],
          "comments":[]
        },
        {
          "data":"she sucks",
          "likes":["bah", "boo"],
          "comments":['stephanie']
        }
      ],
      "photos": [
      ]
  }
}
