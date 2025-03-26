"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import CustomButton from "@components/common/Button/CustomButton";
import register from "@services/users/register";
import verifyCode from "@services/users/verifyCode";
import resendEmailVerificationCode from "@services/users/resendEmailVerificationCode";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import { useMutation } from "react-query";
import axios from "axios";
import { codeVerificationSchema } from "@utils/validationSchema/globalSchema";
import CustomVerificationInputField from "@components/common/InputFiled/CustomVerificationInputField";
import { useTranslation } from "react-i18next";
import {
  displaySuccessToast,
  displayErrorToast,
} from "@components/common/Toast/CustomToast";
import withAuth from "@layout/ProtectedRoutes/withAuth";

const EmailVerificationPage = () => {
  const router = useRouter();
  const { t }= useTranslation();

  const emailValidationInputRefs = useRef([]);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isResendButtonEnabled, setIsResendButtonEnabled] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const { mutateAsync: registerNewUser } = useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      displaySuccessToast(res.message);
      router.push(WEB_ROUTE_PATHS.login);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
      }
    },
  });

  const { mutateAsync: verifyUserCode } = useMutation({
    mutationFn: verifyCode,
    onSuccess: async (res) => {
      await registerNewUser();
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.data.message === "Cookie Not Found") {
          displayErrorToast("User Registration Timeout");
          router.push(`${WEB_ROUTE_PATHS.register}`);
          return;
        }

        displayErrorToast(err.response?.data.message)
        if (err.response?.data.message === "Internal Server Error") {
          router.push(`${WEB_ROUTE_PATHS.register}`);
          return;
        }
      }
    },
  });

  const { mutateAsync: resendCode } = useMutation({
    mutationFn: resendEmailVerificationCode,
    onSuccess: (res) => {
      displaySuccessToast(res.message);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.data.message === `Cookie Not Found`) {
          displayErrorToast("User Registration Timeout");
          router.push(WEB_ROUTE_PATHS.register);
          return;
        }

        if (err.response?.data.message === `Verification Code Is Expired`) {
          displayErrorToast(err.response?.data?.message);
          return;
        }
        if (err.response.data.message === `Internal Server Error`) {
          displayErrorToast(err.response?.data?.message);
          router.push(WEB_ROUTE_PATHS.register);
          return;
        }
      }
    },
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      await verifyUserCode({ code: values.code });
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  const handleOnChange = (e, index, setFieldValue, values) => {
    const value = e.target.value;
    const newCode = [...values.code];
    newCode[index] = value.slice(0, 1);
    setFieldValue("code", newCode, true);

    if (value && index < emailValidationInputRefs.current.length - 1) {
      emailValidationInputRefs.current[index + 1].focus();
    }
    if (newCode.every((code) => code !== "")) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      emailValidationInputRefs.current[index - 1].focus();
    }
  };

  const startCountdown = (duration) => {
    setCountdown(duration);
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          setIsResendButtonEnabled(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const resentVerificationCode = async (setFieldValue) => {
    setFieldValue("code", Array(6).fill(""));
    setAllFieldsFilled(false);
    emailValidationInputRefs.current[0].focus();
    setIsResendButtonEnabled(false);
    try {
      setIsResending(true);
      await resendCode();
      setIsResending(false);
      startCountdown(5);
    } catch (err) {
      setIsResending(false);
    } finally {
      setIsResendButtonEnabled(false);
    }
  };

  return (
    <div className="bg-s1">
      <div className="flex items-center justify-center min-h-screen">
        <Formik
          initialValues={{ code: Array(6).fill("") }}
          validationSchema={codeVerificationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, setFieldValue, values }) => (
            <Form className="flex flex-col gap-2 w-6/7 md:w-2/3 bg-s1 p-8 rounded shadow-lg shadow-shadow">
              <div className="flex flex-row relative">
                <ChevronLeftIcon
                  onClick={() => router.push(`${WEB_ROUTE_PATHS.register}`)}
                  className="size-7 opacity-50 hover:opacity-100 hover:cursor-pointer absolute"
                />
                <div className="w-full text-center">
                  <span className="text-2xl font-bold">{t("register_verification_page.title")}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex flex-row justify-center items-center gap-5 mt-5">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="relative">
                      <CustomVerificationInputField
                        name={`code[${index}]`}
                        id={`code-${index}`}
                        ref={(ref) =>
                          (emailValidationInputRefs.current[index] = ref)
                        }
                        onChange={(e) =>
                          handleOnChange(e, index, setFieldValue, values)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        maxLength="1"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  {allFieldsFilled && errors.code && (
                    <div className="text-red-warning-heavy text-sm font-semibold my-1">
                      {t("common_phases.form.validations.code_verification.invalid_format")}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row justify-center items-center gap-7">
                <div className="flex flex-row gap-2">
                  <CustomButton
                    type="button"
                    style={
                      isResending || countdown > 0
                        ? "resend-btn-disabled"
                        : "resend-btn-enabled"
                    }
                    text={t("common_phases.button.resend")}
                    textStyles="font-semibold"
                    loading={isResending}
                    disabled={!isResendButtonEnabled}
                    spinner={true}
                    onClick={() => resentVerificationCode(setFieldValue)}
                  />
                  {!isResendButtonEnabled && countdown > 0 && (
                    <div className="font-semibold text-shadow">{`(${countdown}s)`}</div>
                  )}
                </div>

                <CustomButton
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isResending ||
                    !allFieldsFilled ||
                    errors.code
                  }
                  style={
                    isSubmitting ||
                    isResending ||
                    !allFieldsFilled ||
                    errors.code
                      ? "verification-code-submit-btn-disabled"
                      : "verification-code-submit-btn-enabled"
                  }
                  textStyles="mx-6 font-semibold"
                  text={t("common_phases.button.enter")}
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

export default withAuth(EmailVerificationPage);
