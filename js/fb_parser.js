 /* OUR CODE */

  //Date class for objects
  fb_date = function(str_date, constructor) {
    
    var string_date = str_date;
    var string_month;
    var string_year;
    var computer_date;
    var unix_date;

    var MONTH = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var YEARS = ["2006", "2007", "2008","2009","2010","2011","2012","2013"];

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    function initialize() {

      if (typeof(constructor) === "undefined") {
      
         
          str_split = str_date.split(" ");
          if (MONTH.indexOf(str_split[0].trim()) < 0 || YEARS.indexOf(str_split[1].trim()) < 0) {
            console.log("ERROR: Invalid date - " + str_date);
            computer_date = null;
            unix_date = null;
          } else {
            string_month = str_split[0].trim();
            string_year = str_split[1].trim();
            computer_date = new Date(string_year, MONTH.indexOf(string_month), 1);
            unix_date = computer_date.getTime() / 1000;
          }

      } else if (constructor === "unix" || constructor === "date") {

        computer_date = new Date(str_date);
        unix_date = computer_date.getTime() / 1000;
        string_month = MONTH[computer_date.getMonth()];
        string_year = computer_date.getFullYear();
        string_date = string_month + " " + string_year;

      } else {
        console.log("ERROR: INVALID DATE constructor");
      }
    
    }

    function isValidDate(date) {
      var month = date.split(" ")[0];
      var year = date.split(" ")[1];

      if (MONTH.indexOf(month)< 0 || YEARS.indexOf(year) < 0){
        return false;
      } else {
        return true;
      }
    }
    this.string_date = function() {
      return string_date;
    } 

    this.computer_date = function(){
      return computer_date;
    }

    this.unix_date = function() {
      return unix_date;
    }

    this.get_dates = function(start_date, end_date) {

      if (!isValidDate(start_date) || !isValidDate(end_date)){ 
        console.log("ERROR: INVALID DATE" + start_date + " " + end_date);
      }

      var date_list = [];

      var month = start_date.split(" ")[0];
      var year = start_date.split(" ")[1];
      var current_date = start_date;

      while (current_date !== end_date) {
        
        date_list.push(current_date);
        
        if (month == "DEC") {
          month = "JAN";
          year = YEARS[YEARS.indexOf(current_date.split(" ")[1]) +1];
        } else {
          year = year;
          month = MONTH[MONTH.indexOf(current_date.split(" ")[0]) + 1]
        }

        current_date = month + " " + year;

      }
      date_list.push(end_date);
      return date_list;

    }

    initialize();

  }

  var DEFAULT_TIMESTAMP = "1262325600"; //1st jan 2010
  var user = {};

  /* GET FUNCTIONS */
 

  function fb_API(request,callback) {
    //console.log("Request" + request);
    FB.api(request, function(data) {
      callback(data);
    });
  }
  var first_date = new fb_date("JAN 2006");
  var all_info = {};
  
  var types = ["statuses", "photos", "videos"];
  var type_counter = 0;

  function getAll() {
    var req = "/me/" + types[type_counter] + "?since=" + first_date.unix_date();
    console.log("Starting to get: " + req)
    getNext(req);
  }

  function getNext(next_status) {
    //console.log("fb api " + type)
    fb_API(next_status, dataReceiver);
  }

  function getTimeFromPost(post) {
    if (post.created_time) {
      return post.created_time;
    } else if (post.updated_time) {
      return post.updated_time
    } else {
      console.log("ERROR: NO TIME FOR POST "+ post);
    }
  }

  function dataReceiver(response) {
    //console.log("Received response with " + response.data.length);
    //console.log(response);
    for (var i=0; i< response.data.length; i++){
      //data_list.push(response.data[i]);
      //Check post time
      var post = response.data[i];
      var post_time = new fb_date(getTimeFromPost(post), "date");
      var type = types[type_counter];

      //If that post time is actually created then just push it
      if (post_time.string_date() in all_info) {
        all_info[post_time.string_date()][type].push(post);
      } else {

        //Else if its the first time you're seeing that time, then set up the skeletons and push to it
        all_info[post_time.string_date()]  = {};
        for (var i =0; i<types.length; i++) {
          var type = types[i];
          all_info[post_time.string_date()][type] = [post];
        }
      }

    }

    if (response.paging === undefined) {
      //Done!
      console.log("Done: " + types[type_counter]);
      type_counter = type_counter + 1;
      
      if (type_counter == types.length) {
        console.log("Finished all!")
        console.log(all_info);
        return;
      } else {
        getAll();
        return;
      }

    } else {
      if (typeof(response.paging.next) === "undefined"){
        console.log(response);
      }
      getNext(response.paging.next);
    }
  }
 
function getData(start_date, end_date) {
    if (type_counter != types.length) {
      console.log("ERROR: NOT FINISHED GETTING DATA YET");
      return;
    }

    var date_list = first_date.get_dates(start_date, end_date);
    var subset = {};
    for (var i=0; i<date_list.length; i++){
      subset[date_list[i]] = all_info[date_list[i]];
    }
    return subset;
}
  