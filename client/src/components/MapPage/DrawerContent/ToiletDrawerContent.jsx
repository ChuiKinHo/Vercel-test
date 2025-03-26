import { useState, useEffect } from "react";
import CustomButton from "@components/common/Button/CustomButton";
import CustomCarousel from "@components/common/Carousel/CustomCarousel";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import {
  BookmarkIcon as BookmarkIconSolid,
  StarIcon,
  EyeIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import CommentGrid from "../CommentGrid/CommentGrid";
import axios from "axios";
import updateToiletBookmark from "@services/map/updateToiletBookmark";
import ToiletImageLightbox from "../LightBox/ToiletImageLightbox";
import ToiletVideoLightbox from "../LightBox/ToiletVideoLightbox";
import { LiaMaleSolid, LiaFemaleSolid, LiaBathSolid } from "react-icons/lia";
import { TbCameraPlus } from "react-icons/tb";
import { PiWheelchair } from "react-icons/pi";
import { LuShare2 } from "react-icons/lu";
import ToiletDrawerNavigationBar from "../Navigation/toiletDrawerNavigationBar";
import AddToiletMultimediaModal from "../Modals/AddToiletMultimediaModal";
import ShareToiletURLModal from "../Modals/ShareToiletURLModal";
import Env from "@utils/constants/Env";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import LoginRequiredModal from "../Modals/LoginRequiredModal";

const TOILET_DRAWER_NAVIGATION_BUTTON_STATE = {
  MULTIMEDIA: "multimedia",
  COMMENTS: "comments",
};

const ToiletDrawerContent = ({
  userData,
  selectedToilet,
  setSelectedToilet,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [buttonState, setButtonState] = useState(
    TOILET_DRAWER_NAVIGATION_BUTTON_STATE.MULTIMEDIA
  );

  const [overallRating, setOverallRating] = useState(0);
  const [isUserBookmarked, setIsUserBookmarked] = useState(false);

  const [toiletImages, setToiletImages] = useState([]);
  const [toiletVideos, setToiletVideos] = useState([]);

  const [openToiletImageLightbox, setOpenToiletImageLightbox] = useState(false);
  const [openToiletVideoLightbox, setOpenToiletVideoLightbox] = useState(false);
  const [selectedToiletImage, setSelectedToiletImage] = useState(null);
  const [selectedToiletVideo, setSelectedToiletVideo] = useState(null);

  const [openAddToiletMultimediaModal, setOpenAddToiletMultimediaModal] =
    useState(false);
  const [openShareToiletURLModal, setOpenShareToiletURLModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const [shareToiletURL, setShareToiletURL] = useState(
    `${Env.WEB_Production_URL}${WEB_ROUTE_PATHS.map}?toiletId=${selectedToilet?.toiletId}`
  );

  const currentLanguage =
    localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us";

  useEffect(() => {
    if (selectedToilet.multimedia.length > 0) {
      const imagesList = selectedToilet.multimedia.filter(
        (multimedia) => multimedia.multimedia_type !== "video"
      );
      const videosList = selectedToilet.multimedia.filter(
        (multimedia) => multimedia.multimedia_type !== "image"
      );
      setToiletImages(imagesList);
      setToiletVideos(videosList);
    }
  }, [selectedToilet]);

  useEffect(() => {
    if (userData) {
      const isToiletBookmarked = userData.toilet_bookmarks.some(
        (bookmark) => bookmark.toiletId === selectedToilet.toiletId
      );
      setIsUserBookmarked(isToiletBookmarked);
    }
  }, [userData, selectedToilet]);

  useEffect(() => {
    // Calculate rating
    if (selectedToilet?.rating && selectedToilet?.rating.length > 0) {
      const totalRating = selectedToilet.rating.reduce(
        (sum, rating) => sum + rating.value,
        0
      );
      const averageRating = (
        totalRating / selectedToilet?.rating.length
      ).toFixed(1);
      setOverallRating(averageRating);
    }
  }, [selectedToilet]);

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

  const onCarouselClicked = ({ data }) => {
    const selectedMultimedia = selectedToilet?.multimedia.find(
      (multimedia) =>
        multimedia.url === data.url && multimedia.multimedia_type === data.type
    );

    setShareToiletURL(
      `${Env.WEB_Production_URL}${WEB_ROUTE_PATHS.map}?toiletId=${selectedToilet?.toiletId}&multimediaId=${selectedMultimedia?._id}`
    );

    if (data.type === "image") {
      setOpenToiletImageLightbox(true);
      setSelectedToiletImage(selectedMultimedia);
    } else if (data.type === "video") {
      setOpenToiletVideoLightbox(true);
      setSelectedToiletVideo(selectedMultimedia);
    }
  };

  const onAddToiletMultimediaBtnClicked = () => {
    if (userData) {
      setOpenAddToiletMultimediaModal(true);
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  const onBookmarkBtnClicked = async () => {
    if (userData) {
      await UpdateToiletBookmark({
        userId: userData?.userId,
        toiletId: selectedToilet?.toiletId,
      });
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  return (
    <div className="w-full rounded-lg">
      <CustomButton
        type="button"
        style="popup-bookmark-btn"
        varient="absolute top-2 left-2"
        icon={
          isUserBookmarked ? (
            <BookmarkIconSolid className="size-4 text-red-600" />
          ) : (
            <BookmarkIconOutline className="size-4 text-s6 hover:text-s9" />
          )
        }
        onClick={onBookmarkBtnClicked}
      />

      <CustomButton
        type="button"
        style="toilet-share-btn"
        varient="absolute top-2 right-2"
        icon={<LuShare2 className="size-4 text-s6 hover:text-s9" />}
        onClick={() => {
          setShareToiletURL(
            `${Env.WEB_Production_URL}${WEB_ROUTE_PATHS.map}?toiletId=${selectedToilet?.toiletId}`
          );
          setOpenShareToiletURLModal(true);
        }}
      />

      <div className="flex flex-col gap-y-3 items-start w-full">
        <div className="flex w-full items-start justify-between">
          <p className="text-lg font-semibold text-s8 w-3/4">
            {currentLanguage === "zh_tw"
              ? selectedToilet?.name_zh
              : selectedToilet?.name_en}
          </p>
          <CustomButton
            type="button"
            style="toilet-camera-btn"
            varient="w-fit h-fit"
            icon={<TbCameraPlus className="size-5 text-s8" />}
            onClick={onAddToiletMultimediaBtnClicked}
          />
        </div>

        <p className="text-sm text-s5 w-3/4">
          {currentLanguage === "zh_tw"
            ? selectedToilet?.address_zh
            : selectedToilet?.address_en}
        </p>

        <div className="flex gap-x-2 py-2 items-start">
          {selectedToilet?.isMale === "true" && (
            <LiaMaleSolid className="size-5 text-sky-500" />
          )}
          {selectedToilet?.isFemale === "true" && (
            <LiaFemaleSolid className="size-5 text-pink-300" />
          )}
          {selectedToilet?.isDisabled === "true" && (
            <PiWheelchair className="size-5 text-sky-500" />
          )}
          {selectedToilet?.haveBathroom === "true" && (
            <LiaBathSolid className="size-5 text-sky-500" />
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-x-10 justify-center items-center">
        <div className="flex flex-col gap-y-0.5 items-center">
          <p className="text-sm font-medium opacity-40">
            {t("map_page.drawer.rating")}
          </p>
          <div className="flex gap-x-2 items-center">
            <StarIcon className="size-3 text-yellow-400 text-sm" />
            <p className="text-xs font-medium opacity-60">{overallRating}</p>
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
              {selectedToilet?.views}
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
              {selectedToilet?.comments?.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ToiletDrawerNavigationBar
          buttonState={buttonState}
          onMultimediaBtnClick={() =>
            setButtonState(TOILET_DRAWER_NAVIGATION_BUTTON_STATE.MULTIMEDIA)
          }
          onCommentsBtnClick={() =>
            setButtonState(TOILET_DRAWER_NAVIGATION_BUTTON_STATE.COMMENTS)
          }
        />
      </div>

      {selectedToilet &&
        buttonState === TOILET_DRAWER_NAVIGATION_BUTTON_STATE.MULTIMEDIA && (
          <div className="mt-9 flex items-center justify-center">
            <CustomCarousel
              style="add-toilet-drawer-carousel"
              images={toiletImages.map((image) => image.url)}
              videos={toiletVideos.map((video) => video.url)}
              onClick={onCarouselClicked}
            />
          </div>
        )}

      {selectedToilet &&
        buttonState === TOILET_DRAWER_NAVIGATION_BUTTON_STATE.COMMENTS && (
          <div className="mt-6">
            <CommentGrid
              userData={userData}
              selectedToilet={selectedToilet}
              setSelectedToilet={setSelectedToilet}
              setOverallRating={setOverallRating}
            />
          </div>
        )}

      {openToiletImageLightbox && selectedToiletImage && (
        <ToiletImageLightbox
          onCloseLightbox={() => setOpenToiletImageLightbox(false)}
          image={selectedToiletImage}
          setSelectedToilet={setSelectedToilet}
          setOpenShareToiletURLModal={setOpenShareToiletURLModal}
          toiletId={selectedToilet?.toiletId}
        />
      )}

      {openToiletVideoLightbox && selectedToiletVideo && (
        <ToiletVideoLightbox
          onCloseLightbox={() => setOpenToiletVideoLightbox(false)}
          video={selectedToiletVideo}
          setSelectedToilet={setSelectedToilet}
          setOpenShareToiletURLModal={setOpenShareToiletURLModal}
          toiletId={selectedToilet?.toiletId}
        />
      )}

      {openAddToiletMultimediaModal && (
        <AddToiletMultimediaModal
          onCloseModal={() => setOpenAddToiletMultimediaModal(false)}
          selectedToilet={selectedToilet}
        />
      )}

      {openShareToiletURLModal && (
        <ShareToiletURLModal
          onCloseModal={() => setOpenShareToiletURLModal(false)}
          shareToiletURL={shareToiletURL}
        />
      )}

      {showLoginRequiredModal && (
        <LoginRequiredModal
          onCloseModal={() => setShowLoginRequiredModal(false)}
        />
      )}
    </div>
  );
};

export default ToiletDrawerContent;
