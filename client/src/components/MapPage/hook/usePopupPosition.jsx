import { useEffect } from "react";

const offset = 50;

const usePopupPosition = ({ mapRef, selectedToilet, setPopupPosition}) => {

  useEffect(() => {
    if (!mapRef.current || !selectedToilet) return;
    const updatePopupPosition = () => {
        const markerPosition = mapRef.current.project([
          selectedToilet.location.coordinates[0],
          selectedToilet.location.coordinates[1],
        ]);
        setPopupPosition({
          x: markerPosition.x,
          y: markerPosition.y - offset,
        });
      };
    updatePopupPosition();
    mapRef.current.on("move", updatePopupPosition);

    // return () => {
    //   mapRef.current.off("move", updatePopupPosition);
    // };
  }, [mapRef, selectedToilet]);
};

export default usePopupPosition;
