
var startSlider = function(start, end, default_start, default_end, slider_callback){
	
	var temp_date = new fb_date(0, "unix");

	var valMap = temp_date.get_dates(start, end);
	var start_value = valMap.indexOf(default_start);
	var end_value = valMap.indexOf(default_end);

	function showLabel(event,ui){
	  	var curValue = valMap[ui.value];
	 	var target = ui.handle;                                     
	    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
	    $(target).html(tooltip);
	};

	$("#slider-range").slider({
		range: true,
	    min: 0,
	    max: valMap.length - 1,
	    values: [start_value, end_value],
	    slide: function(event, ui) {      
	    	showLabel(event, ui);   

	    	var val_left = valMap[ui.values[0]];
	    	var val_right = valMap[ui.values[1]];
	    	
	        $("#slider_amount").html("Viewing data between:" +  val_left + ' - ' + val_right);   
	        
	        if (typeof(slider_callback) !== "undefined") {
	        	slider_callback(val_left, val_right);
	        }

	    }, create: function(event, ui) {
	    	var handles = $("#slider-range .ui-slider-handle");
	    	$(handles[0]).html('<div class="tooltip"><div class="tooltip-inner">' + valMap[start_value] + '</div><div class="tooltip-arrow"></div></div>');
	    	$(handles[1]).html('<div class="tooltip"><div class="tooltip-inner">' + valMap[end_value] + '</div><div class="tooltip-arrow"></div></div>')
	    	$("#slider_amount").html( valMap[start_value] + ' - ' + valMap[end_value]);   
	    }
	});


	$("#amount").val(valMap[$("#slider-range").slider("values", 0)] + ' - ' + valMap[$("#slider-range").slider("values", 1)]);

	var increment = 100 / valMap.length;
	for (var i=0; i< valMap.length; i++) {
		var html = "<div class=\"ui-slider-label-ticks\" style=\"left:" + i*increment + "%\">" + valMap[i].split(" ")[0].substring(0,1) +  "</div>";
		$("#slider-ticks").append(html);
	}

};