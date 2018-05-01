  // 1. Create a map object.
    var mymap = L.map('map', {
        center: [39.62, -100.85],
        zoom: 5,
        maxZoom: 17,
        minZoom: 3,
        detectRetina: true // detect whether the sceen is high resolution or not.
    });

    // 2. Add a base map.
    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png').addTo(mymap);

    // 3.Add airports GeoJSON Data
    // Null variable that will hold airports data
    var airports = null;


    // 4. build up a set of colors from colorbrewer's "set2" category
    var colors = chroma.scale('Set2').mode('lch').colors(2);

    // 5. dynamically append style classes to this page using a JavaScript for loop. These style classes will be used for colorizing the markers.
    for (i = 0; i < 2; i++) {
        $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
    }

    // Get GeoJSON and put on it on the map when it loads
    airports= L.geoJson.ajax("assets/airports.geojson",{
// assign a function to the onEachFeature parameter of the airports object.
// Then each (point) feature will bind a popup window.
// The content of the popup window is the value of `feature.properties.company`
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.CNTL_TWR);
        },
        pointToLayer: function (feature, latlng) {
            var id = 0;
            if (feature.properties.CNTL_TWR == "Y") { id = 0; }

            else { id = 1;}
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
        },
        attribution: 'GeoVisualization: Airport Data | U.S States | Base Map &copy; CartoDB | Lab3 Majid Farahani'
    });
    // Add the airports to the map.

    airports.addTo(mymap);






    // 6. Set function for color ramp
    colors = chroma.scale('OrRd').colors(10); //colors = chroma.scale('OrRd').colors(5);

    function setColor(density) {
        var id = 0;
        if (density > 45) { id = 9; }
        else if (density > 40 && density <= 45) { id = 8; }
        else if (density > 35 && density <= 40) { id = 7; }
        else if (density > 30 && density <= 35) { id = 6; }
        else if (density > 25 && density <= 30) { id = 5; }
        else if (density > 20 && density <= 25) { id = 4; }
        else if (density > 15&&  density <= 20) { id = 3; }
        else if (density > 10&&  density <= 15) { id = 2; }
        else if (density > 5&&  density <= 10) { id = 1; }
        else  { id = 0; }
        return colors[id];
    }
    // 7. Set style function that sets fill color.md property equal to cell tower density
    function style(feature) {
        return {
            fillColor: setColor(feature.properties.count),
            fillOpacity: 0.4,
            weight: 2,
            opacity: 1,
            color: '#b4b4b4',
            dashArray: '4'
        };
    }
    // 8. Add state polygons
    L.geoJson.ajax("assets/us-states.geojson", {
        style: style
    }).addTo(mymap);


    // 9. Create Leaflet Control Object for Legend
    var legend = L.control({position: 'topright'});

    // 10. Function that runs when legend is added to map
    legend.onAdd = function () {

        // Create Div Element and Populate it with HTML
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<b># Airports in U.S States</b><br />';
        div.innerHTML += '<i style="background: ' + colors[9] + '; opacity: 0.5"></i><p>45+</p>';
        div.innerHTML += '<i style="background: ' + colors[8] + '; opacity: 0.5"></i><p>40-45</p>';
        div.innerHTML += '<i style="background: ' + colors[7] + '; opacity: 0.5"></i><p>35-40</p>';
        div.innerHTML += '<i style="background: ' + colors[6] + '; opacity: 0.5"></i><p>30-35</p>';
        div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>25-30</p>';
        div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>20-25</p>';
        div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>15-20</p>';
        div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>10-15</p>';
        div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 5-10</p>';
        div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0- 5</p>';
        div.innerHTML += '<hr><b>airport<b><br />';
        div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> With tower</p>';
        div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> Whithout tower</p>';
        // div.innerHTML += '<i class="fa fa-signal marker-color-3"></i><p> RCC Minnesota</p>';
        // div.innerHTML += '<i class="fa fa-signal marker-color-4"></i><p> Verizon</p>';
        // div.innerHTML += '<i class="fa fa-signal marker-color-5"></i><p> US Cellular</p>';
        // div.innerHTML += '<i class="fa fa-signal marker-color-6"></i><p> Hood River Cellular</p>';
        // div.innerHTML += '<i class="fa fa-signal marker-color-7"></i><p> Medford Cellular</p>';
        // div.innerHTML += '<i class="fa fa-signal marker-color-8"></i><p> Oregon RSA</p>';
        // div.innerHTML += '<i class="fa fa-signal marker-color-9"></i><p> Salem Cellular</p>';
        // Return the Legend div containing the HTML content
        return div;
    };

    // 11. Add a legend to map
    legend.addTo(mymap);

    // 12. Add a scale bar to map
    L.control.scale({position: 'bottomleft'}).addTo(mymap);

    // 13. Add a latlng graticules.
    L.latlngGraticule({
        showLabel: true,
        opacity: 0.2,
        color: "#747474",
        zoomInterval: [
            {start: 2, end: 7, interval: 2},
            {start: 8, end: 11, interval: 0.5}
        ]
    }).addTo(mymap);

    // 14. This is core of how Labelgun works. We must provide two functions, one
    // that hides our labels, another that shows the labels. These are essentially
    // callbacks that labelgun uses to actually show and hide our labels
    // In this instance we set the labels opacity to 0 and 1 respectively.
    var hideLabel = function(label){ label.labelObject.style.opacity = 0;};
    var showLabel = function(label){ label.labelObject.style.opacity = 1;};
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var labels = [];

    // 15. Create a label for each state.
    var usstates = null;
    usstates = L.geoJson.ajax("assets/us-states.geojson", {
        style: style,
        onEachFeature: function (feature, label) {
            label.bindTooltip(feature.properties.name, {className: 'feature-label', permanent:true, direction: 'center'});
            labels.push(label);
        }
    }).addTo(mymap);

    //16.  create an addLabel function to dynamically update the visible labels, aiming to avoid the lable overlap.
    function addLabel(layer, id) {
        // This is ugly but there is no getContainer method on the tooltip :(
        var label = layer.getTooltip()._source._tooltip._container;
        if (label) {
            // We need the bounding rectangle of the label itself
            var rect = label.getBoundingClientRect();

            // We convert the container coordinates (screen space) to Lat/lng
            var bottomLeft = mymap.containerPointToLatLng([rect.left, rect.bottom]);
            var topRight = mymap.containerPointToLatLng([rect.right, rect.top]);
            var boundingBox = {
                bottomLeft : [bottomLeft.lng, bottomLeft.lat],
                topRight   : [topRight.lng, topRight.lat]
            };

            // Ingest the label into labelgun itself
            labelEngine.ingestLabel(
                boundingBox,
                id,
                parseInt(Math.random() * (5 - 1) + 1), // Weight
                label,
                label.innerText,
                false
            );

            // If the label hasn't been added to the map already
            // add it and set the added flag to true
            if (!layer.added) {
                layer.addTo(mymap);
                layer.added = true;
            }
        }

    }

    //17. We will update the visualization of the labels whenever you zoom the map.

    mymap.on("zoomend", function(){
        var i = 0;
        usstates.eachLayer(function(label){
            addLabel(label, ++i);
        });
        labelEngine.update();
    });
    // 18. define the coordinate reference system (CRS)
    mycrs = new L.Proj.CRS('EPSG:2991',
        '+proj=lcc +lat_1=43 +lat_2=45.5 +lat_0=41.75 +lon_0=-120.5 +x_0=400000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
        {
            resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1] // example zoom level resolutions
        }
    );
