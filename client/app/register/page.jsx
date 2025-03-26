"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, ErrorMessage } from "formik";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { userRegisterSchema } from "@utils/validationSchema/globalSchema";
import CustomInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import { useMutation } from "react-query";
import axios from "axios";
import sendEmailVerificationCode from "@services/users/sendEmailVerificationCode";
import { useTranslation } from "react-i18next";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";

const RegisterPage = () => {
  const router = useRouter();
  const { t }= useTranslation();

  const { mutateAsync: sendCode } = useMutation({
    mutationFn: sendEmailVerificationCode,
    onSuccess: (res) => {
      displaySuccessToast(`${res.message} to your email`);
      router.push(WEB_ROUTE_PATHS.registrationVerification);
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
      await sendCode(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-s1">
      <div className="flex items-center justify-center min-h-screen">
        <Formik
          initialValues={{ email: "", password: "", confirmedPassword: "" }}
          validationSchema={userRegisterSchema}
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
                  <h1 className="text-2xl font-bold">{t("register_page.title")}</h1>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-5">
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.email")}
                  </label>
                  <CustomInputField
                    type="email"
                    name="email"
                    id="email"
                    placeholder={t("common_phases.form.placeholders.enter_email")}
                    style="registration-page-inputfield"
                    varient={errors.email && touched.email ? "border-red-warning-heavy" : "border-black focus:border-blue-light"}
                    autoComplete="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.password")}
                  </label>
                  <CustomInputField
                    type="password"
                    name="password"
                    id="password"
                    placeholder={t("common_phases.form.placeholders.enter_password")}
                    style="registration-page-inputfield"
                    varient={errors.password && touched.password ? "border-red-warning-heavy" : "border-black focus:border-blue-light"}
                    autoComplete="new-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="confirmedPassword"
                    className="block text-sm font-semibold"
                  >
                    {t("common_phases.form.labels.confirmed_password")}
                  </label>
                  <CustomInputField
                    type="password"
                    name="confirmedPassword"
                    id="confirmedPassword"
                    placeholder={t("common_phases.form.placeholders.enter_confirmed_password")}
                    style="registration-page-inputfield"
                    varient={errors.confirmedPassword && touched.confirmedPassword ? "border-red-warning-heavy" : "border-black focus:border-blue-light"}
                    autoComplete="new-password"
                  />
                  <ErrorMessage
                    name="confirmedPassword"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>
              </div>

              <div className="mt-10">
                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  style="register-submit-btn"
                  varient={isSubmitting ? "w-full opacity-30" : "w-full"}
                  text={t("common_phases.button.sign_up")}
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

export default RegisterPage;
