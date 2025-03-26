import { GiTwoCoins } from "react-icons/gi";
import CustomButton from "@components/common/Button/CustomButton";
import { useTranslation } from "react-i18next";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";

const RewardsGrid = ({
  userData,
  rewardsData,
  isExchangingRewardId,
  onExchange,
}) => {
  const { t } = useTranslation();
  const currentLanguage =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us"
      : "en_us";

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-7 w-full max-h-[540px] pr-5 ml-3 overflow-y-auto py-3">
      {rewardsData && rewardsData.map((reward) => {
        let isExchanged = false;
        if (userData?.exchange_records?.length > 0) {
          isExchanged = userData.exchange_records.some(
            (record) => record.reward._id === reward.rewardId
          );
        }

        return (
          <div
            key={reward?.rewardId}
            className="flex flex-col justify-between p-5 border rounded-lg shadow-md h-full min-h-[380px]"
          >
            <div className="flex flex-1 justify-center items-center">
              <img
                src={reward?.image}
                alt={`${reward?.name_en} Image`}
                className="h-full w-auto object-contain rounded-md"
              />
            </div>

            <div className="mt-5">
              <div className="flex flex-col items-center text-center">
                <p className="text-lg font-semibold">
                  {currentLanguage === "en_us"
                    ? reward?.name_en
                    : reward?.name_zh}
                </p>
                <p className="text-sm text-s5">
                  {`${t("rewards_page.quantity")}: ${reward?.quantity}`}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-center gap-x-7">
                <div className="flex items-center gap-x-2">
                  <GiTwoCoins className="size-6 text-yellow-500" />
                  <p className="text-sm font-semibold text-s5">
                    {reward?.required_coins}
                  </p>
                </div>
                <CustomButton
                  type="button"
                  style="reward-exchange-btn"
                  varient={
                    isExchanged || isExchangingRewardId === reward?.rewardId
                      ? "opacity-30"
                      : ""
                  }
                  text={isExchanged ? t("rewards_page.redeemed") : t("rewards_page.exchange")}
                  textStyles="text-sm"
                  onClick={async () =>
                    await onExchange({ rewardId: reward?.rewardId })
                  }
                  disabled={
                    isExchanged || isExchangingRewardId === reward?.rewardId
                  }
                  loading={isExchangingRewardId === reward?.rewardId}
                  spinner={true}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RewardsGrid;
