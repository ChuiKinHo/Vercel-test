import { useState, useEffect } from "react";
import CustomSearchBar from "@components/common/SearchBar/CustomSearchBar";
import ProfileDetailLabels from "./Labels/Labels";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import CustomButton from "@components/common/Button/CustomButton";
import CustomTooltip from "@components/common/Tooltips/CustomTooltip";
import AddFriendsModal from "../Modals/AddFriendsModal";
import { useTranslation } from "react-i18next";

const ProfileFriendsDetails = ({ userFriendsData, isGuest }) => {
  const { t } = useTranslation();

  const [searchFriendsResult, setSearchFriendsResult] = useState(null);
  const [openAddFriendsModal, setOpenAddFriendsModal] = useState(false);

  useEffect(() => {
    setSearchFriendsResult(userFriendsData);
  }, [userFriendsData]);

  const onSeachBarChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const searchFriends = userFriendsData.filter(
      (friend) =>
        friend.fullname.toLowerCase().includes(searchText) ||
        friend.username.toLowerCase().includes(searchText)
    );
    setSearchFriendsResult(searchFriends);
  };

  return (
    <div className="pt-5">
      <div className="flex flex-col items-center w-full gap-y-4 md:gap-y-6">
        <div className="flex justify-center gap-x-5 w-full">
          <CustomSearchBar placeholder={t("add_friends_modal.search_bar")} onChange={onSeachBarChange} />
          {!isGuest && (
            <CustomButton
              type="button"
              icon={<UserPlusIcon className="size-6 text-s6" />}
              style="profile-page-add-friends-btn"
              tooltip={
                <CustomTooltip
                  text={t("profile_page.tooltips.add_friends")}
                  textStyle="text-s1 text-xs text-center"
                  varient="mb-4 -translate-x-10"
                  arrowDirection="bottom"
                  placement="top"
                />
              }
              onClick={() => setOpenAddFriendsModal(true)}
            />
          )}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-12 md:gap-y-16 justify-items-center 
                    pl-10 py-8 w-full h-full max-h-[280px] overflow-y-auto md:scroll-bar-appearance"
        >
          <ProfileDetailLabels friendsDetails={searchFriendsResult} />
        </div>

        {openAddFriendsModal && (
          <AddFriendsModal onCloseModal={() => setOpenAddFriendsModal(false)} />
        )}
      </div>
    </div>
  );
};

export default ProfileFriendsDetails;
