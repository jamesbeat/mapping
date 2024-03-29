window.onload = function () {
	
	var rad = Math.PI*2 / 360;
	
	var $data;
	
	var track; 
	
	var sectors = 42;
	var ring_width = 200;
	var size = 840;
	var ele_steps = 500;
	
	var linecolor = '#334f67';
	
	var length_total = 0;
	var climb_total = 0;
	
	var dist_steps = 10000;
	
	var R = 200
	
	var ele_min;
	var ele_floor;
	
	var ele_max;
	var ele_ceil;
	
	var font = 'Share';
	
	
	
	var upColors = ['#E15F4D',
'#DB5B4C',
'#D5584C',
'#CF554C',
'#C9524C',
'#C34F4B',
'#BE4C4B',
'#B8494B',
'#B2454B',
'#AC424A',
'#A63F4A',
'#A13C4A',
'#9B394A',
'#953649',
'#8F3349',
'#892F49',
'#842C49',
'#7E2948',
'#782648',
'#722348',
'#6C2048',
'#671D48'];
					
	var downColors = ['#98D5E2',
'#95D0DE',
'#92CCDA',
'#8FC8D6',
'#8CC4D2',
'#89C0CE',
'#87BBCA',
'#84B7C7',
'#81B3C3',
'#7EAFBF',
'#7BABBB',
'#79A6B7',
'#76A2B3',
'#739EAF',
'#709AAC',
'#6D96A8',
'#6B91A4',
'#688DA0',
'#65899C',
'#628598',
'#5F8194',
'#5D7D91'];				
	
	
	var r = Raphael("profile", size, size),
	        init = true,
	        param = {stroke: "#fff", "stroke-width": 30},
	        hash = document.location.hash;
	
	var numFont = r.getFont("Share");
			
	
	// LOAD JSON DATA --------------------------------------------------------------------------------------------- 
	
	//start ajax request
    $.ajax({
        url: "data/stelvio_up.json",
                            
        success: function(data) {
            console.log("loaded data");
            $data = $.parseJSON(data);
             
            var trackpoints = $data.data.trackData[0].length; 
            var segmentSize = Math.round(trackpoints / sectors);
                                    
            track = makeTrack($data.data.trackData[0], segmentSize);
					
			console.log(track);
					    
		    var min_max = getMaxMin(track);
		    ele_min = min_max[0]; 
		    ele_max = min_max[1];
			
			
			//get Value ceil / floor
			var floor_ceil = getFloorCeil(ele_min,ele_max,ele_steps);
			ele_floor = floor_ceil[0]; 
			ele_ceil = floor_ceil[1];
			
			
			
			//get km dividers
			var km_floor_ceil = getFloorCeil(0,length_total,10000);
			var km_ceil = km_floor_ceil[1];
								
			
			//var km_angle = 180/
			
			drawDistance(R,R+ring_width, length_total,dist_steps);													
			render_profile(track);
			drawMarks(R,R+ring_width, ele_floor, ele_ceil, ele_steps);
				
			render_track(track);
			
			animate_digits();
        }
    });
	
	
	
	function drawMarks(start_R,end_R, ele_floor, ele_ceil, ele_steps) {
		
		var range = end_R - start_R; 
		
		var lines = (ele_ceil - ele_floor) / ele_steps;
		
		var increment = range/lines;
		
		var marksAttr = {fill: hash || linecolor, stroke: "none", opacity: 0.25}
		
		var total = 90;
		var out = r.set();
		
				 
		for (i = 0; i <= lines; i++ ){
		
			var line_R = start_R + increment * i;
					
						
			
						
			if(i == 0){
				
				var txt = r.text(size/2 - line_R -12, size/2 + 10 , ele_floor).attr({fill: linecolor, stroke: "none", opacity: 0.5, "font-size": 14, 'font-family':font});
				var txt = r.text(size/2 + line_R + 12, size/2 + 10 , ele_floor).attr({fill: linecolor, stroke: "none", opacity: 0.5, "font-size": 14, 'font-family':font});
				
			}
	
			else{
			
				var txt = r.text(size/2 - line_R, size/2 + 10 , ele_floor + ele_steps * i).attr({fill: linecolor, stroke: "none", opacity: 0.5, "font-size": 14, 'font-family':font});
				var txt = r.text(size/2 + line_R, size/2 + 10 , ele_floor + ele_steps * i).attr({fill: linecolor, stroke: "none", opacity: 0.5, "font-size": 14, 'font-family':font});

			
				for (var value = 0; value <= total; value++) {
		            var alpha = 180 / total * value - 90,
		                a = (90 - alpha) * Math.PI / 180,
		                x = size/2 + line_R * Math.cos(a),
		                y = size/2 - line_R * Math.sin(a);
		            out.push(r.circle(x, y, 1).attr(marksAttr));
				}
			}
			
			
		}
		 
	}
	
	function drawDistance(start_R,end_R,dist,seg) {
	
		var out = r.set();
		
		var deg_per_m = 180 / dist;
		
		for(i = 0; i < dist ; i+= seg){
			 
	    
	        var startAngle = -180;
	                
	        var deltaAngle = i * deg_per_m; 
	        console.log('angle:'+deltaAngle);
	        var x1 = Math.round(size/2 + start_R * Math.cos((startAngle + deltaAngle) * rad));
			var y1 = Math.round(size/2 + start_R * Math.sin((startAngle + deltaAngle) * rad));
	        
	        var x2 = Math.round(size/2 + end_R * Math.cos((startAngle + deltaAngle) * rad));
			var y2 = Math.round(size/2 + end_R * Math.sin((startAngle + deltaAngle) * rad));
			
			var xt = Math.round(size/2 + (end_R + 10) * Math.cos((startAngle + deltaAngle) * rad));
			var yt = Math.round(size/2 + (end_R + 10) * Math.sin((startAngle + deltaAngle) * rad));
			
		
			
			if(i == 0){}
			else{ 
				out.push(r.path(["M", x1, y1, "L", x2, y2]).attr({"stroke": linecolor, "stroke-opacity": 0.1, "stroke-width": 1})); 
				
				
				var text = r.text(xt, yt , i / 1000 ).attr({fill: linecolor, stroke: "none", opacity: 0.5, "font-size": 16, 'font-family':font}).transform(["r", 0]);
								
				out.push(text);
							
				
			}
				
		}
				
		
		
	}
	
	function animate_digits(){
		var digit_climb = new countUp("climb", 0, (climb_total/1000), 3, 1);
		digit_climb.start();
		
		var digit_distance = new countUp("distance", 0, length_total/1000, 1, 1);
		digit_distance.start();
	}
		
        
   // RENDER PROFILE ---------------------------------------------------------------------------------------------    
    
   function render_profile(track){ 
        	    
	    r.pieChart(size/2, size/2, R, track, "#fff");
	    
	  
	    //animation
	    $('#profile path').css('opacity',0);
	    
	    var delay = 0;
	    
	    $('#profile path').each(function( index ) {		
	    	
	    	delay += 15;
	      
		  	$(this).delay(delay).animate({
			    opacity: 1			   
			  }, 100, function() {
			    // Animation complete.
			    
			  });
			  
			  
		  
		});
	    
	      
	 }
	 
	 // CHART FUNCTION ---------------------------------------------------------------------------------------------  
	 
	 Raphael.fn.pieChart = function (cx, cy, r, track, stroke) {
	        	    	    
		   var paper = this;
		   var chart = this.set();
		    
		   var angle = -180;
		   var total = track.length;
		   var start = 0;
		    	    
		    // SECTOR ---------------------------------------------------------------------------------------------
	   	    function sector(cx, cy, r, startAngle, endAngle, segment, params) {
		        //console.log(segment);
		        // MAP TRACK POINTS -----------------------------------------------------------------------------------
				segment = mapSegment(segment,ele_floor,ele_ceil,0,ring_width);
		        		        
		       // console.log("sector startAngle:"+startAngle+" / endAngle:"+endAngle);
		        		       
		        var incAngle = (endAngle - startAngle) / (segment.length-1);
		        // console.log("inc:"+incAngle);
		        var deltaAngle = 0;
				
				//console.log(segment);
		        //mapping segment points 
		        var string = "";  
		        
		        for (k = 0; k <= segment.length +1; k++){
		            	           	        
			        daX = Math.round(cx + (r + segment[k]) * Math.cos((startAngle + deltaAngle) * rad));
			        daY = Math.round(cy + (r + segment[k]) * Math.sin((startAngle + deltaAngle) * rad));
			        
			        		        
			        deltaAngle += incAngle;
			        
			        string += " L ,"+daX+", "+daY+", ";
			        		        
		       }
		       //console.log("string:"+string);
		       	      
		       
		        var x1 = cx + r * Math.cos(startAngle * rad),
		            x4 = cx + r * Math.cos(endAngle * rad),
		            y1 = cy + r * Math.sin(startAngle * rad),
		            y4 = cy + r * Math.sin(endAngle * rad);
		              	            
		            																						
		        return paper.path(["M", cx, cy, "M", x1, y1, string,  "L", x4, y4, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x1, y1, "z"]).attr(params);
		    }
		    // SECTOR ---------------------------------------------------------------------------------------------
		   
		    
		    // PROCESS ---------------------------------------------------------------------------------------------
		    function process (j) {
	            var segment = track[j];
	            
	            //console.log(segment);
	            
	            var mappedHigh = mapValue(segment.high, ele_floor, ele_ceil, 0, 200, 0);
	            var mappedLow = mapValue(segment.low, ele_floor, ele_ceil, 0, 200, 0);
	            
	            console.log('mappedHigh:'+mappedHigh+' mappedLow:'+mappedLow);
	            
	            var angleplus = 180 / total;
	            var popangle = angle + (angleplus / 2);
	            
	            if(segment.grad >= 0){ var color = upColors[segment.grad]; }
	            else{		           var color = downColors[Math.abs(segment.grad)];  }
	            
	            
	            var ms = 200;
	            var delta = 120;
	            var bcolor = "#858479";
	           
	            var p = sector(cx, cy, r, angle, angle + angleplus, segment.points, {fill: color, stroke: stroke, "stroke-width": 0});
	            //add id
	            p.node.id = "sector_" + j;
	           
	            var txt = paper.text(cx + (r + delta + 0) * Math.cos(popangle * rad), cy + (r + delta + 0) * Math.sin(popangle * rad), segment.grad+"%").attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 16});
	            
	            var featureLayer;
	            var polyline;
	            
	            p.mouseover(function () {
	                p.stop().animate({transform: "s1.05 1.05 " + cx + " " + cy}, ms, "quad");
	                txt.stop().animate({opacity: 1}, ms, "quad");
	               
	               	                  
	                var highlight_seg = calc_track_segment(track[j]);
					
					console.log(track[j]);
					
					
					polyline = L.polyline(highlight_seg.track, { color:'#849cfb', opacity: 0.75, weight: 8, lineCap: "square"}).addTo(map).bringToBack();										
	                               
	                //.bindPopup(track[j]['dist']+"m / "+track[j]['grad']+"%").openPopup();

	                          
	                
	                var center_point = Math.floor(segment.points.length / 2);
	               	
	               	var center_lat = segment.points[center_point].lat;
	               	var center_lon = segment.points[center_point].lon;
	               	               	
	               	//console.log(segment.points);
	               	map.setView([center_lat, center_lon]);
	                       
	                //console.log(highlight_seg['track']);
	                                   
	                               
	                
	            }).mouseout(function () {
	                p.stop().animate({transform: ""}, ms, "quad");
	                txt.stop().animate({opacity: 0}, ms);
	             	         
								
					map.removeLayer(polyline);
					
	                
	            }).mouseup(function () {
	            	           	
	                              
	               	
	               	var first_lat = segment.points[0].lat;
	               	var first_lon = segment.points[0].lon;
	               	
	               	var last_lat = segment.points[segment.points.length-1].lat;
	               	var last_lon = segment.points[segment.points.length-1].lon;
               	                           
	               map.fitBounds([
						[first_lat, first_lon],
						[last_lat, last_lon]
					]);
					
					
					
	               
	            });
	            
	            angle += angleplus;
	            chart.push(p);
	            chart.push(txt);
	            start += .05;
	            //console.log("total"+total);
	            //console.log("angleplus: "+ angleplus);
		    };
		    	    	   
		    for (i = 0; i < track.length; i++) {
		        process(i);
		    }
		    	    
		    return chart;
	};
	
	        
    
    //get min max values ---------------------------------------------------------------------------------------------
    function getMaxMin(track){
    	
    	var max_ele = 0;
    	var min_ele = 10000;
    	
    	for(i = 0; i < track.length; i++){
	    	
	    	if(track[i].high > max_ele){
	    		max_ele = track[i].high;
			}
			
			if(track[i].low < min_ele){
	    		min_ele = track[i].low;
			}
	    	
    	}
        
        return minmax = [min_ele,max_ele];
    };
    
    function getFloorCeil(min_ele,max_ele,scale){
	   	
	    	    	    
	    //get floor:
		 var floor = Math.floor(min_ele / scale) * scale;
		 
		 //get ceil:  
		 var ceil = Math.ceil(max_ele / scale) * scale;
		 	 
		 return floorceil = [floor,ceil];	
    } 
    
           
    //map elevation to local scale ---------------------------------------------------------------------------------------------
    function mapSegment(segment,min,max,map_min,map_max){
	       
	    var delta = ele_max - ele_min;
	    console.log("delta:"+delta)
	    var mappedArray = [];
	    
	     for (k = 0; k < segment.length; k++){
	                 	 
	      	var mappedValue = mapValue(parseInt(segment[k].ele), min, max, map_min, map_max, 0)
	          	 
		    mappedArray.push(mappedValue);	                      
	    }    
	    //console.log("mapped:");  
		//console.log(mappedArray);  
	    return mappedArray;
	};
     
        
     function mapValue(val, inMin, inMax, outMin, outMax, decimals){
	
		var returnVal;
		// Sets the total range for both in and out
		var inRange = inMax - inMin;
		var outRange = outMax - outMin;
	 
		//makes sure that the value is within range
		val = Math.max(inMin,val);
		val = Math.min(inMax,val);
	 
		//calculates the ratio for the value in relation to the in range
		var ratio = (val - inMin) / inRange;
	 
		//Finds the same ratio in the out range and shift it into place
		returnVal = (outRange * ratio) + outMin;
	 
		//rounding of the decimals
		var factor = Math.pow(10,decimals);
		returnVal = Math.round(returnVal*factor)/factor;
	 
		return returnVal;
	}
     
     
	 // Create array of lat,lon points ------------------------------------------------------------------------------------------
	
	function makeTrack(data, seg_points){
		
		//make track subsegment
		var segments = data.chunk(seg_points);
		
		
		var segmentedTrack = [];
		//console.log('--------- segments.length'+segments.length);							
		//iterate through segments	
		for( i = 0; i < segments.length; i++){ 
			
			//console.log('--------- segment '+i);
						
			var segment = segments[i];
			
			//console.log('...... segment.length'+segment.length);
			
			var distance = 0;
			var elevation = 0;	
			var climb = 0;			
			var peak = 0;	
			var high = 0;
			var low = 10000;		
			//calculate distance travelled
						
			for( k = 0; k < segment.length; k++){
			
				//console.log('point '+k);
			
				var seg_start = L.latLng(segment[k].lat, segment[k].lon);
				var seg_end;
				
				if(k+1 < segment.length){
					seg_end = L.latLng(segment[k+1].lat, segment[k+1].lon);
					climb_delta = segment[k+1].ele - segment[k].ele;
									
				}
				else{
					seg_end = L.latLng(segment[k].lat, segment[k].lon);
					climb_delta = 0;
				}
								
				distance += seg_start.distanceTo(seg_end);
				
				peak_delta = Math.round(100* (climb_delta)/distance);
				
				if(peak_delta >= 0){
					
					if(peak_delta > peak){ peak = peak_delta;}
				}
				else{
					if(peak_delta < peak){ peak = peak_delta;}
				}
				
				if(segment[k].ele > high){ high = segment[k].ele; }
				if(segment[k].ele < low){ low = segment[k].ele; }
							
				climb += climb_delta;
								
			}
									
			var gradient = Math.round(100* (climb)/distance);
			//console.log("dist: "+distance+"/elevation: "+elevation+"/gradient: "+gradient);
			
			var segmentObject = {
			   id: i,
			   dist: Math.round(distance),
			   climb: climb,
			   grad: gradient,
			   peak: peak,
			   high: high,
			   low: low,
			   points : segments[i]
			};
			
			length_total += distance;
			
			if(climb > 0){ climb_total += climb; }
			
			
			//console.log(length_total);
			
			segmentedTrack.push(segmentObject);
					
		}
		
		return segmentedTrack;
				 
	}
	
	


	//MAP 
	
	function render_track(track){
		
		console.log(track);
		
		for( i = 0; i < track.length; i++){
			
			var tracksegment = calc_track_segment(track[i]);
			var polyline = L.polyline(tracksegment.track, { color:tracksegment.color, opacity: tracksegment.opacity, weight: tracksegment.weight}).addTo(map);		
			polyline.id = "segment_" + i;
		}
		
		var lastSeg = track.length-1;
		var lastLatLon = track[lastSeg]['points'].length-1;
		
									
	    var startPoint = L.circle([track[0]['points'][0].lat, track[0]['points'][0].lon], 10).addTo(map);                      
	    var endPoint = L.circle([track[lastSeg]['points'][lastLatLon].lat, track[lastSeg]['points'][lastLatLon].lon], 10).addTo(map);           		
		
	}
	
	
	function calc_track_segment(segment){
		
		if(segment['grad'] >= 0){
				mapcolor = upColors[segment.grad];
			}
			else{
				mapcolor = downColors[Math.abs(segment.grad)];
			}
			polyline_options  = { color:mapcolor,opacity: 1, weight: 2 };	
			
			var chain = [];
			
			for( k = 0; k < segment['points'].length; k++){
										
				var latlon = [segment['points'][k].lat,segment['points'][k].lon];
				chain.push(latlon);
			}
								
			var tracksegment = { track: chain, color: mapcolor, opacity: 1, weight: 2};
			
			return tracksegment;
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





	function split(a, n) {
	    var len = a.length,out = [], i = 0;
	    while (i < len) {
	        var size = Math.ceil((len - i) / n--);
	        out.push(a.slice(i, i += size));
	    }
	    return out;
	}
	
	Array.prototype.split = function(chunkSize) {
	    var array=this;
	    return [].concat.apply([],
	        array.map(function(elem,i) {
	            return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
	        })
	    );
	}
	
	
	Array.prototype.chunk = function( chunkSize ) {
       
       overlap = 1;
       
       var retArr = [];
       
       for (var i = 0; i < this.length - (chunkSize - 1); i+=chunkSize){
          
          var chunkArray = [];
          
          for(var k = 0; k <= chunkSize; k++){
	          
	          chunkArray.push(this[k+i]);
          }
          
          retArr.push(chunkArray);
       }
              
       return retArr;
   }
   
    
    
};
       