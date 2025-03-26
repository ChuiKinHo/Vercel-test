import { useState } from "react";
import { useTranslation } from "react-i18next";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import CustomSearchBar from "@components/common/SearchBar/CustomSearchBar";
import FilterModal from "@components/MapPage/Modals/FilterModal";
import ToiletMarkerImage from "../Markers/index";
import {
  StarIcon,
  EyeIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { LiaMaleSolid, LiaFemaleSolid, LiaBathSolid } from "react-icons/lia";
import { PiWheelchair } from "react-icons/pi";
import { TOILET_TOGGLE_STATES } from "@components/common/ToggleButton/ToggleStates";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";

const SEARCH_LIMIT = 8;

const MapSearchDrawerContent = ({
  verified_toiletData,
  userData,
  mapboxgl,
  mapRef,
  markersRef,
  closeAllDrawers,
  setSelectedToilet,
  setPopupPosition,
  UpdateToiletViews,
}) => {
  const { t } = useTranslation();

  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [searchToiletsResult, setSearchToiletsResult] = useState([]);
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const [areaFilterValue, setAreaFilterValue] = useState("");
  const [districtFilterValue, setDistrictFilterValue] = useState("");
  const [subDistrictFilterValue, setSubDistrictFilterValue] = useState("");
  const [typeOfToiletFilterValue, setTypeOfToiletFilterValue] = useState(
    TypeOfToiletMenu.public
  );

  const [isMaleFilterValue, setIsMaleFilterValue] = useState(
    TOILET_TOGGLE_STATES[1]
  );
  const [isFemaleFilterValue, setIsFemaleFilterValue] = useState(
    TOILET_TOGGLE_STATES[1]
  );
  const [isDisabledFilterValue, setIsDisabledFilterValue] = useState(
    TOILET_TOGGLE_STATES[0]
  );
  const [haveBathroomFilterValue, setHaveBathroomFilterValue] = useState(
    TOILET_TOGGLE_STATES[0]
  );

  const onSeachBarChange = (e) => {
    let filteredToilets = verified_toiletData;

    // Select toilet based on filter value
    if (areaFilterValue) {
      filteredToilets = filteredToilets?.filter(
        (toilet) =>
          toilet.area_en === areaFilterValue ||
          toilet.area_zh === areaFilterValue
      );

      if (districtFilterValue) {
        filteredToilets = filteredToilets?.filter(
          (toilet) =>
            toilet.district_en === districtFilterValue ||
            toilet.district_zh === districtFilterValue
        );

        if (subDistrictFilterValue) {
          filteredToilets = filteredToilets?.filter(
            (toilet) =>
              toilet.sub_district_en === subDistrictFilterValue ||
              toilet.sub_district_zh === subDistrictFilterValue
          );
        }
      }
    }
    // Select toilet based on type of toilet
    if (typeOfToiletFilterValue) {
      filteredToilets = filteredToilets?.filter(
        (toilet) => toilet.type_of_toilet === typeOfToiletFilterValue.value
      );
    }

    // Select toilet based on categories
    filteredToilets = filteredToilets.filter(
      (toilet) =>
        (isMaleFilterValue === TOILET_TOGGLE_STATES[0] ||
          toilet.isMale === isMaleFilterValue) &&
        (isFemaleFilterValue === TOILET_TOGGLE_STATES[0] ||
          toilet.isFemale === isFemaleFilterValue) &&
        (isDisabledFilterValue === TOILET_TOGGLE_STATES[0] ||
          toilet.isDisabled === isDisabledFilterValue) &&
        (haveBathroomFilterValue === TOILET_TOGGLE_STATES[0] ||
          toilet.haveBathroom === haveBathroomFilterValue)
    );

    // Select toilet based on search text
    if (e?.target?.value) {
      const searchText = e?.target.value.toLowerCase();
      filteredToilets = filteredToilets?.filter(
        (toilet) =>
          toilet.name_en.toLowerCase().includes(searchText) ||
          toilet.name_zh.includes(searchText)
      );
    }

    // sort the toilet
    const sortedToilets = filteredToilets?.sort((first_toilet, second_toilet) =>
      first_toilet.name_en.localeCompare(second_toilet.name_en)
    );

    console.log(sortedToilets);
    setSearchToiletsResult(sortedToilets);
  };

  const onFilterModalClosed = () => {
    setOpenFilterModal(false);
    onSeachBarChange();
  };

  const onSearchToiletClick = (toilet) => {
    const [longitude, latitude] = toilet?.location.coordinates;

    // Clear the previous markers and Popup
    if (markersRef && markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.remove());
    }
    setSelectedToilet(null);

    // Add Markers
    const markerImage = ToiletMarkerImage({
      img: userData?.preference_marker || "/markers/toilet_marker_1.png",
    });
    const marker = new mapboxgl.Marker({ element: markerImage })
      .setLngLat([longitude, latitude])
      .addTo(mapRef?.current);
    markersRef?.current.push(marker);

    // Display Popup when marker click
    marker.getElement().addEventListener("click", async () => {
      const markerPosition = mapRef?.current.project([longitude, latitude]);

      setPopupPosition({
        x: markerPosition.x,
        y: markerPosition.y - 40,
      });
      closeAllDrawers();

      await UpdateToiletViews({ toiletId: toilet?.toiletId });
    });

    mapRef?.current?.flyTo({
      center: [longitude, latitude],
      zoom: 16,
      bearing: mapRef?.current?.getBearing(),
      speed: 1.7,
    });

    closeAllDrawers();
  };

  return (
    <div className="flex flex-col">
      <div className="w-full rounded-lg">
        <CustomSearchBar
          placeholder={t("map_page.drawer.search_a_toilet")}
          onChange={onSeachBarChange}
          style="map-toilet-search-bar"
          enableFilter={true}
          filterModal={
            <FilterModal
              onCloseModal={onFilterModalClosed}
              setAreaFilterValue={setAreaFilterValue}
              setDistrictFilterValue={setDistrictFilterValue}
              setSubDistrictFilterValue={setSubDistrictFilterValue}
              setTypeOfToiletFilterValue={setTypeOfToiletFilterValue}
              setIsMaleFilterValue={setIsMaleFilterValue}
              setIsFemaleFilterValue={setIsFemaleFilterValue}
              setIsDisabledFilterValue={setIsDisabledFilterValue}
              setHaveBathroomFilterValue={setHaveBathroomFilterValue}
              areaFilterValue={areaFilterValue}
              districtFilterValue={districtFilterValue}
              subDistrictFilterValue={subDistrictFilterValue}
              typeOfToiletFilterValue={typeOfToiletFilterValue}
              isMaleFilterValue={isMaleFilterValue}
              isFemaleFilterValue={isFemaleFilterValue}
              isDisabledFilterValue={isDisabledFilterValue}
              haveBathroomFilterValue={haveBathroomFilterValue}
            />
          }
          setOpenFilterModal={setOpenFilterModal}
          openFilterModal={openFilterModal}
        />
      </div>

      <div className="ml-2 mt-8 h-full max-h-[620px] overflow-y-auto pr-8">
        {searchToiletsResult?.length > 0 &&
          searchToiletsResult.slice(0, SEARCH_LIMIT).map((toilet, index) => (
            <div
              key={`${toilet.toiletId}`}
              className="relative mb-8 w-full py-3 pl-10 pr-6 hover:bg-s2 rounded-lg shadow-md"
              onClick={() => onSearchToiletClick(toilet)}
            >
              <div className="flex flex-col gap-y-3">
                <p className="text-lg font-semibold text-s8">
                  {currentLanguage === "zh_tw"
                    ? toilet.name_zh
                    : toilet.name_en}
                </p>
                <p className="text-sm text-s5">
                  {currentLanguage === "zh_tw"
                    ? toilet.address_zh
                    : toilet.address_en}
                </p>

                <div className="flex gap-x-2 items-start">
                  {toilet?.isMale === "true" && (
                    <LiaMaleSolid className="size-5 text-sky-500" />
                  )}
                  {toilet?.isFemale === "true" && (
                    <LiaFemaleSolid className="size-5 text-pink-300" />
                  )}
                  {toilet?.isDisabled === "true" && (
                    <PiWheelchair className="size-5 text-sky-500" />
                  )}
                  {toilet?.haveBathroom === "true" && (
                    <LiaBathSolid className="size-5 text-sky-500" />
                  )}
                </div>

                <div className="mt-3 flex gap-x-6 items-center">
                  <div className="flex flex-col gap-y-0.5 items-center">
                    <p className="text-sm font-medium opacity-40">
                      {t("map_page.drawer.rating")}
                    </p>
                    <div className="flex gap-x-2 items-center">
                      <StarIcon className="size-3 text-yellow-400 text-sm" />
                      <p className="text-xs font-medium opacity-60">0</p>
                    </div>
                  </div>
                  <div className="border border-s3 h-8"></div>

                  <div className="flex flex-col gap-y-0.5 items-center">
                    <p className="text-sm font-medium opacity-40">
                      {t("map_page.drawer.views")}
                    </p>
                    <div className="flex gap-x-2 items-center">
                      <EyeIcon className="size-3 text-sm opacity-40 " />
                      <p className="text-xs font-medium opacity-60">
                        {toilet?.views}
                      </p>
                    </div>
                  </div>
                  <div className="border border-s3 h-8"></div>

                  <div className="flex flex-col gap-y-0.5 items-center">
                    <p className="text-sm font-medium opacity-40">
                      {t("map_page.drawer.comments")}
                    </p>
                    <div className="flex gap-x-2 items-center">
                      <ChatBubbleBottomCenterTextIcon className="size-3 text-sm opacity-40" />
                      <p className="text-xs font-medium opacity-60">
                        {toilet?.comments?.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MapSearchDrawerContent;
