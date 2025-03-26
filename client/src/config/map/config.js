import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";


// Geolocation control configuration
export const geolocateConfig = new mapboxgl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  fitBoundsOptions: {
    maxZoom: 16,
    linear: true,
  },
  trackUserLocation: true,
  showUserHeading: true,
  showAccuracyCircle: false,
});

// Navigation control configuration
export const navigationConfig = new mapboxgl.NavigationControl({
  showZoom: true,
  showCompass: true,
});

// Directions control configuration
// export const directionsConfig = new MapboxDirections({
//   accessToken: mapboxgl.accessToken,
//   unit: "metric", 
//   profile: "mapbox/walking",
// });
