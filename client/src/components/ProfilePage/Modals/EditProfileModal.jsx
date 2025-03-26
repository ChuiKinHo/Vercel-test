import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useMutation, useQueryClient } from "react-query";
import CustomButton from "@components/common/Button/CustomButton";
import CustomAvatar from "@components/common/Avatar/Avatar";
import { PencilIcon } from "@heroicons/react/24/solid";
import ProfileDetailLabels from "../PersonalProfile/Labels/Labels";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import EditAvatarModal from "./EditAvatarModal";
import { personalDetailsSchema } from "@utils/validationSchema/globalSchema";
import editPersonalDetails from "@services/users/editPersonalDetails";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import { useTranslation } from "react-i18next";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";

const EditProfileModal = ({ userData, personalDetails, onCloseModal }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [initialValues, setInitialValues] = useState(null);
  const [fieldsEditingState, setFieldsEditingState] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openEditAvatarModal, setOpenEditAvatarModal] = useState(false);

  useEffect(() => {
    const updatedInitialValues = {};
    const initializeFieldsEditingState = {};

    Object.entries(personalDetails).forEach(([key, value]) => {
      updatedInitialValues[key] = value?.data;
      initializeFieldsEditingState[key] = false;
    });

    setInitialValues({
      ...updatedInitialValues,
      tel_country_code: userData?.tel_country_code,
      location: userData?.location,
    });

    setFieldsEditingState(initializeFieldsEditingState);
  }, [personalDetails, userData]);

  const setFieldEditingState = ({ key, state }) => {
    fieldsEditingState[key] = state;
    setFieldsEditingState(fieldsEditingState);

    const isFieldsFinishEditing = Object.values(fieldsEditingState).every(
      (state) => state === false
    );
    setIsEditing(!isFieldsFinishEditing);
  };

  const { mutateAsync: EditPersonalDetails } = useMutation({
    mutationFn: editPersonalDetails,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      onCloseModal();
      // displaySuccessToast(res.message);
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
      await EditPersonalDetails(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal
        title={t("edit_information_modal.title")}
        onCloseModal={onCloseModal}
      >
        {initialValues && (
          <Formik
            initialValues={initialValues}
            validationSchema={personalDetailsSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="flex flex-col h-full w-full justify-start items-center gap-y-10 mt-8">
                  <div className="relative w-fit h-fit">
                    <CustomAvatar
                      src={userData?.userAvatar}
                      alt="User Avatar"
                      style="default"
                      varient="size-44 md:size-52"
                    />
                    <div className="absolute bottom-0 left-3/4">
                      <CustomButton
                        type="button"
                        icon={
                          <PencilIcon className="size-5 opacity-70 hover:opacity-100" />
                        }
                        style="profile-page-modal-edit-avatar-btn"
                        onClick={() => setOpenEditAvatarModal(true)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 justify-items-start space-y-10">
                    <ProfileDetailLabels
                      personalDetails={personalDetails}
                      isEditDetailsEnabled={true}
                      setFieldEditingState={setFieldEditingState}
                    />
                  </div>

                  <div className="flex justify-center">
                    <CustomButton
                      type="submit"
                      disabled={isSubmitting || isEditing}
                      style={
                        isSubmitting || isEditing
                          ? "profile-page-modal-submit-btn-disabled"
                          : "profile-page-modal-submit-btn-enabled"
                      }
                      varient={
                        isSubmitting || isEditing
                          ? "opacity-30 bg-s7 border-transparent"
                          : "border-black hover:bg-transparent hover:text-text hover:border-dashed"
                      }
                      text={t("common_phases.button.enter")}
                      loading={isSubmitting}
                      spinner={true}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal>

      {openEditAvatarModal && (
        <EditAvatarModal onCloseModal={() => setOpenEditAvatarModal(false)} />
      )}
    </Overlay>
  );
};

export default EditProfileModal;
