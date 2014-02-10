<?php 
/* ======================================================== */
/* WEATHER FORECAST */
/* ======================================================== */

//check if there is a fresh weather forecast:
if (isset($_SESSION['weather_stamp'])) {

	//check if is no older than 30min
	
	$currentTime = time();
	$sessiontime = $_SESSION['weather_stamp'];
	$delta = strtotime("-30 minutes");
	
	if ($_SESSION['weather_stamp'] <= $delta) {
		
		getweather();
		$_SESSION['weather_stamp'] = $currentTime;
	    
	}
	else {
			   
	}
  
}
else {
 
  $_SESSION['weather_stamp'] = time();
  getweather();
}


function getweather(){

	
	$path_to_file = 'http://api.openweathermap.org/data/2.5/forecast?q=Oberammergau,de&mode=json';
	$weather = parse_json($path_to_file); 
	
	$_SESSION['conditions'] = $weather['list'][0]['weather'][0]['id'];
	$_SESSION['description'] = $weather['list'][0]['weather'][0]['description'];
	$_SESSION['klevin'] = $weather['list'][0]['main']['temp'];
	$_SESSION['celsius'] = round( $_SESSION['klevin'] - 273.15);
	$_SESSION['fahrenheit'] = round($_SESSION['celsius']*1.8+32);
	$_SESSION['pod'] = $weather['list'][0]['sys']['pod'];
	
}
 
function render_weather_single(){
		
	$string = "";
	$string .= '<div class="weather_widget">';
	$string .= '<table>';
		$string .= '<tr><th colspan="2">Local Time</th><th colspan="3">Local Weather</th></tr>';
		$string .= '<tr><td class="digit">'.date('h:i').'<span class="unit">'.date('A').'</span></td>';
			$string .= '<td class="spacer"></td>';
			$string .= '<td class="weather_icon"><span class="icon weather_'.$_SESSION['conditions'].' pod_'.$_SESSION['pod'].'"></span></td>';
			$string .= '<td class="weather_temp"><span class="digit">'.$_SESSION['celsius'].'</span><span class="unit">&deg;C</span></td>	';
			$string .= '<td class="weather_temp"><span class="separator">/</span></td>			';
			$string .= '<td class="weather_temp"><span class="digit">'.$_SESSION['fahrenheit'].'</span><span class="unit">&deg;F</span></td>';
		$string .= '</tr>';
	$string .= '</table>';
	$string .= '</div>';
	
	return $string;
} 

function render_weather_detail(){
	
	$path_to_file = 'http://api.openweathermap.org/data/2.5/forecast?q=Oberammergau,de&mode=json';
	$weather = parse_json($path_to_file); 
	
	/*
	print  '<pre>';
	print_r($weather);
	print  '</pre>';
	*/

	$string = "";

	for($i=0; $i <= 6; $i+=2){
		
		$conditions = $weather['list'][$i]['weather'][0]['id'];
		$description = $weather['list'][$i]['weather'][0]['description'];
		$date = $weather['list'][$i]['dt'];
		$temp = $weather['list'][$i]['main']['temp'];
		$temp_min = $weather['list'][$i]['main']['temp_min'];
		$temp_max = $weather['list'][$i]['main']['temp_max'];
		$pod = $weather['list'][$i]['sys']['pod'];           
		
		//if is from today
		
		
		
	
			$string .= '<div class="weather_box big pod_'.$pod.'">';
				
				$string .= '<table>';
				if($i == 0){$string .= '<tr><th colspan="2">Now</th></tr>';}
				else{ $string .= '<tr><th colspan="2">'.date('h:00 A',$date).'</th></tr>';}
										
				$string .= '<tr><td colspan="2" class="weather_icon"><span class="icon weather_'.$conditions.' pod_'.$pod.'"></span></td></tr>';
					$string .= '<tr><td class="weather_desc" colspan="2">'.$description.'</td></tr>';
					
					
					$string .= '<tr><td><table>';
															
						$string .= '<tr>';
						$string .= '<td class="weather_temp"><span class="digit">'.k_to_c($temp).'</span><span class="unit">&deg;C</span> / <span class="digit">'.k_to_f($temp).'</span><span class="unit">&deg;F</span></td>	';
						$string .= '</tr>';
		
					
					$string .= '</table></td></tr>';
									
					
				$string .= '</table>';
			
			
			
			$string .= '</div>';
		

		
	}

	
		
	
		
			
	return $string;
} 
 
 
function render_weather_multi($days=4){
	
	$path_to_file = 'http://api.openweathermap.org/data/2.5/forecast?q=Oberammergau,de&mode=json';
	$weather = parse_json($path_to_file); 
	
	/*
	print  '<pre>';
	print_r($weather);
	print  '</pre>';
	*/

	$string = "";
	
	for($i = 8; $i <= $days*8; $i+=8){
	
		$conditions = $weather['list'][$i]['weather'][0]['id'];
		$description = $weather['list'][$i]['weather'][0]['description'];
		$date = $weather['list'][$i]['dt'];
		$temp = $weather['list'][$i]['main']['temp'];
		$temp_min = $weather['list'][$i]['main']['temp_min'];
		$temp_max = $weather['list'][$i]['main']['temp_max'];
		$pod = $weather['list'][$i]['sys']['pod'];           
			
		$string .= '<div class="weather_box pod_d">';
			
			$string .= '<table>';
			if($i == 0){$string .= '<tr><th colspan="2">Today</th></tr>';}
			else{ $string .= '<tr><th colspan="2">'.date('D m.d.',$date).'</th></tr>';}
									
			$string .= '<tr><td colspan="2" class="weather_icon"><span class="icon weather_'.$conditions.' pod_d"></span></td></tr>';
				$string .= '<tr><td class="weather_desc" colspan="2">'.$description.'</td></tr>';
				
				
				$string .= '<tr><td><table>';
				
					$string .= '<tr><th>Min</th><th>Max</th></tr>';
					
					$string .= '<tr>';
					$string .= '<td class="weather_temp"><span class="digit">'.k_to_c($temp_min).'</span><span class="unit">&deg;C</span>/<span class="digit">'.k_to_f($temp_min).'</span><span class="unit">&deg;F</span></td>	';
					$string .= '<td class="weather_temp"><span class="digit">'.k_to_c($temp_max).'</span><span class="unit">&deg;C</span>/<span class="digit">'.k_to_f($temp_max).'</span><span class="unit">&deg;F</span></td></td>	';
					$string .= '</tr>';

				
				$string .= '</table></td></tr>';
								
				
			$string .= '</table>';
		
		
		
		$string .= '</div>';
	
	}
		
			
	return $string;
} 

function k_to_c($kelvin){
	$celsius = round($kelvin - 273.15);
	return $celsius;
}

function k_to_f($kelvin){
	$fahrenheit = round(($kelvin - 273.15)* 1.8 + 32.00);
	return $fahrenheit;
}