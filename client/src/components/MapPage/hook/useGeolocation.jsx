import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import drawNearbyCircle from "@utils/helperFunctions/map/drawNearbyCircle";
import GEOLOCATION_STATUS from "@utils/constants/GeolocationStatus";

const useGeolocation = ({
  mapRef,
  markersRef,
  geolocationRef,
  GetToiletsLocationNearby,
  GetSearchPath,
  nearbyCircleRadius,
  destinatedToilet,
  is3DModeEnabled,
  setCurrentLng,
  setCurrentLat,
}) => {
  const [geolocationStatus, setGeolocationStatus] = useState(
    GEOLOCATION_STATUS.idle
  );
  const [isGeolocating, setIsGeolocating] = useState(false);

  const startTracking = () => {
    console.log("start tracking");
    setGeolocationStatus(GEOLOCATION_STATUS.loading);

    // remove the route path
    if (mapRef.current.getLayer("route")) {
      mapRef.current.removeLayer("route");
    }
    if (mapRef.current.getSource("route")) {
      mapRef.current.removeSource("route");
    }

    // remove the nearby circle
    if (mapRef.current.getLayer("user-accuracy-circle")) {
      mapRef.current.removeLayer("user-accuracy-circle");
    }
    if (mapRef.current.getSource("user-accuracy-circle")) {
      mapRef.current.removeSource("user-accuracy-circle");
    }
  };

  const endTracking = () => {
    console.log("end tracking");
    setGeolocationStatus(GEOLOCATION_STATUS.idle);
    setIsGeolocating(false);
  };

  const onTracking = async (pos) => {
    const { latitude, longitude, heading } = pos.coords;
    if (latitude && longitude) {
      setCurrentLng(longitude);
      setCurrentLat(latitude);
    }

    if (mapRef && mapRef.current) {
      drawNearbyCircle({
        mapRef,
        longitude,
        latitude,
        nearbyCircleRadius,
        is3DModeEnabled,
      });

      await GetToiletsLocationNearby({
        longitude,
        latitude,
        nearbyCircleRadius,
      });

      if (destinatedToilet) {
        await GetSearchPath({
          start: [longitude, latitude],
          end: [
            destinatedToilet.location.coordinates[0],
            destinatedToilet.location.coordinates[1],
          ],
          accessToken: mapboxgl.accessToken,
        });
      }

      mapRef?.current?.easeTo({
        center: [longitude, latitude],
        zoom:
          nearbyCircleRadius >= 500
            ? nearbyCircleRadius >= 800
              ? 14
              : 15
            : 16,
        duration: 700,
      });

      setGeolocationStatus(GEOLOCATION_STATUS.found);
    }
  };

  const onTrackError = () => {
    console.error("Failed to get location");
    setGeolocationStatus(GEOLOCATION_STATUS.idle);
  };

  const startGeolocation = () => {
    setIsGeolocating(true);
    geolocationRef?.current?.trigger();

    if (markersRef) {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    }
  };

  const stopGeolocation = () => {
    if (geolocationRef?.current) {
      geolocationRef.current.off("trackuserlocationstart", startTracking);
      geolocationRef.current.off("trackuserlocationend", endTracking);
      geolocationRef.current.off("geolocate", onTracking);
      geolocationRef.current.off("error", onTrackError);
    }
    setIsGeolocating(false);
  };

  useEffect(() => {
    geolocationRef?.current.on("trackuserlocationstart", startTracking);
    geolocationRef?.current.on("trackuserlocationend", endTracking);
    geolocationRef?.current.on("geolocate", onTracking);
    geolocationRef?.current.on("error", onTrackError);

    return () => {
      geolocationRef?.current.off("trackuserlocationstart", startTracking);
      geolocationRef?.current.off("trackuserlocationend", endTracking);
      geolocationRef?.current.off("geolocate", onTracking);
      geolocationRef?.current.off("error", onTrackError);
    };
  }, [isGeolocating]);

  return {
    stopGeolocation,
    startGeolocation,
    geolocationStatus
  };
};

export default useGeolocation;
