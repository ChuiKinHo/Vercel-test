import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
} from "next/navigation";
import { useQueries, useQueryClient } from "react-query";
import PROTECTED_ROUTE_PATHS from "../utils/constants/ProtectedRoutes";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import getUserData from "@services/users/getUserData";
import getResetPasswordCredential from "@services/users/getResetPasswordCredential";
import getGuestData from "@services/users/getGuestData";
import getRegistrationCredential from "@services/users/getRegistrationCredential";
import changeEmail from "@services/users/changeEmail";
import getAllVerifiedToiletData from "@services/map/getAllVerifiedToiletData";
import getAllNonVerifiedToiletsData from "@services/admin/getAllNonVerifiedToiletsData";
import getRewardsData from "@services/users/getRewardsData";
import getAllNonVerifiedMultimedia from "@services/admin/getAllNonVerifiedMultimedia";

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const queriesConfig = [
    {
      queryKey: [QUERY_KEYS.USER_DATA],
      queryFn: getUserData,
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
      enabled: pathname.startsWith("/user") || pathname.startsWith("/map"),
    },
    {
      queryKey: [QUERY_KEYS.GUEST_DATA, params?.userId],
      queryFn: async () => await getGuestData({ guestId: params?.userId }),
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
      enabled:
        pathname.startsWith(WEB_ROUTE_PATHS.user.profile) ||
        pathname.startsWith(WEB_ROUTE_PATHS.user.gallery),
    },
    {
      queryKey: [
        QUERY_KEYS.USER_RESET_PASSWORD_CREDENTIAL,
        searchParams.get("token"),
      ],
      queryFn: async () =>
        await getResetPasswordCredential({
          token: searchParams.get("token"),
        }),
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      enabled:
        !!searchParams.get("token") &&
        pathname === PROTECTED_ROUTE_PATHS.resetPassword,
    },
    {
      queryKey: [QUERY_KEYS.USER_REGISTRATION_CREDENTIAL],
      queryFn: getRegistrationCredential,
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      enabled: pathname === PROTECTED_ROUTE_PATHS.registrationVerification,
    },
    {
      queryKey: [
        QUERY_KEYS.USER_CHANGE_EMAIL_CREDENTIAL,
        searchParams.get("token"),
      ],
      queryFn: async () =>
        await changeEmail({ token: searchParams.get("token") }),
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "true",
      enabled: pathname.startsWith(WEB_ROUTE_PATHS.changeEmail),
    },
    {
      queryKey: [QUERY_KEYS.VERIFIED_TOILET_DATA],
      queryFn: getAllVerifiedToiletData,
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      enabled: pathname.startsWith(WEB_ROUTE_PATHS.map),
    },
    {
      queryKey: [QUERY_KEYS.NON_VERIFIED_TOILET_DATA],
      queryFn: getAllNonVerifiedToiletsData,
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      enabled: pathname.startsWith(WEB_ROUTE_PATHS.user.toiletVerification),
    },
    {
      queryKey: [QUERY_KEYS.NON_VERIFIED_MULTIMEDIA],
      queryFn: getAllNonVerifiedMultimedia,
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      enabled: pathname.startsWith(WEB_ROUTE_PATHS.user.multimediaApproval),
    },
    {
      queryKey: [QUERY_KEYS.REWARDS_DATA],
      queryFn: getRewardsData,
      retry: 1,
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      enabled: pathname.startsWith("/user"),
    },
  ];

  const queryResults = useQueries(queriesConfig);

  const anyLoading = useMemo(
    () =>
      queryResults.some((result) => result?.isLoading || result?.isFetching),
    [queryResults]
  );

  useEffect(() => {
    setIsLoading(anyLoading);
  }, [anyLoading]);

  const values = {
    userData: queryResults[0]?.data,
    guestData: queryResults[1]?.data,
    verified_toiletData: queryResults[5]?.data,
    non_verified_toiletData: queryResults[6]?.data,
    non_verified_multimedia: queryResults[7]?.data,
    rewardsData: queryResults[8]?.data,
    isLoading,
  };

  useEffect(() => {
    switch (pathname) {
      case PROTECTED_ROUTE_PATHS.resetPassword:
        if (queryResults[2]?.isError) {
          queryClient.setQueryData(
            [QUERY_KEYS.USER_RESET_PASSWORD_CREDENTIAL],
            null
          );
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CURRENT_URL,
            WEB_ROUTE_PATHS.login
          );
          router.push(WEB_ROUTE_PATHS.login);
        }
        break;

      case PROTECTED_ROUTE_PATHS.registrationVerification:
        if (queryResults[3]?.isError) {
          queryClient.setQueryData(
            [QUERY_KEYS.USER_REGISTRATION_CREDENTIAL],
            null
          );
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CURRENT_URL,
            WEB_ROUTE_PATHS.register
          );
          router.push(WEB_ROUTE_PATHS.register);
        }
        break;

      case PROTECTED_ROUTE_PATHS.changeEmail:
        if (queryResults[4]?.isError) {
          queryClient.setQueryData(
            [QUERY_KEYS.USER_CHANGE_EMAIL_CREDENTIAL],
            null
          );
          router.push(WEB_ROUTE_PATHS.login);
        }
        break;

      case PROTECTED_ROUTE_PATHS.profile:
        if (queryResults[0]?.isSuccess && queryResults[1]?.isError) {
          queryClient.setQueryData(
            [QUERY_KEYS.GUEST_DATA, params?.userId],
            null
          );
          queryClient.setQueryData(
            [QUERY_KEYS.GUEST_FRIEND_REQUESTS_DATA, params?.userId],
            null
          );
          queryClient.setQueryData(
            [QUERY_KEYS.GUEST_FRIENDS_DATA, params?.userId],
            null
          );
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CURRENT_URL,
            WEB_ROUTE_PATHS.user.home
          );
          router.push(WEB_ROUTE_PATHS.login);
        }
        break;

      case PROTECTED_ROUTE_PATHS.setting:
        if (queryResults[0]?.isError) {
          queryClient.setQueryData([QUERY_KEYS.USER_DATA], null);
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CURRENT_URL,
            WEB_ROUTE_PATHS.login
          );
          router.push(WEB_ROUTE_PATHS.login);
        }
        break;

      case PROTECTED_ROUTE_PATHS.rewards:
        if (queryResults[0]?.isError) {
          queryClient.setQueryData([QUERY_KEYS.REWARDS_DATA], null);
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CURRENT_URL,
            WEB_ROUTE_PATHS.login
          );
          router.push(WEB_ROUTE_PATHS.login);
        }
        break;

      case PROTECTED_ROUTE_PATHS.map:
        if (queryResults[0]?.isError) {
          queryClient.setQueryData([QUERY_KEYS.USER_DATA], null);
          queryClient.setQueryData([QUERY_KEYS.USER_FRIENDS_DATA], null);
          queryClient.setQueryData(
            [QUERY_KEYS.USER_FRIEND_REQUESTS_DATA],
            null
          );
          queryClient.setQueryData([QUERY_KEYS.USER_NOTIFICATIONS], null);
          queryClient.setQueryData([QUERY_KEYS.REWARDS_DATA], null);
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CURRENT_URL,
            WEB_ROUTE_PATHS.map
          );
        }
        break;

      default:
        if (queryResults[0]?.isError) {
          queryClient.setQueryData([QUERY_KEYS.USER_DATA], null);
          queryClient.setQueryData([QUERY_KEYS.USER_FRIENDS_DATA], null);
          queryClient.setQueryData(
            [QUERY_KEYS.USER_FRIEND_REQUESTS_DATA],
            null
          );
          queryClient.setQueryData([QUERY_KEYS.USER_NOTIFICATIONS], null);
          queryClient.setQueryData([QUERY_KEYS.REWARDS_DATA], null);
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CURRENT_URL,
            WEB_ROUTE_PATHS.login
          );
          router.push(WEB_ROUTE_PATHS.login);
        }
        break;
    }
  }, [queryResults.some((result) => result.isError)]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { useAuth, AuthProvider };
