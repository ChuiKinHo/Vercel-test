import { useAuth } from "../../contexts/AuthProvider";
import { usePathname } from "next/navigation";
import Spinner from "@components/common/Spinner/Spinner";
import NavigationBar from "@components/Navbar/index";
import PROTECTED_ROUTE_PATHS from "../../utils/constants/ProtectedRoutes";

const withAuth = (Component) => {
  return (props) => {
    const {
      isLoading,
      userData,
      guestData,
      verified_toiletData,
      non_verified_toiletData,
      non_verified_multimedia,
      rewardsData,
    } = useAuth();

    const pathname = usePathname();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner style="large" />
        </div>
      );
    } else {
      if (pathname === PROTECTED_ROUTE_PATHS.map) {
        return (
          <Component
            {...props}
            userData={userData?.data}
            isGuestUser={userData?.data?.role === "guest_user" ? true : false}
            verified_toiletData={verified_toiletData?.data}
          />
        );
      } else if (
        pathname !== PROTECTED_ROUTE_PATHS.resetPassword &&
        pathname !== PROTECTED_ROUTE_PATHS.registrationVerification &&
        pathname !== PROTECTED_ROUTE_PATHS.changeEmail
      ) {
        return (
          <div className="flex flex-row">
            <NavigationBar
              userData={userData?.data}
              isAdmin={userData?.data?.role === "admin" ? true : false}
            />
            <Component
              {...props}
              userData={guestData?.data ? guestData?.data : userData?.data}
              rewardsData={rewardsData?.data}
              isGuest={guestData?.data ? true : false}
              isAdmin={userData?.data?.role === "admin" ? true : false}
              non_verified_toiletData={
                userData?.data?.role === "admin"
                  ? non_verified_toiletData?.data
                  : null
              }
              non_verified_multimedia={
                userData?.data?.role === "admin"
                  ? non_verified_multimedia?.data
                  : null
              }
              isGuestUser={userData?.data?.role === "guest_user" ? true : false}
            />
          </div>
          /*To-Do: Add Minimized Nav Icon for fullscreen Map navigation.*/
        );
      } else {
        return <Component {...props} />;
      }
    }
  };
};

export default withAuth;
