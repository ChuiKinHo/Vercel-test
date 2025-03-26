import { useTranslation } from "react-i18next";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import {
  StarIcon,
  EyeIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import { BookmarkSlashIcon } from "@heroicons/react/24/outline";
import CustomButton from "@components/common/Button/CustomButton";
import updateToiletBookmark from "@services/map/updateToiletBookmark";
import ToiletMarkerImage from "../Markers/index";
import { LiaMaleSolid, LiaFemaleSolid, LiaBathSolid } from "react-icons/lia";
import { PiWheelchair } from "react-icons/pi";

const BookmarkDrawerContent = ({
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
  const queryClient = useQueryClient();

  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  const { mutateAsync: UpdateToiletBookmark } = useMutation({
    mutationFn: updateToiletBookmark,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onBookmarkClick = (bookmark) => {
    const [longitude, latitude] = bookmark?.location.coordinates;

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

      await UpdateToiletViews({ toiletId: bookmark?.toiletId });
    });

    mapRef?.current?.flyTo({
      center: [longitude, latitude],
      zoom: 16,
      bearing: mapRef?.current?.getBearing(),
      speed: 1.7,
    });

    closeAllDrawers();
  };

  const onCancelToiletBookmark = async ({ e, toiletId, userId }) => {
    e.stopPropagation();
    await UpdateToiletBookmark({ toiletId, userId });
  };

  return (
    <div className="w-full rounded-lg">
      <p className="text-center font-bold text-2xl">
        {t("map_page.drawer.bookmark")}
      </p>

      {userData?.toilet_bookmarks.length > 0 && (
        <div className="ml-2 mt-8 max-h-[620px] overflow-y-auto pr-8">
          {userData?.toilet_bookmarks.map((bookmark) => (
            <div
              key={`${bookmark.toiletId}`}
              className="relative mb-8 w-full py-3 pl-10 pr-6 hover:bg-s2/20 rounded-lg shadow-md"
              onClick={() => onBookmarkClick(bookmark)}
            >
              <div className="absolute left-2 top-2">
                <CustomButton
                  type="button"
                  style="popup-bookmark-btn"
                  varient="p-1.5"
                  icon={<BookmarkSlashIcon className="size-4" />}
                  onClick={(e) =>
                    onCancelToiletBookmark({
                      e,
                      toiletId: bookmark?.toiletId,
                      userId: userData?.userId,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-y-3">
                <p className="text-lg font-semibold text-s8">
                  {currentLanguage === "zh_tw"
                    ? bookmark.name_zh
                    : bookmark.name_en}
                </p>
                <p className="text-sm text-s5">
                  {currentLanguage === "zh_tw"
                    ? bookmark.address_zh
                    : bookmark.address_en}
                </p>

                <div className="flex gap-x-2 items-start">
                  {bookmark?.isMale === "true" && (
                    <LiaMaleSolid className="size-5 text-sky-500" />
                  )}
                  {bookmark?.isFemale === "true" && (
                    <LiaFemaleSolid className="size-5 text-pink-300" />
                  )}
                  {bookmark?.isDisabled === "true" && (
                    <PiWheelchair className="size-5 text-sky-500" />
                  )}
                  {bookmark?.haveBathroom === "true" && (
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
                        {bookmark?.views}
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
                        {bookmark?.comments?.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkDrawerContent;
