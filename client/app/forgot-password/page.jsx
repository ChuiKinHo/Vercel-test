"use client";

import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import axios from "axios";
import { emailSchema } from "@utils/validationSchema/globalSchema";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import sendResetPasswordLink from "@services/users/sendResetPasswordLink";
import { useTranslation } from "react-i18next";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { mutateAsync: sendResetPasswordLinkToUser } = useMutation({
    mutationFn: sendResetPasswordLink,
    onSuccess: (res) => {
      displaySuccessToast(res.message);
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
      await sendResetPasswordLinkToUser(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-s1">
      <div className="flex items-center justify-center min-h-screen">
        <Formik
          initialValues={{ email: "" }}
          validationSchema={emailSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, touched }) => (
            <Form className="w-4/5 md:w-2/3 bg-s1 p-8 rounded shadow-lg shadow-shadow">
              <div className="flex flex-row relative">
                <ChevronLeftIcon
                  onClick={() => router.push(`${WEB_ROUTE_PATHS.login}`)}
                  className="size-7 opacity-50 hover:opacity-100 hover:cursor-pointer absolute"
                />

                <div className="w-full text-center">
                  <span className="text-2xl font-bold">
                    {t("forgot_password_page.title")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-7 mt-5">
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
                    placeholder={t(
                      "common_phases.form.placeholders.enter_email"
                    )}
                    style="forgot-password-page-inputfield"
                    varient={
                      errors.email && touched.email
                        ? "border-red-warning-heavy"
                        : "border-black focus:border-blue-light"
                    }
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>

                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  style="forgot-password-submit-btn"
                  varient={isSubmitting ? "w-full opacity-30" : "w-full"}
                  text={t("common_phases.button.enter")}
                  textStyles="font-semibold"
                  loading={isSubmitting}
                  spinner={true}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
