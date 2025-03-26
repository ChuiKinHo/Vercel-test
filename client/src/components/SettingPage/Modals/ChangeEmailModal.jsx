import { useMutation } from "react-query";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Formik, Form, ErrorMessage } from "formik";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import { changeEmailSchema } from "@utils/validationSchema/globalSchema";
import sendChangeEmailLink from "@services/users/sendChangeEmailLink";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";

const ChangeEmailModal = ({ userData, onCloseModal }) => {
  const { t } = useTranslation();

  const { mutateAsync: SendChangeEmailLink } = useMutation({
    mutationFn: sendChangeEmailLink,
    onSuccess: (res) => {
      displaySuccessToast(res?.message);
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
      await SendChangeEmailLink(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal
        title={t("change_email_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        onCloseModal={onCloseModal}
      >
        <Formik
          initialValues={{
            originalEmail: userData?.email,
            newEmail: "",
          }}
          validationSchema={changeEmailSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, touched }) => (
            <Form className="w-full bg-s1 px-8">
              <div className="flex flex-col gap-5 ">
                <div className="space-y-1">
                  <label
                    htmlFor="originalEmail"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.original_email")}
                  </label>
                  <CustomFormInputField
                    type="email"
                    name="originalEmail"
                    id="originalEmail"
                    disabled={true}
                    style="change-email-modal-inputfield-disabled"
                    autoComplete="original-email"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="newEmail"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.new_email")}
                  </label>
                  <CustomFormInputField
                    type="email"
                    name="newEmail"
                    id="newEmail"
                    placeholder={t(
                      "common_phases.form.placeholders.enter_new_email"
                    )}
                    style="change-email-modal-inputfield"
                    varient={
                      errors.newEmail && touched.newEmail
                        ? "border-red-warning-heavy"
                        : "border-black focus:border-blue-light"
                    }
                    autoComplete="new-email"
                  />
                  <ErrorMessage
                    name="newEmail"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>
              </div>

              <div className="mt-8">
                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  style="change-email-modal-submit-btn"
                  varient={isSubmitting ? "opacity-30" : ""}
                  text={t("common_phases.button.enter")}
                  textStyles="font-semibold"
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

export default ChangeEmailModal;
