import React from "react";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import CustomAvatar from "@components/common/Avatar/Avatar";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";

import { useTranslation } from "react-i18next";

const ExchangeRecordsModal = ({ exchangeRecords, onCloseModal }) => {
  const { t } = useTranslation();
  const currentLanguage =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us"
      : "en_us";

  return (
    <Overlay>
      <Modal
        title={t("exchange_records_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5 min-h-[400px]"
      >
        {exchangeRecords.length > 0 && (
          <div className="flex flex-col gap-y-6">
            {exchangeRecords.map((record) => (
              <div
                key={record.recordId}
                className="bg-s2 relative flex items-center gap-x-6 px-3.5 pt-4 pb-5 rounded-lg shadow-md"
              >
                <div className="flex flex-col h-full justify-center w-12 h-12 rounded-full">
                  <CustomAvatar src={record.reward.image} alt="Reward Image" />
                </div>

                <div className="flex flex-col gap-y-2">
                  <p className="text-base font-semibold">
                    {currentLanguage === "en_us"
                      ? record.reward.name_en
                      : record.reward.name_zh}
                  </p>
                  <p className="text-sm text-s6">{`${t(
                    "exchange_records_modal.quantity"
                  )} x1`}</p>
                </div>

                <div className="absolute bottom-1 right-3.5">
                  <p className="text-xs text-s4">
                    {new Date(record.exchanged_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </Overlay>
  );
};

export default ExchangeRecordsModal;
