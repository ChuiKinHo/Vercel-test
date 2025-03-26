"use client";

import { useState, useEffect } from "react";
import { GiTwoCoins } from "react-icons/gi";
import { useMutation, useQueryClient } from "react-query";
import RewardsGrid from "@components/RewardsPage/RewardsGrid/RewardsGrid";
import withAuth from "@layout/ProtectedRoutes/withAuth";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import RewardsLayout from "@components/RewardsPage/Layout";
import axios from "axios";
import exchangeReward from "@services/users/exchangeReward";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import CustomDropdown from "@components/common/Dropdown/CustomDropdown";
import CustomInputField from "@components/common/InputFiled/CustomInputField";
import useRewardsMenu from "@components/common/Dropdown/DropdownMenu/RewardsMenu";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";
import CustomButton from "@components/common/Button/CustomButton";
import { BsSuitDiamondFill } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa";
import ExchangeRecordsModal from "@components/RewardsPage/Modals/ExchangeRecordsModal";
import RewardTasksModal from "@components/RewardsPage/Modals/RewardTasksModal";
import { useTranslation } from "react-i18next";

const RewardsPage = ({ userData, rewardsData, isGuest, isGuestUser }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const RewardsMenu = useRewardsMenu();

  const [openExchangeRecordsModal, setOpenExchangeRecordsModal] =
    useState(false);
  const [openRewardTasksModal, setOpenRewardTasksModal] = useState(false);

  const [isExchangingRewardId, setIsExchangingRewardId] = useState("");
  const [rewardDropdownValue, setRewardDropdownValue] = useState(
    RewardsMenu.all
  );
  const [rewardGridItems, setRewardGridItems] = useState(rewardsData);

  // console.log("userData", userData);
  // console.log("rewardsData", rewardsData);

  const { mutateAsync: ExchangeReward } = useMutation({
    mutationFn: exchangeReward,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      setIsExchangingRewardId("");
      displaySuccessToast(res.message);
    },
    onError: (err) => {
      setIsExchangingRewardId("");
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onExchange = async ({ rewardId }) => {
    setIsExchangingRewardId(rewardId);
    await ExchangeReward({ rewardId });
  };

  return (
    <RewardsLayout
      userData={userData}
      isGuest={isGuest}
      isGuestUser={isGuestUser}
    >
      <div className="mt-5 md:mt-10 pl-0 md:pl-16">
        <div className="flex flex-col gap-y-7">
          <div className="flex items-center justify-between px-5 ">
            <div className="flex gap-x-5">
              <GiTwoCoins className="size-8 md:size-10 text-yellow-500" />
              <p className="text-2xl md:text-3xl font-bold">
                {userData?.coins}
              </p>
            </div>
          </div>

          <div className="flex gap-x-10 px-7 py-4 w-full bg-s2 rounded-lg">
            <div
              className="flex flex-col gap-y-2"
              onClick={() => setOpenRewardTasksModal(true)}
            >
              <CustomButton
                icon={<BsSuitDiamondFill className="h-5 w-5 text-s6" />}
              />
              <p className="text-xs text-text">{t("rewards_page.tasks")}</p>
            </div>

            <div
              className="flex flex-col gap-y-2"
              onClick={() => setOpenExchangeRecordsModal(true)}
            >
              <CustomButton icon={<FaWpforms className="h-5 w-5 text-s6" />} />
              <p className="text-xs text-text">{t("rewards_page.records")}</p>
            </div>
          </div>

          <div className="flex w-full relative justify-end">
            <CustomInputField
              type="text"
              name="reward"
              id="reward"
              style="reward-dropdown-inputfield"
              varient="text-sm text-s6"
              disabled={true}
              value={rewardDropdownValue.name}
            />
            <div className="absolute top-1.5 right-2">
              <CustomDropdown
                buttonStyle="reward-dropdown-btn"
                buttonIcon={<ChevronDownIcon className="size-5 text-text" />}
                dropdownMenu={RewardsMenu}
                menuWidth="w-32"
                dropdownMenuPosition="right"
                dropdownMenuVarient="mt-2 -mr-2"
                dropdownMenuItemStyle="reward-dropdown-item"
                dropdownMenuItemVarient="gap-x-2 text-s6"
                menuGap={0}
                onMenuItemSelected={(menuItem) => {
                  if (menuItem.value === "all") {
                    setRewardGridItems(rewardsData);
                  } else {
                    const updatedRewardGridItems = rewardsData?.filter(
                      (reward) => reward.category === menuItem.value
                    );
                    setRewardGridItems(updatedRewardGridItems);
                  }
                  setRewardDropdownValue(menuItem);
                }}
              />
            </div>
          </div>

          <div className="mt-2">
            <RewardsGrid
              userData={userData}
              isGuestUser={isGuestUser}
              rewardsData={rewardGridItems}
              isExchangingRewardId={isExchangingRewardId}
              onExchange={onExchange}
            />
          </div>
        </div>
      </div>

      {openExchangeRecordsModal && (
        <ExchangeRecordsModal
          exchangeRecords={userData?.exchange_records}
          onCloseModal={() => setOpenExchangeRecordsModal(false)}
        />
      )}

      {openRewardTasksModal && (
        <RewardTasksModal
          onCloseModal={() => setOpenRewardTasksModal(false)}
          userData={userData}
        />
      )}
    </RewardsLayout>
  );
};

export default withAuth(RewardsPage);
