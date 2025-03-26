import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import { primaryMarkerImages } from "../Markers/images";
import CustomButton from "@components/common/Button/CustomButton";
import { Formik, Form } from "formik";
import { markerCustomizationSchema } from "@utils/validationSchema/globalSchema";
import axios from "axios";
import changePreferenceMarker from "@services/map/changePreferenceMarker";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";

const MarkerCustomizationModal = ({ onCloseModal, mapRef, userData }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [selectedMarker, setSelectedMarker] = useState(
    userData?.preference_marker || "/markers/toilet_marker_1.png"
  );

  const { mutateAsync: ChangePreferenceMarker } = useMutation({
    mutationFn: changePreferenceMarker,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      displaySuccessToast("Change Marker Successfully");
      onCloseModal();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const handleSubmit = async (data, { setSubmitting }) => {
    setSubmitting(true);
    try {
      await ChangePreferenceMarker(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal
        title={t("marker_customization_modal.title")}
        styles="pb-2 pr-16 -mr-16 mt-5"
        onCloseModal={onCloseModal}
      >
        <Formik
          initialValues={{
            preference_marker: "",
          }}
          validationSchema={markerCustomizationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, isValid }) => (
            <Form>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 justify-center">
                {Object.entries(primaryMarkerImages).map(([key, image]) => (
                  <div
                    key={key}
                    className={`flex flex-col gap-y-6 justify-center items-center shadow-sm min-w-[160px] min-h-[120px] rounded-lg 
                ${
                  selectedMarker === image
                    ? "bg-blue-100 border-2 border-blue-light"
                    : "bg-s2"
                }
            `}
                    onClick={() => {
                      setFieldValue("preference_marker", image);
                      setSelectedMarker(image);
                    }}
                  >
                    <img src={image} alt="Marker Image" className="size-16" />
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <CustomButton
                  type="submit"
                  style="add-toilet-submit-btn"
                  varient={
                    isSubmitting
                      ? "opacity-30"
                      : "hover:bg-transparent hover:text-text hover:border-dashed"
                  }
                  text={t("common_phases.button.submit")}
                  textStyles="font-semibold"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  spinner={true}
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </Overlay>
  );
};

export default MarkerCustomizationModal;
