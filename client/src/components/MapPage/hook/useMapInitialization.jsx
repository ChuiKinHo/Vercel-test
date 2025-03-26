import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { navigationConfig, geolocateConfig } from "@config/map/config";

const initialPosition = {
  longitude: 114.1694,
  latitude: 22.3193,
};

const useMapInitialization = ({ mapContainerRef, is3DModeEnabled }) => {
  const mapRef = useRef(null);
  const geolocationRef = useRef(geolocateConfig);

  const toggle3DBuildings = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setPitch(is3DModeEnabled ? 60 : 0);
      mapRef.current.setBearing(is3DModeEnabled ? -20 : 0);
    }
  }, [is3DModeEnabled]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initialPosition.longitude, initialPosition.latitude],
      zoom: 12,
      antialias: true,
    });

    mapRef.current.on("load", () => {
      mapRef.current.addControl(navigationConfig);
      mapRef.current.addControl(geolocateConfig);

      // mapRef.current.on("dragstart", () => {
      //   setSelectedToilet(null);
      // });
    });
  }, [mapContainerRef]);

  useEffect(() => {
    toggle3DBuildings();
  }, [is3DModeEnabled, toggle3DBuildings]);

  return { mapRef, geolocationRef };
};

export default useMapInitialization;
