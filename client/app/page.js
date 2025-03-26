"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import getUserData from "@services/users/getUserData";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import { useLanguage } from "@contexts/LanguageProvider";
import { useFontSize } from "@contexts/FontSizeProvider";
import Spinner from "@components/common/Spinner/Spinner";
import { useTheme } from "next-themes";

export default function Page() {
  const router = useRouter();

  const { changeLanguage } = useLanguage();
  const { changeFontSize } = useFontSize();
  const { _, setTheme } = useTheme();

  const {
    data: res,
    isError,
    isLoading,
    isSuccess,
  } = useQuery([QUERY_KEYS.USER_DATA], getUserData, { retry: 2 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner style="large" />
      </div>
    );
  }

  if (isSuccess || isError) {
    changeLanguage(res?.data?.preference_language || "en_us");
    changeFontSize(res?.data?.preference_font_size || "M");
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, res?.data?.preference_theme || "light");
    setTheme(res?.data?.preference_theme || "light");

    if (isSuccess) {
      const path =
        res?.data?.role === "admin"
          ? `${WEB_ROUTE_PATHS.user.toiletVerification}/${res?.data?.userId}`
          : `${WEB_ROUTE_PATHS.user.profile}/${res?.data?.userId}`;

      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_URL, path);
      router.push(path);
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_URL, WEB_ROUTE_PATHS.login);
    router.push(WEB_ROUTE_PATHS.login);
  }
}
