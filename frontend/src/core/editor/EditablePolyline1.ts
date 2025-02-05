import * as L from "leaflet";

const EditablePolyline = L.Polyline.extend({
    _selected: false,
    _initStyle: {},

    _initialize: function () {
        this.on("add", (e: L.LeafletEvent) => {
            this._map = e.target._map;

            this._doInitialize();
        });

        this.on("remove", function (event) {});
    },
    _doInitialize: function () {
        if (this._map._editablePolylines == null) {
            this._map._editablePolylines = [];
        }

        this._initStyle = JSON.parse(JSON.stringify(this.options));

        this.on("click", (e: L.LeafletMouseEvent) => {
            this._selected = true;

            this.setStyle({
                color: "yellow"
            });

            L.DomEvent.stopPropagation(e);
        });

        this._map.on("click", (e: L.LeafletMouseEvent) => {
            this._selected = false;
            this.setStyle(this._initStyle);
        });
    },

    _addMarkers = function() {
        
    },

    startEditing: function {

    }
});

EditablePolyline.addInitHook(function () {
    console.log("addInitHook");

    this._initialize();
});

export default EditablePolyline;
