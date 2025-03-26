import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMutation } from "react-query";
import getAddress from "@services/map/getAddress";
import useSubDistrictMenu from "@components/common/Dropdown/DropdownMenu/SubDistrictMenu";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import axios from "axios";
import ToiletMarkerImage from "../Markers";

const LAT_OFFSET_RATIO = 0.2;

const useAddToiletMarkerPosition = ({
  mapRef,
  showAddToiletDrawer,
  GOOGLE_API_KEY,
}) => {
  const SubDistrictMenu = useSubDistrictMenu();
  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  const toiletMarkerRef = useRef(null);
  const [toiletAddress, setToiletAddress] = useState("");
  const [toiletArea, setToiletArea] = useState("");
  const [toiletDistrict, setToiletDistrict] = useState("");
  const [toiletSubDistrict, setToiletSubDistrict] = useState("");

  const { mutateAsync: GetAddress } = useMutation({
    mutationFn: getAddress,
    onSuccess: (res) => {
      setToiletAddress(res.address);
      setToiletArea(res.area);
      setToiletSubDistrict(res.sub_district);

      // Find district
      if (res.sub_district && SubDistrictMenu[res.sub_district]) {
        setToiletDistrict(SubDistrictMenu[res.sub_district].district);
      } else {
        setToiletDistrict("");
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        // displayErrorToast(err.response?.data?.message);
        console.log(err);
        return;
      }
    },
  });

  const getToiletAddress = async () => {
    if (toiletMarkerRef.current) {
      await GetAddress({
        longitude: toiletMarkerRef.current.getLngLat().lng,
        latitude: toiletMarkerRef.current.getLngLat().lat,
        language: currentLanguage,
        GOOGLE_API_KEY: GOOGLE_API_KEY,
      });
    }
  };

  const calculateLatOffset = () => {
    if (!mapRef?.current) return 0;

    const bounds = mapRef.current.getBounds();
    const latDiff = bounds.getNorth() - bounds.getSouth();
    return latDiff * LAT_OFFSET_RATIO;
  };

  const updateAddToiletMarkerPosition = () => {
    if (toiletMarkerRef.current && mapRef.current) {
      const center = mapRef.current.getCenter();
      const latOffset = calculateLatOffset();
      toiletMarkerRef.current.setLngLat([center.lng, center.lat + latOffset]);
    }
  };

  useEffect(() => {
    if (!mapRef?.current || !showAddToiletDrawer) return;

    const center = mapRef.current.getCenter();
    const latOffset = calculateLatOffset();

    // Create a draggable marker
    const addToiletImage = ToiletMarkerImage({
      img: "/markers/add_toilet_marker.png",
      size: "24",
    });
    const addToiletMarker = new mapboxgl.Marker({
      element: addToiletImage,
      draggable: true,
    })
      .setLngLat([center.lng, center.lat + latOffset])
      .addTo(mapRef.current);

    toiletMarkerRef.current = addToiletMarker;

    // Add animation of the marker
    const markerElement = addToiletMarker.getElement().querySelector("div");

    const onAnimationStart = () => {
      markerElement.classList.add("translate-y-[-20px]");
    };

    const onAnimationEnd = () => {
      markerElement.classList.remove("translate-y-[-20px]");
    };

    // Update the marker's position as the map moves or zooms
    mapRef.current.on("move", updateAddToiletMarkerPosition);
    mapRef.current.on("zoom", updateAddToiletMarkerPosition);
    mapRef.current.on("moveend", getToiletAddress);
    mapRef.current.on("zoomend", getToiletAddress);

    // Handle marker dragend for manual adjustment
    mapRef.current.on("dragstart", onAnimationStart);
    mapRef.current.on("dragend", async () => {
      onAnimationEnd();
      await getToiletAddress();
    });

    // Cleanup when the drawer is closed
    return () => {
      addToiletMarker.remove(); // Remove marker
      mapRef?.current?.off("move", updateAddToiletMarkerPosition);
      mapRef?.current?.off("zoom", updateAddToiletMarkerPosition);
      mapRef?.current?.off("moveend", getToiletAddress);
      mapRef?.current?.off("zoomend", getToiletAddress);
      addToiletMarker.off("dragstart", onAnimationStart);
      addToiletMarker.off("dragend", onAnimationEnd);
    };
  }, [mapRef, showAddToiletDrawer]);

  return {
    getToiletDetails: () => {
      return {
        address: toiletAddress,
        area: toiletArea,
        district: toiletDistrict,
        sub_district: toiletSubDistrict,
        latitude: toiletMarkerRef?.current?.getLngLat().lat,
        longitude: toiletMarkerRef?.current?.getLngLat().lng,
      };
    },
  };
};

export default useAddToiletMarkerPosition;
