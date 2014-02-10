<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title>Load GeoJSON</title>

<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />

<link href='css/style.css' rel='stylesheet' />

<script type="text/javascript" src="//use.typekit.net/zns6amn.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>

<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/v1.6.1/mapbox.js'></script>
<link href='https://api.tiles.mapbox.com/mapbox.js/v1.6.1/mapbox.css' rel='stylesheet' />
<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-osm/v0.1.0/leaflet-osm.js'></script>




<script src="js/leaflet.geometryutil.js"></script>


<script type='text/javascript' src='js/tinycolor.js'></script>
<script type='text/javascript' src='js/raphael-min.js'></script>
<script type='text/javascript' src='js/profile.js'></script>
<script type='text/javascript' src='js/mapper.js'></script>
</head>
<body>

<?php include('includes/functions.php'); ?>



<div id="graphic_container">

<div id="map_container">
	<div id='map'></div>
</div>

<div id="mask"></div>

<div id="profile_container">
	<div id='profile'></div>
	
	<div id="meta">
				
		<h1>Passo Dello Stelvio</h1>
		<h3>Via Glurns - Bormio</h3>
		<h2>2.757 m</h2>
		
	</div>
	
	<?php getweather(46.52887, 10.45315); ?>
	
	<div id="weather">
		<div id="w_today"><?php print render_weather_single(0,1); ?></div>
		<div id="w_forecast"><?php print render_weather_multi(1,3); ?></div>
	</div>
	
</div>

</div>


</body>
</html>