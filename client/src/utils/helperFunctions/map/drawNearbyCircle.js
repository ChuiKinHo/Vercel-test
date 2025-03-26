import * as turf from "@turf/turf"; // Turf.js for creating geographical circles

const drawNearbyCircle = ({
  mapRef,
  longitude,
  latitude,
  nearbyCircleRadius,
  is3DModeEnabled,
}) => {
  // Create circle geometry with constant radius
  const circlePolygon = turf.circle(
    [longitude, latitude],
    nearbyCircleRadius / 1000,
    {
      steps: 64,
      units: "kilometers",
    }
  );

  // Add or update the GeoJSON source
  if (!mapRef.current.getSource("user-accuracy-circle")) {
    mapRef.current.addSource("user-accuracy-circle", {
      type: "geojson",
      data: circlePolygon,
    });
  } else {
    mapRef.current.getSource("user-accuracy-circle").setData(circlePolygon);
  }

  const layerConfig = is3DModeEnabled
    ? {
        id: "user-accuracy-circle",
        type: "fill-extrusion",
        source: "user-accuracy-circle",
        paint: {
          "fill-extrusion-color": "#1DA1F2",
          "fill-extrusion-opacity": 0.2,
          "fill-extrusion-height": 0,
          "fill-extrusion-base": 0,
        },
      }
    : {
        id: "user-accuracy-circle",
        type: "fill",
        source: "user-accuracy-circle",
        paint: {
          "fill-color": "#1DA1F2",
          "fill-opacity": 0.2,
        },
      };

  // Add or update the layer configuration
  if (mapRef.current.getLayer("user-accuracy-circle")) {
    mapRef.current.removeLayer("user-accuracy-circle");
  }
  mapRef.current.addLayer(layerConfig);
};

export default drawNearbyCircle;
