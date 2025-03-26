import { useState } from "react";
import CustomDropdown from "@components/common/Dropdown/CustomDropdown";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import useBannerMenu from "@components/common/Dropdown/DropdownMenu/BannerMenu";
import EditBannerModal from "@components/ProfilePage/Modals/EditBannerModal";

const Banner = ({ userData, isGuest }) => {
  const BannerMenu = useBannerMenu();
  
  const [openEditBannerModal, setOpenEditBannerModal] = useState(false);

  const onMenuItemSelected = () => {
    setOpenEditBannerModal(true);
  };

  return (
    <div className="w-0 md:w-2/12 md:min-w-52 overflow-hidden group">
      {!isGuest && (
        <div className="absolute hidden group-hover:block">
          <CustomDropdown
            buttonStyle="banner-dropdown-btn"
            buttonIcon={<EllipsisHorizontalIcon className="size-5" />}
            dropdownMenu={BannerMenu}
            dropdownMenuVarient="bg-opacity-70"
            dropdownMenuItemVarient="gap-x-2"
            dropdownPosition="m-5"
            onMenuItemSelected={onMenuItemSelected}
          />
        </div>
      )}

      <img
        src={userData?.userBanner}
        alt="User Banner"
        className="object-cover h-full w-full rounded-tr-2xl rounded-br-2xl"
      />

      {openEditBannerModal && (
        <EditBannerModal onCloseModal={() => setOpenEditBannerModal(false)} />
      )}
    </div>
  );
};

export default Banner;
