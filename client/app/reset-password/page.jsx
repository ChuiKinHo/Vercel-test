"use client";

import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient, useMutation } from "react-query";
import axios from "axios";
import { resetPasswordSchema } from "@utils/validationSchema/globalSchema";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";
import resetPassword from "@services/users/resetPassword";
import withAuth from "@layout/ProtectedRoutes/withAuth";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const { t } = useTranslation();

  const token = params.get("token");
  const email = queryClient.getQueryData([
    QUERY_KEYS.USER_RESET_PASSWORD_CREDENTIAL,
    token,
  ])?.data?.email;

  const { mutateAsync: UserResetPassword } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      displaySuccessToast(res.message);
      router.push(WEB_ROUTE_PATHS.login);
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
      await UserResetPassword({ ...data, token });
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-s1">
      <div className="flex items-center justify-center min-h-screen">
        {email && (
          <Formik
            initialValues={{
              email: email ?? "",
              newPassword: "",
              newConfirmedPassword: "",
            }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, isSubmitting, touched }) => (
              <Form className="w-4/5 md:w-2/3 bg-s1 p-8 rounded shadow-lg shadow-shadow">
                <div className="w-full text-center">
                  <span className="text-2xl font-bold">{t("reset_password_page.title")}</span>
                </div>

                <div className="flex flex-col gap-4 mt-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold"
                    >
                      {t("common_phases.form.labels.email")}
                    </label>
                    <CustomFormInputField
                      type="email"
                      name="email"
                      id="email"
                      placeholder={t("common_phases.form.placeholders.enter_email")}
                      disabled={true}
                      style="reset-password-page-inputfield-disabled"
                      autoComplete="email"
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
                      placeholder={t("common_phases.form.placeholders.enter_password")}
                      style="reset-password-page-inputfield"
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
                      placeholder={t("common_phases.form.placeholders.enter_confirmed_password")}
                      style="reset-password-page-inputfield"
                      varient={
                        errors.newConfirmedPassword &&
                        touched.newConfirmedPassword
                          ? "border-red-warning-heavy"
                          : "border-black focus:border-blue-light"
                      }
                      autoComplete="new-password"
                    />
                    <ErrorMessage
                      name="newConfirmedPassword"
                      component="div"
                      className="text-red-warning-heavy text-sm font-semibold my-1"
                    />
                  </div>

                  <div className="mt-3">
                    <CustomButton
                      type="submit"
                      disabled={isSubmitting}
                      style="reset-password-submit-btn"
                      varient={isSubmitting ? "w-full opacity-30" : "w-full"}
                      text={t("common_phases.button.enter")}
                      textStyles="font-semibold"
                      loading={isSubmitting}
                      spinner={true}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default withAuth(ResetPasswordPage);
