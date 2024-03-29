 //When DOM loaded we attach click event to button
$(document).ready(function() {

	var $data;
	
	//start ajax request
    $.ajax({
        url: "data/stelvio.json",
                            
        success: function(data) {
            console.log("loaded data");
            $data = $.parseJSON(data);
            makeTrack();
        }
    });
	
	/*
	 $.ajax({
      url: "http://www.openstreetmap.org/api/0.6/map?bbox=10.27634,46.38957,10.80162,46.63199",
      dataType: "xml",
      success: function (xml) {
        var layer = new L.OSM.DataLayer(xml).addTo(map);
        map.fitBounds(layer.getBounds());
      }
    });
	*/
	
	 // Create array of lat,lon points
	
	function makeTrack(){
		
		var $track = $data.data.trackData[0];
		var seg_length = 10;
		var $segments = chunk($track, seg_length);
						
		//iterate through segments	
		for( $i = 0; $i < $segments.length; $i++){
		
			var segment = $segments[$i];
							
			var end = seg_length-1;
			
			var distance = 0;
			
			//calculate distance travelled
			
			
			for( $k = 0; $k < seg_length-1; $k++){
				var seg_start = L.latLng(segment[$k].lat, segment[$k].lon);
				var seg_end = L.latLng(segment[$k+1].lat, segment[$k+1].lon);
		
				distance += seg_start.distanceTo(seg_end);
			}
			
			var elevation = segment[end].ele - segment[0].ele;
			 		
			var gradient = Math.round(100* (elevation)/distance);
			
			//console.log("dist: "+distance+"/elevation: "+elevation+"/gradient: "+gradient);
			
		
			var polyline_options;
			
			var hue;
			
			if(gradient >= 0){ //auffi!
				hue = 55 -  (gradient*2);  
			}
			else{ //obi!!
				
				hue = 140 - (gradient*4); 
			}
						
			var t = tinycolor("hsv "+hue+", 100%, 100%");
	       
			
			polyline_options  = { color: t.toHexString()};	
		 		     
		    var polyline = L.polyline(segment, polyline_options).addTo(map);
		    			
			
		}
			 
		 //map.fitBounds(polyline.getBounds());
	}

	function split(a, n) {
	    var len = a.length,out = [], i = 0;
	    while (i < len) {
	        var size = Math.ceil((len - i) / n--);
	        out.push(a.slice(i, i += size));
	    }
	    return out;
	}
	
	function chunk (array, chunkSize) {
	       var retArr = [];
	       for (var i = 0; i < array.length - (chunkSize - 1); i++){
	            retArr.push(array.slice(i, i+chunkSize));
	       }
	       return retArr;
	 }
	
	
	
	
	
	var click = document.getElementById('click');
	var mousemove = document.getElementById('mousemove');
	
	//maxBounds
	//center

	var bl = [46.43502, 10.31342];
	var tr = [46.65226, 10.6691];

	var bounds = { 
			'tl' : [tr[0], bl[1]],
			'tr' : tr,
			'br' : [bl[0],tr[1]],
			'bl' : bl		
	}
	

	var map = L.mapbox.map('map', 'jamesbeat.h85bh9ff');
		
	//map.setView([46.51653, 10.54735], 18);    
	map.setMaxBounds([bounds.bl,bounds.tr]); 
	//map.fitBounds( [bounds.bl,bounds.tr] );
	map.setZoom(5); 
	//map.setMinZoom(map.getBoundsZoom( [[46.38957, 10.27634],[46.63199, 10.80162]], true));
   



	map.on('mousemove click', function(e) {
	    window[e.type].innerHTML = e.containerPoint.toString() + ', ' + e.latlng.toString();
	});
	
		
	var line_points = [	bounds.tl,bounds.tr,bounds.br,bounds.bl,bounds.tl ];
	
	
	var boundaryLine_options = {
      color: '#dedede',      // Stroke color
      opacity: 1,         // Stroke opacity
      weight: 1,         // Stroke weight
    };

	
	var boundaryLine = L.polyline(line_points, boundaryLine_options).addTo(map);
		 
	
});
