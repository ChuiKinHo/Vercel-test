import NavbarItem from "./Item";
import { useState, useEffect, useMemo } from "react";
import logout from "@services/users/logout";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import { useTranslation } from "react-i18next";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";

const NavbarItems = ({ userData, isAdmin }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    const currentURL = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_URL);
    if (currentURL) {
      setCurrentURL(currentURL);
    }
  }, []);

  useEffect(() => {
    if (currentURL) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_URL, currentURL);
    }
  }, [currentURL]);

  const { mutateAsync: logoutUser } = useMutation({
    mutationFn: logout,
    onSuccess: (res) => {
      queryClient.setQueryData([QUERY_KEYS.USER_DATA], null);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CURRENT_URL,
        WEB_ROUTE_PATHS.login
      );
      // displaySuccessToast(res.message);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const AdminNavbarItems = {
    profile: {
      href: `${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`,
      icon: "profile",
      text: t("navigation_bar.profile"),
      isLastChild: false,
      onClick: () =>
        setCurrentURL(`${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`),
    },
    toilet_verification: {
      href: `${WEB_ROUTE_PATHS.user.toiletVerification}/${userData?.userId}`,
      icon: "toilet_verification",
      text: t("navigation_bar.toilet_verification"),
      isLastChild: false,
      onClick: () =>
        setCurrentURL(
          `${WEB_ROUTE_PATHS.user.toiletVerification}/${userData?.userId}`
        ),
    },
    multimedia_approval: {
      href: `${WEB_ROUTE_PATHS.user.multimediaApproval}/${userData?.userId}`,
      icon: "multimedia_approval",
      text: t("navigation_bar.multimedia_approval"),
      isLastChild: false,
      onClick: () =>
        setCurrentURL(
          `${WEB_ROUTE_PATHS.user.multimediaApproval}/${userData?.userId}`
        ),
    },
    setting: {
      href: `${WEB_ROUTE_PATHS.user.setting}`,
      icon: "setting",
      text: t("navigation_bar.setting"),
      isLastChild: false,
      onClick: () => setCurrentURL(`${WEB_ROUTE_PATHS.user.setting}`),
    },
    logout: {
      href: `${WEB_ROUTE_PATHS.login}`,
      icon: "logout",
      text: t("navigation_bar.logout"),
      isLastChild: true,
      onClick: async () => await logoutUser(),
    },
  };

  const RegularNavbarItems = {
    map: {
      href: `${WEB_ROUTE_PATHS.map}`,
      icon: "map",
      style: `${"text-s7"}`,
      text: t("navigation_bar.map"),
      isLastChild: false,
      onClick: () => setCurrentURL(`${WEB_ROUTE_PATHS.map}`),
    },
    profile: {
      href: `${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`,
      icon: "profile",
      text: t("navigation_bar.profile"),
      isLastChild: false,
      onClick: () =>
        setCurrentURL(`${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`),
    },
    rewards: {
      href: `${WEB_ROUTE_PATHS.user.rewards}/${userData?.userId}`,
      icon: "rewards",
      text: t("navigation_bar.rewards"),
      isLastChild: false,
      onClick: () =>
        setCurrentURL(`${WEB_ROUTE_PATHS.user.rewards}/${userData?.userId}`),
    },
    setting: {
      href: `${WEB_ROUTE_PATHS.user.setting}`,
      icon: "setting",
      text: t("navigation_bar.setting"),
      isLastChild: false,
      onClick: () => setCurrentURL(`${WEB_ROUTE_PATHS.user.setting}`),
    },
    logout: {
      href: `${WEB_ROUTE_PATHS.login}`,
      icon: "logout",
      text: t("navigation_bar.logout"),
      isLastChild: true,
      onClick: async () => await logoutUser(),
    },
  };

  const NavbarItemsList = useMemo(() => {
    const items = isAdmin ? AdminNavbarItems : RegularNavbarItems;

    return Object.entries(items).map(([key, item]) => (
      <NavbarItem
        key={key}
        href={item.href}
        icon={item.icon}
        text={item.text}
        currentURL={currentURL}
        isLastChild={item.isLastChild}
        onClick={item.onClick}
        style={item.style}
      />
    ));
  }, [isAdmin, AdminNavbarItems, RegularNavbarItems, currentURL]);

  return NavbarItemsList;
};

export default NavbarItems;
