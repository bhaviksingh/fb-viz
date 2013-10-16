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
    $("#most_popular").append(show(t, colors[i], args[i]));
  }
}

function show(type, color, arg) {
    var encase = document.createElement("div");
    $(encase).addClass('popular');
    var title_div = add_title(type, color);
    $(encase).append(title_div);

    var content_div;
    if (type == "Status") {
      $(encase).addClass("status");
      content_div = show_status(arg);
    } else if (type == "Photo") {
      $(encase).addClass("photo");
      content_div = show_photo(arg);
    } else if (type == "Video") {
      $(encase).addClass("video");
      content_div = show_video(arg);
    } else {
      console.log("wrong type");
    }
    $(encase).append(content_div);
    return encase;
} 

function add_title(title, color) {
    var newDiv = document.createElement("div");
    newDiv.className = "title";
    newDiv.appendChild(document.createTextNode(title));
    d3.select("#"+title).style("color", color);
    return newDiv;
}

function show_status(status) {
    var newP = document.createElement("div");
    var text = document.createTextNode(status);
    newP.id = "popular_status";
    newP.className = "popular_content";
    // img.width = "300px";
    newP.appendChild(text);
    // // This next line will just add it to the <body> tag
    return newP;
}

function show_photo(link) {
    var newDiv = document.createElement("div");
    var img = document.createElement("img");
    img.src = link;
    img.id = "popular_img";
    newDiv.className = "popular_content";
    newDiv.appendChild(img);
    // // This next line will just add it to the <body> tag
    return newDiv;
}

function show_video(link) {
    var newDiv = document.createElement("div");
    newDiv.id = "video_holder";
    newDiv.className = "popular_content";
    var video = document.createElement("video");
    video.controls = "controls";
    video.id = "popular_video";
    video.class = "video";

    var source = document.createElement("source");
    source.src = link;

    video.appendChild(source);
    newDiv.appendChild(video);
    return newDiv;
}