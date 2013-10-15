var colors = ["#6363FF", "#63FFCB", "#FF7363"];
var typesSteph = ["Status", "Photo", "Video"];

function show_populars(JsonSet) {
    // fake data - real: getMostPopular(type)
  // var status = "He is so cute <3";
  console.log("showing populars");
  var status = getMostPopular("statuses", JsonSet);
  var photo = getMostPopular("photos", JsonSet);
  var video = getMostPopular("videos", JsonSet);

  // photo = "http://i.imgur.com/YA6jx3J.png";
  // video = "https://fbcdn-video-a.akamaihd.net/hvideo-ak-ash3/v/867980_10151488114683049_22347748_n.mp4?oh=99665a09b75b87cbb01f31f876cbc271&oe=525CDD19&__gda__=1381868364_e8b8abeb0360870b1fd0017848abe658";
  // status = "he's so nice";

  var args = [status, photo, video];
  
  var i = 0;
  for (var i =0; i<typesSteph.length; i+=1) {
    var t = typesSteph[i];
    show(t, colors[i], args[i]);
  }
}

function show(type, color, arg) {
    add_title(type, color);
    if (type == "Status") {
      show_status(arg);
    } else if (type == "Photo") {
      show_photo(arg);
    } else if (type == "Video") {
      document.write("<br>");
      show_video(arg);
    } else {
      console.log("wrong type");
    }
} 

function add_title(title, color) {
    var newDiv = document.createElement("div");
    if (title == "Video") {
      newDiv.className = "title-video";
    } else {
      newDiv.className = "title";
    };
    newDiv.id = title;
    newDiv.appendChild(document.createTextNode(title));
    document.body.appendChild(newDiv);
    d3.select("#"+title).style("color", color);
}

function show_status(status) {
    var newP = document.createElement("p");
    var text = document.createTextNode(status);
    newP.className = "status";
    // img.width = "300px";
    newP.appendChild(text);
    // // This next line will just add it to the <body> tag
    document.body.appendChild(newP);
}

function show_photo(link) {
    var newDiv = document.createElement("div");
    var img = document.createElement("img");
    img.src = link;
    newDiv.className = "photo";
    newDiv.appendChild(img);
    // // This next line will just add it to the <body> tag
    document.body.appendChild(newDiv);
}

function show_video(link) {
    var newDiv = document.createElement("div");
    newDiv.id = "video_holder";
    var video = document.createElement("video");
    video.controls = "controls";
    video.id = "popular_video";
    video.class = "video";

    var source = document.createElement("source");
    source.src = link;

    video.appendChild(source);
    newDiv.appendChild(video);
    document.body.appendChild(newDiv);
}