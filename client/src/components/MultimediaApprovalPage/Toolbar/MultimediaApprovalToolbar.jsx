import CustomButton from "@components/common/Button/CustomButton";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useMutation } from "react-query";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import getAllNonVerifiedMultimedia from "@services/admin/getAllNonVerifiedMultimedia";

const MultimediaApprovalToolbar = ({ setRows }) => {
  const { t } = useTranslation();
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const { mutateAsync: GetAllNonVerifiedMultimedia, isLoading } = useMutation({
    mutationFn: getAllNonVerifiedMultimedia,
    onSuccess: (res) => {
      // Format data
      const rowsData = res?.data?.map((data, index) => {
        return {
          id: `${data.toilet._id}-${data.user._id}`,
          userAvatar: data.user.userAvatar,
          no_of_multimedia: data.multimedia.length,
          address: data.toilet.address_en
            ? data.toilet.address_en
            : data.toilet.address_zh,
          area: data.toilet.area_en ? data.toilet.area_en : data.toilet.area_zh,
          district: data.toilet.district_en
            ? data.toilet.district_en
            : data.toilet.district_zh,
          sub_district: data.toilet.sub_district_en
            ? data.toilet.sub_district_en
            : data.toilet.sub_district_zh,
          type_of_toilet: TypeOfToiletMenu[data.toilet.type_of_toilet].name,
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
    await GetAllNonVerifiedMultimedia();
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

export default MultimediaApprovalToolbar;
