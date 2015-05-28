var map, featureList, locationsSearch = [];

$(window).resize(function() {
    sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
    $(document).off("mouseout", ".feature-row", clearHighlight);
    sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#full-extent-btn").click(function() {
    map.fitBounds(locations.getBounds());
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#legend-btn").click(function() {
    $("#legendModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#login-btn").click(function() {
    $("#loginModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

$("#list-btn").click(function() {
    $('#sidebar').toggle();
    map.invalidateSize();
    return false;
});

$("#nav-btn").click(function() {
    $(".navbar-collapse").collapse("toggle");
    return false;
});

$("#sidebar-toggle-btn").click(function() {
    $("#sidebar").toggle();
    map.invalidateSize();
    return false;
});

$("#sidebar-hide-btn").click(function() {
    $('#sidebar').hide();
    map.invalidateSize();
});

function sizeLayerControl() {
    $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
    highlight.clearLayers();
}

function sidebarClick(id) {
    var layer = markerClusters.getLayer(id);
    map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
    layer.fire("click");
    /* Hide sidebar and go to the map on small screens */
    if (document.body.clientWidth <= 767) {
        $("#sidebar").hide();
        map.invalidateSize();
    }
}

function syncSidebar() {
    /* Empty sidebar features */
    $("#feature-list tbody").empty();
    $("#feature-listDisabled tbody").empty();
    /* Loop through locations layer and add only features which are in the map bounds */
    locations.eachLayer(function(layer) {
        if (map.hasLayer(locationsLayer)) {
            if (map.getBounds().contains(layer.getLatLng())) {
                var afa =
                    $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img height="24" src="assets/img/' + layer.feature.properties.marker_url + '"></td><td class="feature-name">' + layer.feature.properties.shortName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
            else {
                var afa1 =
                    $("#feature-listDisabled tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" style="background-color: #E4E4E4;" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img height="24" class="nonActiveFeatureImage" src="assets/img/' + layer.feature.properties.marker_url + '"></td><td class="feature-name nonActiveFeatureText">' + layer.feature.properties.shortName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            }
        }
    });
    
    /* Update list.js featureList */
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });
}

/* Basemap Layers */

var accessToken = 'pk.eyJ1IjoiYmpzbmlkZXIiLCJhIjoiMjhkOWI0ZjM1MDZiMGQzYmY3YTU5ZWU1OTM2YjU1NDgifQ.paiaL8scv6VHN53ufTkpIQ';
// Replace 'examples.map-i87786ca' with your map id.
var mapquestOSM = L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=' + accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});



/*var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["otile1", "otile2", "otile3", "otile4"],
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});*/
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
    maxZoom: 18,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 15
};


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 15
});

/* Empty layer placeholder to add to layer control for listening when to add/remove locations to markerClusters layer */
var locationsLayer = L.geoJson(null);
var locations = L.geoJson(null, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({
                iconUrl: "assets/img/" + feature.properties.marker_url,
                //iconSize: [40, 40],
                iconAnchor: [12, 28],
                shadowAnchor: [12, 28],
                popupAnchor: [0, -25]
            }),
            title: feature.properties.NAME,
            riseOnHover: true
        });
    },
    onEachFeature: function(feature, layer) {
        if (feature.properties) {
            var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>Position</th><td>" + feature.properties.position + "</td></tr>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.url + "' target='agfagadgda'>" + "click here!" + "</a></td></tr>" + "<table>";
            layer.on({
                click: function(e) {
                    $("#feature-title").html(feature.properties.name);
                    $("#feature-info").html(content);
                    $("#featureModal").modal("show");
                    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
                }
            });
            $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
            locationsSearch.push({
                name: layer.feature.properties.NAME,
                address: layer.feature.properties.ADDRESS1,
                source: "Locations",
                id: L.stamp(layer),
                lat: layer.feature.geometry.coordinates[1],
                lng: layer.feature.geometry.coordinates[0]
            });
        }
    }
});
$.getJSON("data/map1.geojson", function(data) {
    locations.addData(data);
    map.addLayer(locationsLayer);
});

map = L.map("map", {
    zoom: 1,
    center: [39.828175, -98.5795],
    layers: [mapquestOSM, /*boroughs,*/ markerClusters, highlight],
    zoomControl: false,
    attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
    //if (e.layer === locationsLayer) {
        markerClusters.addLayer(locations);
        syncSidebar();
    //}
});

map.on("overlayremove", function(e) {
    //if (e.layer === locationsLayer) {
        markerClusters.removeLayer(locations);
        syncSidebar();
    //}
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function(e) {
    syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
    highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
    $.each(map._layers, function(index, layer) {
        if (layer.getAttribution) {
            $("#attribution").html((layer.getAttribution()));
        }
    });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
    position: "bottomright"
});
attributionControl.onAdd = function(map) {
    var div = L.DomUtil.create("div", "leaflet-control-attribution");
    div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
    return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's locations */
var locateControl = L.control.locate({
    position: "bottomright",
    drawCircle: true,
    follow: true,
    setView: true,
    keepCurrentZoomLevel: true,
    markerStyle: {
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
    },
    circleStyle: {
        weight: 1,
        clickable: false
    },
    icon: "icon-direction",
    metric: false,
    strings: {
        title: "My locations",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    },
    locateOptions: {
        maxZoom: 18,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
    }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
}

var baseLayers = {
    "Street Map": mapquestOSM,
    "Aerial Imagery": mapquestOAM,
    "Imagery with Streets": mapquestHYB
};

var groupedOverlays = {
    "Points of Interest": {
        "<img src='assets/img/theater.png' width='24' height='28'>&nbsp;Locations": locationsLayer
    }
    
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
    collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function() {
    $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function(e) {
    if (e.which == 13) {
        e.preventDefault();
    }
});

$("#featureModal").on("hidden.bs.modal", function(e) {
    $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function() {
    $("#loading").hide();
    sizeLayerControl();
    /* Fit map to boroughs bounds */
    map.fitBounds(locations.getBounds());
    featureList = new List("features", {
        valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
        order: "asc"
    });

    var locationsBH = new Bloodhound({
        name: "Locations",
        datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: locationsSearch,
        limit: 10
    });

    var geonamesBH = new Bloodhound({
        name: "GeoNames",
        datumTokenizer: function(d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
            filter: function(data) {
                return $.map(data.geonames, function(result) {
                    return {
                        name: result.name + ", " + result.adminCode1,
                        lat: result.lat,
                        lng: result.lng,
                        source: "GeoNames"
                    };
                });
            },
            ajax: {
                beforeSend: function(jqXhr, settings) {
                    settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
                    $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
                },
                complete: function(jqXHR, status) {
                    $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
                }
            }
        },
        limit: 10
    });
    locationsBH.initialize();
    geonamesBH.initialize();

    /* instantiate the typeahead UI */
    $("#searchbox").typeahead({
            minLength: 3,
            highlight: true,
            hint: false
        },{
            name: "Locations",
            displayKey: "name",
            source: locationsBH.ttAdapter(),
            templates: {
                header: "<h4 class='typeahead-header'><img src='assets/img/theater.png' width='24' height='28'>&nbsp;Locations</h4>",
                suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
            }
        },{
            name: "GeoNames",
            displayKey: "name",
            source: geonamesBH.ttAdapter(),
            templates: {
                header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
            }
        }).on("typeahead:selected", function(obj, datum) {
        if (datum.source === "Locations") {
            if (!map.hasLayer(locationsLayer)) {
                map.addLayer(locationsLayer);
            }
            map.setView([datum.lat, datum.lng], 17);
            if (map._layers[datum.id]) {
                map._layers[datum.id].fire("click");
            }
        }
        if (datum.source === "GeoNames") {
            map.setView([datum.lat, datum.lng], 14);
        }
        if ($(".navbar-collapse").height() > 50) {
            $(".navbar-collapse").collapse("hide");
        }
    }).on("typeahead:opened", function() {
        $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
        $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
    }).on("typeahead:closed", function() {
        $(".navbar-collapse.in").css("max-height", "");
        $(".navbar-collapse.in").css("height", "");
    });
    $(".twitter-typeahead").css("position", "static");
    $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
    L.DomEvent
        .disableClickPropagation(container)
        .disableScrollPropagation(container);
} else {
    L.DomEvent.disableClickPropagation(container);
}
