"use client";

import React from "react";
import CustomButton from "@components/common/Button/CustomButton";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import withAuth from "@layout/ProtectedRoutes/withAuth";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const ChangeEmailPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="bg-s1">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-2/5 bg-s1 px-8 py-12 rounded shadow-lg shadow-shadow relative">
          <CustomButton
            varient="absolute top-7"
            icon={
              <ChevronLeftIcon
                onClick={() => router.push(`${WEB_ROUTE_PATHS.login}`)}
                className="size-7 opacity-50 hover:opacity-100"
              />
            }
            onClick={() => router.push(WEB_ROUTE_PATHS.login)}
          />
          <div className="flex flex-col items-center gap-y-5">
            <CheckCircleIcon className="size-32 text-green-300" />
            <p className="text-xl font-semibold">
              {t("change_email_page.title")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ChangeEmailPage);
