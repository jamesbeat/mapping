<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title>Load GeoJSON</title>

<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />

<link href='css/style.css' rel='stylesheet' />

<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/v1.6.1/mapbox.js'></script>
<link href='https://api.tiles.mapbox.com/mapbox.js/v1.6.1/mapbox.css' rel='stylesheet' />
<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-osm/v0.1.0/leaflet-osm.js'></script>


<script src="js/leaflet.geometryutil.js"></script>
<script type='text/javascript' src='js/tinycolor.js'></script>
<script type='text/javascript' src='js/mapper.js'></script>
</head>
<body>
<div id='output'>
    click: <code id='click'></code><br/>
    mousemove: <code id='mousemove'></code><br/>
</div>

<div id="map_container">
<div id='map'></div>
<div id="mask"></div>
</div>


</body>
</html>