"use client";

import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import axios from "axios";
import { userLoginSchema } from "@utils/validationSchema/globalSchema";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import CustomButton from "@components/common/Button/CustomButton";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import FontAwesomeIcons from "@components/common/Icons/FontAwesomeIcons";
import login from "@services/users/login";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@contexts/LanguageProvider";
import { useFontSize } from "@contexts/FontSizeProvider";
import { useTheme } from "next-themes";
import loginAsGuest from "@services/users/loginAsGuest";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";

const LoginPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const { changeFontSize } = useFontSize();
  const { _, setTheme } = useTheme();

  const { mutateAsync: loginUser } = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);

      const path =
        res?.data?.role === "admin"
          ? `${WEB_ROUTE_PATHS.user.toiletVerification}/${res?.data?.userId}`
          : `${WEB_ROUTE_PATHS.user.profile}/${res?.data?.userId}`;

      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_URL, path);
      router.push(path);

      changeLanguage({ language: res?.data?.preference_language || "en_us" });
      changeFontSize({ fontSize: res?.data?.preference_font_size || "M" });
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.THEME,
        res?.data?.preference_theme
      );
      setTheme(res?.data?.preference_theme || "light");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const { mutateAsync: LoginAsGuest } = useMutation({
    mutationFn: loginAsGuest,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], res);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CURRENT_URL,
        `${WEB_ROUTE_PATHS.user.profile}/${res.data.userId}`
      );
      changeLanguage({ language: res?.data?.preference_language });
      router.push(`${WEB_ROUTE_PATHS.user.profile}/${res.data.userId}`);
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
      await loginUser(data);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-s1">
      <div className="flex items-center justify-center min-h-screen">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={userLoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, touched }) => (
            <Form className="w-4/5 md:w-2/3 s1 p-8 rounded shadow-lg shadow-shadow">
              <div className="w-full text-center text">
                <h1 className="text-2xl font-bold text">
                  {t("login_page.title")}
                </h1>
              </div>

              <div className="flex flex-col gap-5 mt-5">
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
                    style="login-page-inputfield"
                    varient={
                      errors.email && touched.email
                        ? "border-red-warning-heavy"
                        : "border-black focus:border-blue-light"
                    }
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
                  <CustomFormInputField
                    type="password"
                    name="password"
                    id="password"
                    placeholder={t(
                      "common_phases.form.placeholders.enter_password"
                    )}
                    style="login-page-inputfield"
                    varient={
                      errors.password && touched.password
                        ? "border-red-warning-heavy"
                        : "border-black focus:border-blue-light"
                    }
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-warning-heavy text-sm font-semibold my-1"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Link
                  href={`${WEB_ROUTE_PATHS.forgotPassword}`}
                  className="text-xs font-semibold text-url hover:underline"
                >
                  {t("login_page.forgot_password")}
                </Link>
              </div>

              <div className="flex flex-col item-center justify-center gap-3 mt-5">
                <div className="flex flex-col md:flex-row justify-center items-center gap-y-2 md:gap-x-3.5">
                  <span className="text-sm font-semibold">
                    {t("login_page.no_account.title")}
                  </span>
                  <Link
                    href={`${WEB_ROUTE_PATHS.register}`}
                    className="text-sm font-semibold text-url hover:underline"
                  >
                    {t("login_page.no_account.sign_up")}
                  </Link>
                  <p className="text-sm font-semibold hidden md:block">/</p>
                  <CustomButton
                    type="button"
                    text={t("login_page.no_account.login_as_guest")}
                    textStyles="text-sm font-semibold text-url hover:underline"
                    onClick={async () => await LoginAsGuest()}
                  />
                </div>

                <div className="flex w-full items-center gap-2">
                  <div className="w-1/2 border border-shadow"></div>
                  <p className="text-shadow text-sm font-semibold">
                    {t("login_page.or")}
                  </p>
                  <div className="w-1/2 border border-shadow"></div>
                </div>

                <div className="flex flex-row justify-center gap-10">
                  <FontAwesomeIcons
                    icon="instagram"
                    style="text-3xl"
                    type="button"
                  />
                  <FontAwesomeIcons
                    icon="facebook"
                    style="text-3xl"
                    type="button"
                  />
                  <FontAwesomeIcons
                    icon="google"
                    style="text-3xl"
                    type="button"
                  />
                </div>
              </div>
              <div className="mt-5">
                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  style="login-submit-btn"
                  varient={isSubmitting ? "opacity-30" : ""}
                  text={t("common_phases.button.login")}
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

export default LoginPage;
