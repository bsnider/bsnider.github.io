var fl, slides;
var isMobile = false;

require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/Search",
  "esri/core/watchUtils",
  "dojo/query",

  // Calcite-maps
  "calcite-maps/calcitemaps-v0.10",
  "calcite-maps/calcitemaps-arcgis-support-v0.10",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  "bootstrap/Tab",

  "esri/webscene/Slide",
  "dojo/_base/array",
  "esri/layers/FeatureLayer",

  "esri/renderers/UniqueValueRenderer",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleMarkerSymbol",

  "esri/PopupTemplate",
  "esri/tasks/support/Query",

  "dojo/dom",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/dom-style",

  "dojo/domReady!"
], function (WebScene, SceneView, Search, watchUtils, query,
  CalciteMaps, CalciteMapsArcGIS,
  Collapse, Dropdown, Tab,
  Slide, arrayUtils, FeatureLayer,
  UniqueValueRenderer, PictureMarkerSymbol, SimpleMarkerSymbol,
  PopupTemplate, Query,
  dom, domClass, domConstruct, domStyle) {

    if (/Mobi/.test(navigator.userAgent)) {
      isMobile = true;
      //  console.log("mob");
    } else {
      isMobile = false;
      //  console.log("desk");
    }


    // Scene
    var scene = new WebScene({
      portalItem: {
        id: "f98572a50b7f446a975faa912a2959cc" // ID of the WebScene on arcgis.com
      }
    });

    // 3D View
    var view = new SceneView({
      container: "sceneViewDiv", // activate
      map: scene,
      padding: {
        top: 50, bottom: 0
      },
      ui: {
        top: 15, bottom: 15
      },

      popup: {
        container: "popupDiv",
        alignment: "bottom-left"
      }
    });


    // Create search widget
    var searchWidgetNav = new Search({
      container: "searchNavDiv",
      view: view
    });

    // Wire-up expand events
    CalciteMapsArcGIS.setSearchExpandEvents(searchWidgetNav);

    // Menu UI - change Basemaps
    query("#selectBasemapPanel").on("change", function (e) {
      view.map.basemap = e.target.value;
    });

    function createSlideUI(slide, placement) {
      var slideElement = document.createElement("div");
      // Assign the ID of the slide to the <span> element
      slideElement.id = slide.id;
      slideElement.classList.add("slide");

      var slidesDiv = document.getElementById("slidesDiv");
      if (placement === "first") {
        slidesDiv.insertBefore(slideElement, slidesDiv.firstChild);
      } else {
        slidesDiv.appendChild(slideElement);
      }

      var title = document.createElement("div");
      title.innerText = slide.title.text;
      title.className = "slidetitle";
      
      slideElement.appendChild(title);

      var img = new Image();
      // img.src = slide.thumbnail.url;
      var imgName;
      switch (slide.title.text) {
        case "Innovate! Inc.":
          imgName = "Innovate";
          break;
        case "Esri":
          imgName = "Esri";
          break;
        case "Pima County":
          imgName = "Pima";
          break;
        case "Uni. of Arizona":
          imgName = "Arizona";
          break;
        case "D:hive":
          imgName = "DHive";
          break;
        case "United Way":
          imgName = "UnitedWay";
          break;
        case "Mich. Fisheries Inst.":
          imgName = "MichDNR";
          break;
        case "UofM Hillel":
          imgName = "Hillel";
          break;
        case "Summer in the City":
          imgName = "SitC";
          break;
        case "Transit Riders United":
          imgName = "TRU";
          break;
        case "Uni. of Michigan":
          imgName = "BlockM";
          break;
      }
      // img.src = "icons/" + imgName + ".png";
      img.src = "icons/" + slide.id + ".png";

      img.title = slide.title.text;
      img.width = "100"
      slideElement.appendChild(img);

      slideElement.addEventListener("click", function () {

        var slides = document.querySelectorAll(".slide");
        Array.from(slides).forEach(function (node) {
          node.classList.remove("active");
        });
        slideElement.classList.add("active");
        //query("#collapseExperience").collapse();
        isMobile ? domClass.remove("collapseExperience", "in") : null;
        isMobile ? domClass.remove("experiencePanel", "in") : null;

        slide.applyTo(view).then(fl.queryFeatures({
          where: "name = '" + slide.id + "'",
          returnGeometry: true,
          outFields: ["*"],
        }).then(displayPopup));
      fl.visible = true;
    });
    }

function displayPopup(response) {
  console.log(response.features[0]);
  view.popup.open({
    features: [response.features[0]],
    location: response.features[0].geometry
  });
}

function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray[i];
    }
  }
}

view.when(function () {

  view.goTo({
    position: {
      x: -96.7840531503381,
      y: 33.77014785845847,
      z: 13757098.703575026,
      spatialReference: {
        wkid: 4326
      }
    },
    heading: 0,
    tilt: 0
  }, {
      speedFactor: 0.25
    });

  document.getElementById("slidesDiv").style.visibility = "visible";
  slides = scene.presentation.slides;
  slides.forEach(createSlideUI);

  addIconLayer();
});

function addIconLayer() {
  var picRenderer = new UniqueValueRenderer({
    field: "marker_url",
    defaultSymbol: new PictureMarkerSymbol({
      url: "icons/Arizona.png",
      width: "80px",
      height: "80px"
    })
  });
  // Create graphic symbols
  var iconArray = ["Innovate", "Esri", "Pima", " Arizona", "DHive", "UnitedWay", "MichDNR", "Hillel", "SitC", "TRU", "BlockM"]
  var dropdownHtml = arrayUtils.map(iconArray, function (feature) {
    var iconFile = feature + ".png";
    var iconUrl = "icons/" + feature + ".png";
    picRenderer.addUniqueValueInfo(iconFile,
      new PictureMarkerSymbol({
        url: iconUrl,
        width: "80px",
        height: "80px"
      })
    );
  });
  var template = new PopupTemplate({
    title: setTitleInfo,
    content: setContentInfo,
    actions: [], //setActionInfo//,
    overwriteActions: true
  });
  console.log(template);
  fl = new FeatureLayer({
    portalItem: { // autocasts as esri/portal/PortalItem
      id: "3db2518bb6b54b6d85958b3de01d10bb"
    },
    renderer: picRenderer,
    outFields: ["*"],
    elevationInfo: {
      mode: "relative-to-ground",
      offset: 5
    }
  });
  fl.popupTemplate = template;
  scene.add(fl); // adds the layer to the map

  function setTitleInfo(feature) {
    feature = feature.graphic;
    var name = feature.attributes.shortAlias;
    var position = feature.attributes.position;
    var url = feature.attributes.url;

    return position + " <a href=' " + url + "' target='_blank'>@ " + name + " <i class='fas fa-external-link-alt'></i></a>";
  }

  function setContentInfo(feature) {
    feature = feature.graphic;
    console.log(feature);
    var name = feature.attributes.shortAlias;
    var date = feature.attributes.timespan;
    var location = feature.attributes.city;

    var courseList = "";
    var subjectList = "";
    var panelBullets = "";
    for (i = 1; i < 7; i++) {
      var currentBullet = feature.attributes['bullet' + i];
      if (currentBullet != null) {
        var listItem = "<p class='popup-bullet'><i class='fa fa-location-arrow fa-lg' aria-hidden='true'></i>  &nbsp;&nbsp;" + currentBullet + "</p>";
        panelBullets = panelBullets + listItem;
      }
    }
    if (name == "University of Michigan") {
      var courseArray = ["Environmental and Sustainable Engineering", "Environmental Justice", "Food, Land, and Society", "Conservation of Biological Diversity"];

      arrayUtils.forEach(courseArray, function (course) {
        var listItem;
        listItem = "<p class='popup-course'><i class='fa fa-book fa-lg' aria-hidden='true'></i> &nbsp;&nbsp;" + course + "</p>";
        courseList = courseList + listItem;
      });
      courseList = "Influential courses:<br><br>" + courseList;

      console.log(courseList);
      //var relevant courses = "Environmental and Sustainable Engineering"
    } else if (name == "University of Arizona") {
      var courseArray = ["Remote sensing", "Geodata management", "Cartography", "Spatial statistics", "Scripting and Web GIS"];

      arrayUtils.forEach(courseArray, function (course) {
        var listItem;
        listItem = "<p class='popup-course'><i class='fa fa-book fa-lg' aria-hidden='true'></i> &nbsp;&nbsp;" + course + "</p>";
        subjectList = subjectList + listItem;
      });
      subjectList = "Notable topics:<br><br>" + subjectList;
      console.log(subjectList);
    } else if (name == "Esri") {
      var courseArray = ["Starting	Fresh	with	JavaScript	4.x:	Esri	User	Conference,	June	2016", "Building	Native	Apps	Using	AppStudio	for	ArcGIS:	Esri	Pre-Developer	Summit Hands-on	Training,	March	2016", "Debugging	offline	editing	using	the	ArcGIS	Runtime	SDK	for	iOS:	Esri	User	Conference,	July 2015"];

      arrayUtils.forEach(courseArray, function (course) {
        var listItem;
        listItem = "<p class='popup-course'><i class='fa fa-tv fa-lg' aria-hidden='true'></i> &nbsp;&nbsp;" + course + "</p>";
        subjectList = subjectList + listItem;
      });
      subjectList = "Presentations:<br><br>" + subjectList;
      console.log(subjectList);
    }


    var contentFooter = "<h5 class='popup-footer'>" + location + " &nbsp;&nbsp; | &nbsp;&nbsp; " + date + "</h5>";

    var node = domConstruct.create("div", {
      innerHTML: "<div style='margin-top:5px;>" + panelBullets + courseList + subjectList + contentFooter + "</div>",
      style: {
        "margin-top": "5px;"
      }
    });
    console.log(node);
    console.log(setActionInfo(feature));

    return node;
  }

  function setActionInfo(feature) {
    //feature = feature.graphic;
    // feature.attributes.url
    var actions = [{
      id: "open-website",
      image: "Arizona.png",
      title: "Open website"
    }];
    return actions;
  }

  view.on("click", function (event) {
    isMobile ? domClass.remove("collapseExperience", "in") : null;
    isMobile ? domClass.remove("experiencePanel", "in") : null;

    isMobile ? domClass.remove("collapseContact", "in") : null;
    isMobile ? domClass.remove("contactPanel", "in") : null;

    isMobile ? domClass.remove("collapseAbout", "in") : null;
    isMobile ? domClass.remove("aboutPanel", "in") : null;
    view.hitTest(event).then(function (response) {
      response.results.length > 0 ? slides.items.find(o => o.id === response.results[0].graphic.attributes.name).applyTo(view) : null;
      fl.visible = true;
    });
  });

  watchUtils.whenFalse(view.popup, 'visible', function(newVal){
    isMobile ? domClass.add("experiencePanel", "in") : null;
  });
  var queryFeat = new Query();
  var template1 = new PopupTemplate();
}
  });