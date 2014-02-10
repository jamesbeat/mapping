<?php 
session_start();
/* ======================================================== */
/* WEATHER FORECAST */
/* ======================================================== */


function getweather($lat,$lon){
	//check if is no older than 30min
	
	if (isset($_SESSION['weather_stamp'])) {
	
		$currentTime = time();
		$sessiontime = $_SESSION['weather_stamp'];
		$delta = strtotime("-30 minutes");
		
		if ($_SESSION['weather_stamp'] <= $delta) {
			
			parseweather($lat,$lon);
			$_SESSION['weather_stamp'] = $currentTime;
		    
		}
		else {
				   
		}
	}
	else {
 
	  $_SESSION['weather_stamp'] = time();
	  parseweather($lat,$lon);
	}
	
}


function parseweather($lat,$lon){
	
	$path_to_file = 'http://api.openweathermap.org/data/2.5/forecast?lat='.$lat.'&lon='.$lon.'&mode=json';
	$weather = parse_json($path_to_file); 
	
	$_SESSION['conditions'] = $weather['list'][0]['weather'][0]['id'];
	$_SESSION['description'] = $weather['list'][0]['weather'][0]['description'];
	$_SESSION['kelvin'] = $weather['list'][0]['main']['temp'];
	$_SESSION['celsius'] = k_to_c($_SESSION['kelvin']);
	$_SESSION['fahrenheit'] = round($_SESSION['celsius']*1.8+32);
	$_SESSION['pod'] = $weather['list'][0]['sys']['pod'];
	$_SESSION['min'] = k_to_c($weather['list'][0]['main']['temp_min']);
	$_SESSION['max'] = k_to_c($weather['list'][0]['main']['temp_max']);

}

 
function render_weather_single(){
		
	$string = "";
	$string .= '<div class="weather_widget">';
	$string .= '<table>';
		$string .= '<tr>';
		$string .= '<th colspan="2">Peak Weather</th><th>min</th><th></th><th>max</th></tr>';
		$string .= '<td class="weather_icon"><span class="icon weather_'.$_SESSION['conditions'].' pod_'.$_SESSION['pod'].'"></span></td>';
		$string .= '<td class="temperature"><span class="digit">'.$_SESSION['celsius'].'</span><span class="unit">&deg;C</span></td>';
		$string .= '<td class="weather_temp"><span class="digit">'.$_SESSION['min'].'</span><span class="unit">&deg;C</span></td>';
		$string .= '<td class="weather_temp"><span class="separator">/</span></td>';
		$string .= '<td class="weather_temp"><span class="digit">'.$_SESSION['max'].'</span><span class="unit">&deg;C</span></td>';
						
		$string .= '</tr>';
	$string .= '</table>';
	$string .= '</div>';
	
	return $string;
} 
 
function render_weather_multi($offset=0, $days=4){
	
	$path_to_file = 'http://api.openweathermap.org/data/2.5/forecast?q=Oberammergau,de&mode=json';
	$weather = parse_json($path_to_file); 
	
	/*
	print  '<pre>';
	print_r($weather);
	print  '</pre>';
	*/

	$string = "";
	
	
	$string .= '<table>';
	
	
	$row1 = "";
	$row2 = "";
	$row3 = "";
	
	
		for($i = 8; $i <= $days*8; $i+=8){
		
			$conditions = $weather['list'][$i]['weather'][0]['id'];
			$description = $weather['list'][$i]['weather'][0]['description'];
			$date = $weather['list'][$i]['dt'];
			$temp = $weather['list'][$i]['main']['temp'];
			$temp_min = $weather['list'][$i]['main']['temp_min'];
			$temp_max = $weather['list'][$i]['main']['temp_max'];
			$pod = $weather['list'][$i]['sys']['pod'];           
						
				/*
				$string .= '<tr><th colspan="2">'.date('D',$date).'</th></tr>';
										
				$string .= '<tr><td colspan="2" class="weather_icon"><span class="icon weather_'.$conditions.' pod_d"></span></td></tr>';
							
					$string .= '<tr><td><table>';
					
						$string .= '<tr><th>Min</th><th><th>Max</th></tr>';
						
						$string .= '<tr>';
						$string .= '<td class="weather_temp"><span class="digit">'.k_to_c($temp_min).'</span><span class="unit">&deg;C</span></td>	';
						$string .= '<td class="weather_temp"><span class="separator">/</span></td>';
						$string .= '<td class="weather_temp"><span class="digit">'.k_to_c($temp_max).'</span><span class="unit">&deg;C</span></td></td>	';
						$string .= '</tr>';
	
					
					$string .= '</table></td></tr>';
									
				*/
				
				   $row1 .= '<th colspan="3">'.date('D',$date).'</th>';
					$row2 .= '<td class="weather_icon" colspan="3"><span class="icon weather_'.$conditions.' pod_'.$_SESSION['pod'].'"></span></td>';
											
					$row3 .= '<td class="weather_temp"><span class="digit">'.k_to_c($temp_min).'</span><span class="unit">&deg;C</span></td>';
					$row3 .= '<td class="weather_temp"><span class="separator">/</span></td>';
					$row3 .= '<td class="weather_temp"><span class="digit">'.k_to_c($temp_max).'</span><span class="unit">&deg;C</span></td>';
									
						
		}
		
		$string .= '<tr>'.$row1.'</tr>';
		$string .= '<tr>'.$row2.'</tr>';
		$string .= '<tr>'.$row3.'</tr>';
		
		$string .= '</table>';
				
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


function parse_json($path_to_file){
	
	// Parse Json File
	$file = file_get_contents($path_to_file);
	$data = json_decode($file, true);
	
	//Error Handling
	switch (json_last_error()) {
        case JSON_ERROR_NONE:
            //echo ' - No errors';
            return $data;            
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
        break;
    }
}
