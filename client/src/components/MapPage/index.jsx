import React, { useRef, useState, useEffect } from "react";
import Env from "@utils/constants/Env";
import { useMutation } from "react-query";
import getSearchPath from "@services/map/getSearchPath";
import getToiletsLocationNearby from "@services/map/getToiletsLocationNearby";
import updateToiletViews from "@services/map/updateToiletViews";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import ToiletDetailsPopup from "@components/MapPage/Popup/ToiletDetails";
import { displayErrorToast } from "@components/common/Toast/CustomToast";
import useGeolocation from "@components/MapPage/hook/useGeolocation";
import useMapInitialization from "@components/MapPage/hook/useMapInitialization";
import useRealtimeLocation from "@components/MapPage/hook/useRealtimeLocation";
import CustomDrawer from "@components/common/Drawer/CustomDrawer";
import usePopupPosition from "@components/MapPage/hook/usePopupPosition";
import ToiletDrawerContent from "@components/MapPage/DrawerContent/ToiletDrawerContent";
import CustomButton from "@components/common/Button/CustomButton";
import GEOLOCATION_STATUS from "@utils/constants/GeolocationStatus";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MdMyLocation, MdOutlineLocationSearching } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import MapSettingDrawerContent from "@components/MapPage/DrawerContent/MapSettingDrawerContent";
import BookmarkDrawerContent from "@components/MapPage/DrawerContent/BookmarkDrawerContent";
import MapSearchDrawerContent from "./DrawerContent/MapSearchDrawerContent";
import AddToiletDrawerContent from "./DrawerContent/AddToiletDrawerContent";
import MapNavigationBar from "./Navigation/MapNavigationBar";
import useAddToiletMarkerPosition from "./hook/useAddToiletMarkerPosition";
import AddToiletSuccessDrawerContent from "./DrawerContent/AddToiletSuccessDrawerContent";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import ToiletMarkerImage from "./Markers";
import { secondaryMarkerImages } from "./Markers/images";
import LoginRequiredModal from "@components/MapPage/Modals/LoginRequiredModal";
import ToiletImageLightbox from "./LightBox/ToiletImageLightbox";
import ToiletVideoLightbox from "./LightBox/ToiletVideoLightbox";
import ShareToiletURLModal from "./Modals/ShareToiletURLModal";

mapboxgl.accessToken = Env.Mapbox_Access_Token;
const GOOGLE_API_KEY = Env.GOOGLE_API_KEY;

const MAP_NAVIGATION_BUTTON_STATE = {
  HOME: "home",
  BOOKMARK: "bookmark",
  ADD_TOILET: "add-toilet",
  SETTING: "setting",
  DEFAULT: "map",
};

const MapComponent = ({ userData, isGuestUser, verified_toiletData }) => {
  const router = useRouter();

  const params = useSearchParams();
  const toiletId = params.get("toiletId");
  const multimediaId = params.get("multimediaId");

  const [nearbyCircleRadius, setNearbyCircleRadius] = useState(300);
  const [currentLng, setCurrentLng] = useState(null);
  const [currentLat, setCurrentLat] = useState(null);
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [destinatedToilet, setDestinatedToilet] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [is3DModeEnabled, setIs3DModeEnabled] = useState(false);

  const [showMapSettingDrawer, setShowMapSettingDrawer] = useState(false);
  const [showBookmarkDrawer, setShowBookmarkDrawer] = useState(false);
  const [showMapSearchBarDrawer, setShowMapSearchBarDrawer] = useState(false);
  const [showToiletDrawer, setShowToiletDrawer] = useState(false);
  const [showAddToiletDrawer, setShowAddToiletDrawer] = useState(false);

  const [navigationButtonState, setNavigationButtonState] = useState(
    MAP_NAVIGATION_BUTTON_STATE.DEFAULT
  );

  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [showAddToiletSuccessDrawer, setShowAddToiletSuccessDrawer] =
    useState(false);

  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [openToiletImageLightbox, setOpenToiletImageLightbox] = useState(false);
  const [openToiletVideoLightbox, setOpenToiletVideoLightbox] = useState(false);
  const [selectedToiletImage, setSelectedToiletImage] = useState(null);
  const [selectedToiletVideo, setSelectedToiletVideo] = useState(null);
  const [openShareToiletURLModal, setOpenShareToiletURLModal] = useState(false);
  const [shareToiletURL, setShareToiletURL] = useState(
    `${Env.WEB_Production_URL}${WEB_ROUTE_PATHS.map}${
      toiletId && `?toiletId=${toiletId}`
    }${multimediaId && `&multimediaId=${multimediaId}`}`
  );

  const mapSettingDrawerRef = useRef(null);
  const toiletDrawerRef = useRef(null);
  const bookmarkDrawerRef = useRef(null);
  const mapSearchBarDrawerRef = useRef(null);
  const addToiletDrawerRef = useRef(null);

  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);

  const clickedMarkers = useRef(new Set());
  const lastClickedMarkerRef = useRef(null); // Store the last clicked marker

  const closeAllDrawers = () => {
    setShowBookmarkDrawer(false);
    setShowMapSettingDrawer(false);
    setShowMapSearchBarDrawer(false);
    setShowToiletDrawer(false);
    setShowAddToiletDrawer(false);
    setIsNavigationVisible(true);
  };

  const { mutateAsync: UpdateToiletViews } = useMutation({
    mutationFn: updateToiletViews,
    onSuccess: (res) => {
      console.log(res.data);
      setSelectedToilet(res.data);

      closeAllDrawers();
      setShowToiletDrawer(true);
      setNavigationButtonState(MAP_NAVIGATION_BUTTON_STATE.DEFAULT);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const { mutateAsync: GetToiletsLocationNearby } = useMutation({
    mutationFn: getToiletsLocationNearby,
    onSuccess: (res) => {
      // Remove old markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      res.data.forEach((toilet) => {
        const [longitude, latitude] = toilet.location.coordinates;

        const markerImage = ToiletMarkerImage({
          img: userData?.preference_marker || "/markers/toilet_marker_1.png",
        });
        const marker = new mapboxgl.Marker({ element: markerImage })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);

        markersRef.current.push(marker);

        const markerImageElement = marker.getElement().querySelector("img");

        marker.getElement().addEventListener("click", async () => {
          // Reset the last clicked marker to default image
          if (
            lastClickedMarkerRef.current &&
            lastClickedMarkerRef.current !== markerImageElement
          ) {
            lastClickedMarkerRef.current.src =
              userData?.preference_marker || "/markers/toilet_marker_1.png"; // Reset to default
            lastClickedMarkerRef.current.dataset.clicked = "false";
          }

          //  Toggle clicked marker image
          const isClicked = markerImageElement.dataset.clicked === "true";
          if (isClicked) {
            setSelectedToilet(null);
            setIsNavigationVisible(true);
            lastClickedMarkerRef.current = null;
            markerImageElement.src =
              userData?.preference_marker || "/markers/toilet_marker_1.png";
          } else {
            markerImageElement.src =
              secondaryMarkerImages[userData?.preference_marker] ||
              "/markers/toilet_marker_1_clicked.png";
            lastClickedMarkerRef.current = markerImageElement;
            const markerPosition = mapRef.current.project([
              longitude,
              latitude,
            ]);

            setPopupPosition({
              x: markerPosition.x,
              y: markerPosition.y - 40,
            });
            closeAllDrawers();

            const isMarkerClicked = clickedMarkers.current.has(toilet.toiletId);
            if (!isMarkerClicked) {
              clickedMarkers.current.add(toilet.toiletId);
            }

            await UpdateToiletViews({
              toiletId: toilet.toiletId,
              update: !isMarkerClicked,
            });
          }

          markerImageElement.dataset.clicked = isClicked ? "false" : "true";
        });
      });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const { mutateAsync: GetSearchPath } = useMutation({
    mutationFn: getSearchPath,
    onSuccess: (res) => {
      const route = res.routes[0]?.geometry.coordinates;
      if (route) {
        if (mapRef.current.getSource("route")) {
          mapRef.current.getSource("route").setData({
            type: "Feature",
            geometry: { type: "LineString", coordinates: route },
          });
        } else {
          mapRef.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { type: "LineString", coordinates: route },
            },
          });
          mapRef.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#3887be",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });
        }
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  /* Grab the current GPS location once*/
  useRealtimeLocation({ setCurrentLat, setCurrentLng });

  /* Initialize the map */
  const { mapRef, geolocationRef } = useMapInitialization({
    mapContainerRef,
    is3DModeEnabled,
  });

  /* Dynamically move the Popup when dragging the map */
  usePopupPosition({ mapRef, selectedToilet, setPopupPosition });

  /* Search nearby toilet */
  const { stopGeolocation, startGeolocation, geolocationStatus } =
    useGeolocation({
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
    });

  const { getToiletDetails } = useAddToiletMarkerPosition({
    mapRef,
    showAddToiletDrawer,
    setShowAddToiletDrawer,
    GOOGLE_API_KEY,
  });

  // Actual change of the map language
  const changeMapLanguage = (language) => {
    const layers = mapRef.current.getStyle()?.layers;
    if (!layers) return;

    layers.forEach((layer) => {
      if (
        layer.type === "symbol" &&
        layer.layout &&
        layer.layout["text-field"]
      ) {
        mapRef.current.setLayoutProperty(layer.id, "text-field", [
          "get",
          `name_${language}`,
        ]);
      }
    });
  };

  const updateMapLanguage = (language) => {
    // If current map is not initiated, why are we changing the language anyway?
    if (!mapRef?.current) return;

    // If style is not loaded yet, set to change it once when it is loaded.
    if (!mapRef.current.isStyleLoaded()) {
      mapRef.current.once("style.load", () => {
        changeMapLanguage(language);
      });
      // If style is loaded, change it immediately.
    } else {
      changeMapLanguage(language);
    }
  };

  const onRouteClick = async () => {
    const marker_coordinate = [
      selectedToilet?.location.coordinates[0],
      selectedToilet?.location.coordinates[1],
    ];

    if (currentLng && currentLat) {
      await GetSearchPath({
        start: [currentLng, currentLat],
        end: marker_coordinate,
        accessToken: mapboxgl.accessToken,
      });

      mapRef.current.flyTo({
        center: marker_coordinate,
        zoom: 16,
        speed: 1.5,
      });

      setDestinatedToilet(selectedToilet);
      setSelectedToilet(null);
      toiletDrawerRef?.current?.resetToCloseHeight();
    } else {
      console.error("Current location not available");
    }
  };

  const onGeolocationClick = () => {
    closeAllDrawers();
    setNavigationButtonState(MAP_NAVIGATION_BUTTON_STATE.DEFAULT);
    setDestinatedToilet(null);
    setSelectedToilet(null);
    setIs3DModeEnabled(false);

    // trigger the geolocate event listener
    startGeolocation();
  };

  const onClosePopup = () => {
    setSelectedToilet(null);
    setShowAddToiletDrawer(false);
    closeAllDrawers();
  };

  const onHomeBtnClick = () => {
    if (userData) {
      setNavigationButtonState(MAP_NAVIGATION_BUTTON_STATE.DEFAULT);
      mapRef.current.remove();
      mapRef.current = null;
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CURRENT_URL,
        `${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`
      );
      router.push(`${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`);
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  const onMapSettingBtnClick = () => {
    closeAllDrawers();
    setShowMapSettingDrawer(true);
    setNavigationButtonState(MAP_NAVIGATION_BUTTON_STATE.SETTING);
    mapSettingDrawerRef?.current?.resetToMinHeight();
  };

  const onBookmarkBtnClick = () => {
    closeAllDrawers();
    if (userData) {
      setShowBookmarkDrawer(true);
      setNavigationButtonState(MAP_NAVIGATION_BUTTON_STATE.BOOKMARK);
      bookmarkDrawerRef?.current?.resetToMinHeight();
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  const onSearchBtnClick = () => {
    closeAllDrawers();
    setShowMapSearchBarDrawer(true);
    setNavigationButtonState(MAP_NAVIGATION_BUTTON_STATE.DEFAULT);
    mapSearchBarDrawerRef?.current?.resetToMinHeight();
  };

  const onAddToiletBtnClick = () => {
    closeAllDrawers();

    if (userData) {
      setShowAddToiletDrawer(true);
      setPopupPosition(null);
      setSelectedToilet(null);
      setDestinatedToilet(null);

      // stop the geolocating
      stopGeolocation();

      // Remove the markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      setNavigationButtonState(MAP_NAVIGATION_BUTTON_STATE.ADD_TOILET);
      addToiletDrawerRef?.current?.resetToMinHeight();
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  const onDrawerStateChange = ({ isClosed }) => {
    setIsNavigationVisible(isClosed);
  };

  useEffect(() => {
    updateMapLanguage(
      userData?.preference_language === "en_us" ? "en" : "zh-Hant"
    );
  }, []);

  // Initialize once when share toilet URL is clicked
  useEffect(() => {
    const targetToilet = verified_toiletData?.find(
      (toilet) => toilet.toiletId === toiletId
    );

    if (targetToilet) {
      const [longitude, latitude] = targetToilet.location.coordinates;

      // Add Markers
      const markerImage = ToiletMarkerImage({
        img: userData?.preference_marker || "/markers/toilet_marker_1.png",
      });
      const marker = new mapboxgl.Marker({ element: markerImage })
        .setLngLat([longitude, latitude])
        .addTo(mapRef?.current);

      markersRef?.current.push(marker);
      const markerImageElement = marker.getElement().querySelector("img");

      // Display Popup when marker click
      marker.getElement().addEventListener("click", async () => {
        if (
          lastClickedMarkerRef.current &&
          lastClickedMarkerRef.current !== markerImageElement
        ) {
          lastClickedMarkerRef.current.src =
            userData?.preference_marker || "/markers/toilet_marker_1.png"; // Reset to default
          lastClickedMarkerRef.current.dataset.clicked = "false";
        }

        //  Toggle clicked marker image
        const isClicked = markerImageElement.dataset.clicked === "true";
        if (isClicked) {
          setSelectedToilet(null);
          setIsNavigationVisible(true);
          lastClickedMarkerRef.current = null;
          markerImageElement.src =
            userData?.preference_marker || "/markers/toilet_marker_1.png";
        } else {
          markerImageElement.src =
            secondaryMarkerImages[userData?.preference_marker] ||
            "/markers/toilet_marker_1_clicked.png";
          lastClickedMarkerRef.current = markerImageElement;
          const markerPosition = mapRef.current.project([longitude, latitude]);

          setPopupPosition({
            x: markerPosition.x,
            y: markerPosition.y - 40,
          });

          const isMarkerClicked = clickedMarkers.current.has(toiletId);
          if (!isMarkerClicked) {
            clickedMarkers.current.add(toiletId);
          }

          await UpdateToiletViews({ toiletId: toiletId });
        }

        markerImageElement.dataset.clicked = isClicked ? "false" : "true";
      });

      mapRef?.current?.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        bearing: mapRef?.current?.getBearing(),
        speed: 1.7,
      });

      marker.getElement().click();

      // Check if query params have multimediaId
      if (multimediaId) {
        const multimedia = targetToilet.multimedia.find(
          (multimedia) => multimedia._id === multimediaId
        );

        if (multimedia) {
          if (multimedia.multimedia_type === "image") {
            setSelectedToiletImage(multimedia);
            setOpenToiletImageLightbox(true);
          } else if (multimedia.multimedia_type === "video") {
            setSelectedToiletVideo(multimedia);
            setOpenToiletVideoLightbox(true);
          }
        }
      }
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="relative"
      style={{ width: "100%", height: "100vh" }}
    >
      <MapNavigationBar
        buttonState={navigationButtonState}
        onHomeBtnClick={onHomeBtnClick}
        onBookmarkBtnClick={onBookmarkBtnClick}
        onAddToiletBtnClick={onAddToiletBtnClick}
        onMapSettingBtnClick={onMapSettingBtnClick}
        isNavigationVisible={isNavigationVisible}
      />

      <div className="absolute flex flex-col gap-y-4 bottom-36 right-4 z-10">
        <CustomButton
          type="button"
          style="map-search-btn"
          varient="bg-s1"
          icon={<MagnifyingGlassIcon className="size-5 text-s9" />}
          onClick={onSearchBtnClick}
        />

        <CustomButton
          type="button"
          style="popup-geolocation-btn"
          icon={
            geolocationStatus === GEOLOCATION_STATUS.loading ? (
              <MdOutlineLocationSearching
                className="size-5 text-blue-400 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <MdMyLocation
                className={`size-5 ${
                  geolocationStatus === GEOLOCATION_STATUS.found
                    ? "text-blue-400"
                    : "text-s9"
                }`}
              />
            )
          }
          onClick={onGeolocationClick}
        />
      </div>

      {selectedToilet && popupPosition && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full z-0"
          style={{ left: `${popupPosition.x}px`, top: `${popupPosition.y}px` }}
        >
          <ToiletDetailsPopup
            toilet={selectedToilet}
            onClosePopup={onClosePopup}
            onRouteClick={onRouteClick}
          />
        </div>
      )}

      {showMapSettingDrawer && (
        <CustomDrawer
          content={
            <MapSettingDrawerContent
              userData={userData}
              initialNearbyCircleRadius={nearbyCircleRadius}
              setNearbyCircleRadius={setNearbyCircleRadius}
              mapRef={mapRef}
              longitude={currentLng}
              latitude={currentLat}
              is3DModeEnabled={is3DModeEnabled}
              updateMapLanguage={updateMapLanguage}
            />
          }
          ref={mapSettingDrawerRef}
          onStateChange={onDrawerStateChange}
        />
      )}

      {showToiletDrawer && (selectedToilet || destinatedToilet) && (
        <CustomDrawer
          content={
            <ToiletDrawerContent
              selectedToilet={selectedToilet || destinatedToilet}
              setSelectedToilet={setSelectedToilet}
              userData={userData}
            />
          }
          onStateChange={onDrawerStateChange}
          ref={toiletDrawerRef}
        />
      )}

      {showBookmarkDrawer && userData && (
        <CustomDrawer
          content={
            <BookmarkDrawerContent
              userData={userData}
              mapboxgl={mapboxgl}
              mapRef={mapRef}
              markersRef={markersRef}
              closeAllDrawers={closeAllDrawers}
              setSelectedToilet={setSelectedToilet}
              setPopupPosition={setPopupPosition}
              UpdateToiletViews={UpdateToiletViews}
            />
          }
          onStateChange={onDrawerStateChange}
          ref={bookmarkDrawerRef}
        />
      )}

      {showMapSearchBarDrawer && verified_toiletData && (
        <CustomDrawer
          content={
            <MapSearchDrawerContent
              verified_toiletData={verified_toiletData}
              userData={userData}
              mapboxgl={mapboxgl}
              mapRef={mapRef}
              markersRef={markersRef}
              closeAllDrawers={closeAllDrawers}
              setSelectedToilet={setSelectedToilet}
              setPopupPosition={setPopupPosition}
              UpdateToiletViews={UpdateToiletViews}
            />
          }
          onStateChange={onDrawerStateChange}
          ref={mapSearchBarDrawerRef}
        />
      )}

      {showAddToiletDrawer && userData && (
        <CustomDrawer
          content={
            !showAddToiletSuccessDrawer ? (
              <AddToiletDrawerContent
                userData={userData}
                getToiletDetails={getToiletDetails}
                setShowAddToiletSuccessDrawer={setShowAddToiletSuccessDrawer}
                closeAllDrawers={closeAllDrawers}
              />
            ) : (
              <AddToiletSuccessDrawerContent
                setShowAddToiletSuccessDrawer={setShowAddToiletSuccessDrawer}
              />
            )
          }
          onStateChange={onDrawerStateChange}
          ref={addToiletDrawerRef}
        />
      )}

      {showLoginRequiredModal && (
        <LoginRequiredModal
          onCloseModal={() => setShowLoginRequiredModal(false)}
        />
      )}

      {openToiletImageLightbox &&
        selectedToiletImage &&
        toiletId &&
        multimediaId && (
          <ToiletImageLightbox
            onCloseLightbox={() => setOpenToiletImageLightbox(false)}
            image={selectedToiletImage}
            setSelectedToilet={setSelectedToilet}
            setOpenShareToiletURLModal={setOpenShareToiletURLModal}
            toiletId={toiletId}
          />
        )}

      {openToiletVideoLightbox &&
        selectedToiletVideo &&
        toiletId &&
        multimediaId && (
          <ToiletVideoLightbox
            onCloseLightbox={() => setOpenToiletVideoLightbox(false)}
            video={selectedToiletVideo}
            setSelectedToilet={setSelectedToilet}
            setOpenShareToiletURLModal={setOpenShareToiletURLModal}
            toiletId={toiletId}
          />
        )}

      {openShareToiletURLModal && (
        <ShareToiletURLModal
          onCloseModal={() => setOpenShareToiletURLModal(false)}
          shareToiletURL={shareToiletURL}
        />
      )}
    </div>
  );
};

export default MapComponent;
