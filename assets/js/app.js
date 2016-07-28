var map, item, clusterGroup;


$(document).ready(function ($) {

  // delegate calls to data-toggle="lightbox"
  $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    event.preventDefault();
    return $(this).ekkoLightbox({
      always_show_close: true
    });
  });

});


$('#map').click(function() {
  $(".navbar-collapse").collapse('hide');
});


$('#map').click(function() {
  $(".navbar-collapse").collapse('hide');
});

// // nav bar about modal button
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// // nav bar about modal button
$("#contact-btn").click(function() {
  $("#contactModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// zoom map once init modal is closed
$('#initModal').on('hidden.bs.modal', function() {
  map.fitBounds(clusterGroup.getBounds());
  //map.setMaxBounds(locations.getBounds());
  return false;
})

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

$("#sideBarTab").click(function() {
  console.log("hiiii");

  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#featureModal").on("hidden.bs.modal", function(e) {
  // $(document).on("mouseout", ".feature-row", clearHighlight);
});

// zoom to and highlight selected sidebar feature
$(document).on("click", ".feature-row", function(e) {
  // $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
  //$(this).css('background-color', 'red');
});

function sidebarClick(id) {
  var layer = clusterGroup.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 15);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    //$("#sidebar").hide();
    map.invalidateSize();
  }
}

// mapBox basemap and access token
L.mapbox.accessToken = 'pk.eyJ1IjoiYmpzbmlkZXIiLCJhIjoiMjhkOWI0ZjM1MDZiMGQzYmY3YTU5ZWU1OTM2YjU1NDgifQ.paiaL8scv6VHN53ufTkpIQ';

// create the map

var map = L.map('map',{
  zoomControl: false
}).setView([39.828175, -98.5795], 3);

L.esri.basemapLayer('Gray').addTo(map);
L.esri.tiledMapLayer("https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer").addTo(map);


if ($(window).width() > 768){

  var stateChangingButton = L.easyButton({
    states: [{
      stateName: 'vis',
      icon: 'fa-arrow-left fa-lg',
      title: 'Minimize the sidebar',
      onClick: function(btn, map) {
        btn.state('hide');
        console.log('state1');
        $("#sidebar").toggle();
        map.invalidateSize();
      }
    }, {
      stateName: 'hide',
      icon: 'fa-arrow-right fa-lg',
      title: 'Maximize the sidebar',
      onClick: function(btn, map) {
        btn.state('vis');
        console.log('state2');
        $("#sidebar").toggle();
        map.invalidateSize();
      }
    }]
  });
}
else{
  var stateChangingButton = L.easyButton({
    states: [{
      stateName: 'vis',
      icon: 'fa-arrow-right fa-lg',
      title: 'Minimize the sidebar',
      onClick: function(btn, map) {
        btn.state('hide');
        console.log('state1');
        $("#sidebar").toggle();
        map.invalidateSize();
      }
    }, {
      stateName: 'hide',
      icon: 'fa-arrow-left fa-lg',
      title: 'Maximize the sidebar',
      onClick: function(btn, map) {
        btn.state('vis');
        console.log('state2');
        $("#sidebar").toggle();
        map.invalidateSize();
      }
    }]
  });

}

  stateChangingButton.addTo(map);



var zoomHome = L.Control.zoomHome({
    position: 'topright'
  })
  .addTo(map);

// wait until geojson is converted to feature layer
var FL = L.mapbox.featureLayer('assets/data/data.geojson').on('ready', function(e) {
//var FL = L.mapbox.featureLayer('http://localhost/cluster-scratch/assets/data/data.geojson').on('ready', function(e) {

  // create and add cluster layer instance to map
  clusterGroup = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 15
  });
  map.addLayer(clusterGroup);


  e.target.eachLayer(function(feature1, layer) {
    var feature = feature1.feature;
    if (feature.properties) {
      if (feature.properties.bullet6) {
        var content = "<table class='table table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<tr><th>Description</th><td><ul><li>" + feature.properties.bullet1 + "</li><li>" + feature.properties.bullet2 + "</li><li>" + feature.properties.bullet3 + "</li><li>" + feature.properties.bullet4 + "</li><li>" + feature.properties.bullet5 + "</li><li>" + feature.properties.bullet6 + "</li></ul></td></tr>" + "<table>";
        // var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<tr><th>Description</th><td><ul><li>" + feature.properties.bullet1 + "</li><li>" + feature.properties.bullet2 + "</li><li>" + feature.properties.bullet3 + "</li><li>" + feature.properties.bullet4 + "</li><li>" + feature.properties.bullet5 + "</li><li>" + feature.properties.bullet6 + "</li></ul></td></tr>" + "<table>";



      } else if (feature.properties.bullet5) {
        var content = "<table class='table table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<tr><th>Description</th><td><ul><li>" + feature.properties.bullet1 + "</li><li>" + feature.properties.bullet2 + "</li><li>" + feature.properties.bullet3 + "</li><li>" + feature.properties.bullet4 + "</li><li>" + feature.properties.bullet5 + "</li></ul></td></tr>" + "<table>";
      } else if (feature.properties.bullet4) {
        var content = "<table class='table table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<tr><th>Description</th><td><ul><li>" + feature.properties.bullet1 + "</li><li>" + feature.properties.bullet2 + "</li><li>" + feature.properties.bullet3 + "</li><li>" + feature.properties.bullet4 + "</li></ul></td></tr>" + "<table>";
      } else if (feature.properties.bullet3) {
        var content = "<table class='table table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<tr><th>Description</th><td><ul><li>" + feature.properties.bullet1 + "</li><li>" + feature.properties.bullet2 + "</li><li>" + feature.properties.bullet3 + "</li></ul></td></tr>" + "<table>";
      } else if (feature.properties.bullet2) {
        var content = "<table class='table table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<tr><th>Description</th><td><ul><li>" + feature.properties.bullet1 + "</li><li>" + feature.properties.bullet2 + "</li></ul></td></tr>" + "<table>";
      } else if (feature.properties.bullet1) {
        var content = "<table class='table table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<tr><th>Description</th><td><ul><li>" + feature.properties.bullet1 + "</li></ul></td></tr>" + "<table>";
      } else {
        var content = "<table class='table table-condensed'>" + "<tr><th>City</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.timespan + "</td></tr>" + "<table>";
      }
      var title = feature.properties.position + " - <a href='" + feature.properties.url + "''>" + feature.properties.name + "</a>";
      var title = feature.properties.position + " - <a href='" + feature.properties.url + "''>" + feature.properties.name + "&nbsp<i class='fa fa-link'></i></a>"
      feature1.on({
        click: function(e) {
          $("#feature-title").html(title);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          // highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });

    }
  });


  // add feature layer to cluster layer
  e.target.eachLayer(function(layer) {
    layer.options.icon.options.iconUrl = "assets/icons/" + layer.feature.properties.marker_url;
    layer.options.icon.options.iconSize = [null, null];
    clusterGroup.addLayer(layer);

    // highlight clicked feature
    clusterGroup.on('click', function(f) {
      if (f.layer.feature.properties.shortName == layer.feature.properties.shortName) {
        // highlight.clearLayers().addLayer(L.circleMarker([layer.feature.geometry.coordinates[1], layer.feature.geometry.coordinates[0]], highlightStyle));
      }
    });

    // create the legend
    var afa =
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img height="24" src="assets/icons/' + layer.feature.properties.marker_url + '"></td><td class="feature-name">' + layer.feature.properties.shortName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
  });

  function onmove() {
    // remove all legend contents

    $("#feature-list tbody").empty();
    $("#feature-listDisabled tbody").empty();
    // find the current map extent

    // loop through each feature
    // if the feature is visible, place in vis list, and vice versa
    e.target.eachLayer(function(layer) {
      $("#feature-list tbody").clear;
      if (map.getBounds().contains(layer.getLatLng())) {
        var afa =
          $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img height="24" src="assets/icons/' + layer.feature.properties.marker_url + '"></td><td class="feature-name">' + layer.feature.properties.shortName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      } else {
        var afa1 =
          $("#feature-listDisabled tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" style="background-color: #121111;" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img height="24" class="nonActiveFeatureImage" src="assets/icons/' + layer.feature.properties.marker_url + '"></td><td class="feature-name nonActiveFeatureText">' + layer.feature.properties.shortName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    });
  }

  // reareange the legend when the extent changes
  map.on('moveend', onmove);

  // clear selected feature on map click or zoom
  // map.on('click', function() {
  //   highlight.clearLayers();
  //
  // });
  // map.on('zoomstart', function() {
  //   highlight.clearLayers();
  // });

});
