import { useMutation } from "react-query";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Formik, Form, ErrorMessage } from "formik";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import { changePasswordSchema } from "@utils/validationSchema/globalSchema";
import changePassword from "@services/users/changePassword";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";

const ChangePasswordModal = ({ onCloseModal }) => {
  const { t } = useTranslation();

  const { mutateAsync: ChangePassword } = useMutation({
    mutationFn: changePassword,
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
      await ChangePassword(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal
        title={t("change_password_modal.title")}
        styles="pb-2 pr-16 -mr-16 my-5"
        onCloseModal={onCloseModal}
      >
        <Formik
          initialValues={{
            originalPassword: "",
            newPassword: "",
            newConfirmedPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, touched }) => (
            <Form className="w-full bg-s1 px-8">
              <div className="flex flex-col gap-5 ">
                <div className="space-y-1">
                  <label
                    htmlFor="originalPassword"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.original_password")}
                  </label>
                  <CustomFormInputField
                    type="password"
                    name="originalPassword"
                    id="originalPassword"
                    placeholder={t(
                      "common_phases.form.placeholders.enter_original_password"
                    )}
                    style="change-password-modal-inputfield"
                    varient={
                      errors.originalPassword && touched.originalPassword
                        ? "border-red-warning-heavy"
                        : "border-black focus:border-blue-light"
                    }
                    autoComplete="original-password"
                  />
                  <ErrorMessage
                    name="originalPassword"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.new_password")}
                  </label>
                  <CustomFormInputField
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    placeholder={t(
                      "common_phases.form.placeholders.enter_new_password"
                    )}
                    style="change-password-modal-inputfield"
                    varient={
                      errors.newPassword && touched.newPassword
                        ? "border-red-warning-heavy"
                        : "border-black focus:border-blue-light"
                    }
                    autoComplete="new-password"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="newConfirmedPassword"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.confirmed_new_password")}
                  </label>
                  <CustomFormInputField
                    type="password"
                    name="newConfirmedPassword"
                    id="newConfirmedPassword"
                    placeholder={t(
                      "common_phases.form.placeholders.enter_confirmed_password"
                    )}
                    style="change-password-modal-inputfield"
                    varient={
                      errors.newConfirmedPassword &&
                      touched.newConfirmedPassword
                        ? "border-red-warning-heavy"
                        : "border-black focus:border-blue-light"
                    }
                    autoComplete="confirmed-new-password"
                  />
                  <ErrorMessage
                    name="newConfirmedPassword"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>
              </div>

              <div className="mt-8">
                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  style="change-password-modal-submit-btn"
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

export default ChangePasswordModal;
