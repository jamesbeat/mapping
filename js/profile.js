window.onload = function () {
	
	var $data;
	var sectors = 72;
	var ring_width = 100;
	var size = 840;
	var R = 200
	var all_min;
	var all_max;
	
	var upColors = ["#aeb09d",
					"#a1a676",
					"#afb671",
					"#d8c91f",
					"#ffe65d",
					"#ffc926",
					"#ff9b3a",
					"#ff7e01",
					"#ff6d01",
					"#ff5400",
					"#d24500",
					"#c22e00",
					"#9e2500",
					"#840303",
					"#5b1500",
					"#5b1500",
					"#000000",
					"#000000",
					"#000000",	
					"#000000",
					"#000000",
					"#000000",
					"#000000",
					"#000000",
					"#000000",
					"#000000",
					"#000000",
					"#000000"];
					
	var downColors = ["#aeb09d",
					"#b0b8b9",
					"#a3b0b2",
					"#8fa9af",
					"#769ca5",
					"#618b9f",
					"#487e98",
					"#397592",
					"#296480",
					"#175775",
					"#175775",
					"#175775",
					"#175775",
					"#175775",
					"#175775",
					"#175775",
					"#175775",
					"#ff00c6",
					"#ff00c6",	
					"#ff00c6"];				
	
	
	var r = Raphael("profile", size, size),
	        init = true,
	        param = {stroke: "#fff", "stroke-width": 30},
	        hash = document.location.hash,
	        marksAttr = {fill: hash || "#a7a6a2", stroke: "none"};

	
	// LOAD JSON DATA --------------------------------------------------------------------------------------------- 
	
	//start ajax request
    $.ajax({
        url: "data/stelvio_mortirolo.json",
                            
        success: function(data) {
            console.log("loaded data");
            $data = $.parseJSON(data);
             
            var trackpoints = $data.data.trackData[0].length; 
            var segmentSize = Math.round(trackpoints / sectors);
                                    
            var track = makeTrack($data.data.trackData[0], segmentSize);
			
			//console.log(track);
					    
		    var min_max = getMaxMin(track);
		    all_min = min_max[0]; 
		    all_max = min_max[1];
			
			
			
			
			drawMarks(R, 60);
		    drawMarks(R+40, 80);
		    drawMarks(R+80, 100);
		    drawMarks(R+120, 140);
							
			render_profile(track);
			
			
        }
    });
	
	
	
	function drawMarks(R, total) {
		        
	     var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
	         out = r.set();
        for (var value = 0; value < total; value++) {
            var alpha = 180 / total * value - 90,
                a = (90 - alpha) * Math.PI / 180,
                x = size/2 + R * Math.cos(a),
                y = size/2 - R * Math.sin(a);
            out.push(r.circle(x, y, 1).attr(marksAttr));
        }
        return out;
    }
	
        
   // RENDER PROFILE ---------------------------------------------------------------------------------------------    
    
   function render_profile(track){ 
        	    
	    r.pieChart(size/2, size/2, 200, track, "#fff");
	    
	  
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
		   var rad = Math.PI*2 / 360;
		   var chart = this.set();
		    
		   var angle = -180;
		   var total = track.length;
		   var start = 0;
		    
		    
		
		    		    
		    
		    // SECTOR ---------------------------------------------------------------------------------------------
	   	    function sector(cx, cy, r, startAngle, endAngle, segment, params) {
		        //console.log(segment);
		        // MAP TRACK POINTS -----------------------------------------------------------------------------------
				segment = mapSegment(segment,all_min,all_max,0,ring_width);
		        		        
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
		            x2 = cx + (r + 20) * Math.cos(startAngle * rad),
		            x3 = cx + (r + 20) * Math.cos(endAngle * rad),
		            x4 = cx + r * Math.cos(endAngle * rad),
		            y1 = cy + r * Math.sin(startAngle * rad),
		            y2 = cy + (r + 20) * Math.sin(startAngle * rad),
		            y3 = cy + (r + 20) * Math.sin(endAngle * rad),
		            y4 = cy + r * Math.sin(endAngle * rad);
		              	            
		            																						
		        return paper.path(["M", cx, cy, "M", x1, y1, string,  "L", x4, y4, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x1, y1, "z"]).attr(params);
		    }
		    // SECTOR ---------------------------------------------------------------------------------------------
		   
		    
		    // PROCESS ---------------------------------------------------------------------------------------------
		    function process (j) {
	            var segment = track[j];
	            
	            console.log(segment);
	            
	            var angleplus = 180 / total;
	            var popangle = angle + (angleplus / 2);
	            
	            if(segment.grad >= 0){ var color = upColors[segment.grad]; }
	            else{		           var color = downColors[Math.abs(segment.grad)];  }
	            
	            
	            var ms = 200;
	            var delta = 100;
	            var bcolor = "#858479";
	           
	            var p = sector(cx, cy, r, angle, angle + angleplus, segment.points, {fill: color, stroke: stroke, "stroke-width": 0});
	           
	            var txt = paper.text(cx + (r + delta + 55) * Math.cos(popangle * rad), cy + (r + delta + 25) * Math.sin(popangle * rad), segment.grad+"/"+segment.peak).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 16});
	            
	            p.mouseover(function () {
	                p.stop().animate({transform: "s1.05 1.05 " + cx + " " + cy}, ms, "quad");
	                txt.stop().animate({opacity: 1}, ms, "quad");
	            }).mouseout(function () {
	                p.stop().animate({transform: ""}, ms, "quad");
	                txt.stop().animate({opacity: 0}, ms);
	            });
	            
	            angle += angleplus;
	            chart.push(p);
	            chart.push(txt);
	            start += .05;
	            console.log("total"+total);
	            console.log("angleplus: "+ angleplus);
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
           
    //map elevation to local scale ---------------------------------------------------------------------------------------------
    function mapSegment(segment,all_min,all_max,map_min,map_max){
	    
	    console.log("mapping segments from min:"+all_min+"->"+map_min+" and max:"+all_max+"->"+map_max);
	    
	    var delta = all_max - all_min;
	    console.log("delta:"+delta)
	    var mappedArray = [];
	    
	     for (k = 0; k < segment.length; k++){
	           
	      	 var mappedValue = (parseInt(segment[k].ele) - all_min) / delta * map_max;
		         mappedArray.push(mappedValue);	                      
	    }    
	    //console.log("mapped:");  
		//console.log(mappedArray);  
	    return mappedArray;
	};
     
	 // Create array of lat,lon points ------------------------------------------------------------------------------------------
	
	function makeTrack(data, seg_points){
		
		//make track subsegment
		var segments = data.chunk(seg_points);
		
		
		var segmentedTrack = [];
		console.log('--------- segments.length'+segments.length);							
		//iterate through segments	
		for( i = 0; i < segments.length; i++){ 
			
			console.log('--------- segment '+i);
						
			var segment = segments[i];
			
			console.log('...... segment.length'+segment.length);
			
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
			
			segmentedTrack.push(segmentObject);
					
		}
		
		return segmentedTrack;
				 
	}
	
	

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
       