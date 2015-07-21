/*
 * Leaflet zoom control with a home button for resetting the view.
 *
 * Distributed under the CC-BY-SA-3.0 license. See the file "LICENSE"
 * for details.
 *r
 * Based on code by toms (https://gis.stackexchange.com/a/127383/48264).
 */
(function () {
    "use strict";

    var CustomControl = L.Control.extend({
      options: { position: 'topleft' },


      onAdd: function (map) {
          var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          // container.style.backgroundColor = 'white';
          // container.style.backgroundImage = 'url(http://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)';
          // container.style.backgroundSize = '30px 30px';
          container.style.width = '30px';
          container.style.height = '30px';
          container.onclick = function () {
              console.log('buttonClicked');
          };

          var customControlText = '<i class="fa fa-angle-double-right" style="line-height:1.65;"></i>';
          this._zoomHomeButton = this._createButton(zoomHomeText, options.zoomHomeTitle,
              controlName + '-min', container, this._zoomHome.bind(this));


          return container;
      },

        // _customControl: function (e) {
        //   //$("#sidebar").toggle();
        //
        //     //jshint unused:false
        //     //this._map.setView(this.options.homeCoordinates, this.options.homeZoom);
        // }
    });
    // window.addEventListener('DOMContentLoaded', readyState);

    L.Control.customControl = function (options) {
        return new L.Control.CustomControl(options);
    };
}());
