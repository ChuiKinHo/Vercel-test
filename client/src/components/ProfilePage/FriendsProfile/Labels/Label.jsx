import CustomAvatar from "@components/common/Avatar/Avatar";
import { useRouter } from "next/navigation";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";

const ProfileFriendLabel = ({ friendDetail }) => {
  const router = useRouter();

  return (
    <div
      className="w-64 md:w-80 cursor-pointer bg-s2 rounded-lg shadow-lg shadow-shadow relative
                    transition duration-500 hover:bg-black/10"
      role="button"
      onClick={() =>
        router.push(`${WEB_ROUTE_PATHS.user.profile}/${friendDetail.userId}`)
      }
    >
      <CustomAvatar
        src={friendDetail.userAvatar}
        alt="Friend Avatar"
        style="profile-page-friend-avatar"
        varient="size-20 md:size-28 "
      />

      <div className="flex flex-col p-4 md:p-5 text-center ml-7">
        <p className="text-md font-bold text-s8">
          {friendDetail.fullname}
        </p>
        <p className="text-xs text-s5">{friendDetail.username}</p>
      </div>
    </div>
  );
};

export default ProfileFriendLabel;
