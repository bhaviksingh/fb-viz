function update(ty, arg) {
  if (ty == "status") {
    update_status(arg);
  } else if (ty == "photo") {
    update_photo(arg);
  } else if (ty == "video") {
    update_video(arg); 
  };
}

function update_svg() {
  // might be as simple as calling svg.data().enter() again
}

function update_status(status) {
  // how to update
  d3.select(".status").text(status);
}

// function update_link(link) {
//   // how to update
//   d3.select(".link").text(link);
// }

function update_photo(photo) {
  document.querySelector(".photo > img").src = photo;
  $(".photo").load();
  //console.log(d3.select(".photo")); // = photo;
}

function update_video(video) {
  document.querySelector("#popular_video > source").src = video;
  $("#video_holder video").load();
}

