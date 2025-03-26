import { useEffect } from "react";

const useRealtimeLocation = ({ setCurrentLat, setCurrentLng }) => {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLng(pos.coords.longitude);
        setCurrentLat(pos.coords.latitude);
      },
      (err) => {
        console.error("Failed to get current location:", err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);
};

export default useRealtimeLocation;
