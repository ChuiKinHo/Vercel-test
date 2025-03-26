import CustomButton from "@components/common/Button/CustomButton";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useMutation } from "react-query";
import getAllNonVerifiedToiletsData from "@services/admin/getAllNonVerifiedToiletsData";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";

const ToiletVerificationToolbar = ({ setRows }) => {
  const { t } = useTranslation();
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const { mutateAsync: GetAllNonVerifiedToiletsData, isLoading } = useMutation({
    mutationFn: getAllNonVerifiedToiletsData,
    onSuccess: (res) => {
      // Format data
      const rowsData = res?.data?.map((data, index) => {
        const mediaCounts = data.multimedia.reduce(
          (acc, media) => {
            if (media.multimedia_type === "image") acc.no_of_images += 1;
            if (media.multimedia_type === "video") acc.no_of_videos += 1;
            return acc;
          },
          { no_of_images: 0, no_of_videos: 0 }
        );

        return {
          id: data.toiletId,
          userAvatar: data.user.userAvatar,
          address: data.address_en ? data.address_en : data.address_zh,
          area: data.area_en ? data.area_en : data.area_zh,
          district: data.district_en ? data.district_en : data.district_zh,
          sub_district: data.sub_district_en
            ? data.sub_district_en
            : data.sub_district_zh,
          type_of_toilet: TypeOfToiletMenu[data.type_of_toilet].name,
          no_of_images: mediaCounts.no_of_images,
          no_of_videos: mediaCounts.no_of_videos,
          isMale: data.isMale,
          isFemale: data.isFemale,
          isDisabled: data.isDisabled,
          haveBathroom: data.haveBathroom,
        };
      });

      setRows(rowsData);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onRefresh = async () => {
    await GetAllNonVerifiedToiletsData();
  };

  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
      }}
    >
      <div className="flex flex-row flex-wrap gap-x-4 md:gap-x-10 p-4">
        <CustomButton
          type="button"
          style="toilet-verification-refresh-btn"
          varient={
            isLoading
              ? "bg-[rgba(29,29,31,0.9)]/10 border-solid border-white"
              : "bg-[rgba(29,29,31,0.9)] border-black border-opacity-100"
          }
          disabled={isLoading}
          icon={
            <ArrowPathIcon
              className={`size-5 ${
                isLoading ? "animate-spin text-text" : "text-s9"
              }`}
            />
          }
          onClick={onRefresh}
        />
      </div>

      <div className="px-5 pb-3 w-full">
        <GridToolbarQuickFilter />
      </div>
    </GridToolbarContainer>
  );
};

export default ToiletVerificationToolbar;
