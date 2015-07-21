/*
 * Leaflet zoom control with a home button for resetting the view.
 *
 * Distributed under the CC-BY-SA-3.0 license. See the file "LICENSE"
 * for details.
 *r
 * Based on code by toms (https://gis.stackexchange.com/a/127383/48264).
 */
(function() {
  "use strict";

  L.Control.CustomControl = L.Control.extend({
    options: {
      position: 'topleft',
      customControlIcon: 'custom',
      customControlTitle: 'custom'
    },


    onAdd: function(map) {
      var container = L.DomUtil.create('div', 'leaflet-bar');
      // container.style.backgroundColor = 'white';
      // container.style.backgroundImage = 'url(http://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)';
      // container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';
      container.style.margin = '0px';
      container.id = 'sideBarTab';
      container.innerHTML = '<i class="fa fa-angle-double-left" style="line-height:1.65;"></i>';
console.log(this);
      container.onclick = function() {
        $("#sidebar:visible").toggle("", function() {
          container.innerHTML = '<i class="fa fa-angle-double-right" style="line-height:1.65;"></i>';
        });
        $("#sidebar:hidden").toggle("", function() {
          container.innerHTML = '<i class="fa fa-angle-double-left" style="line-height:1.65;"></i>';
        });
        map.invalidateSize();

      }
      return container;
    },

    _customControl: function(e) {
    }
  });

  L.Control.customControl = function(options) {

    return new L.Control.CustomControl(options);
  };
}());
