import { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import CustomSearchBar from "@components/common/SearchBar/CustomSearchBar";
import searchUsers from "@services/users/searchUsers";
import CustomAvatar from "@components/common/Avatar/Avatar";
import CustomButton from "@components/common/Button/CustomButton";
import { PlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import sendFriendRequest from "@services/users/sendFriendRequest";
import { useTranslation } from "react-i18next";

const AddFriendsModal = ({ onCloseModal }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const { mutateAsync: SearchUsers } = useMutation({
    mutationFn: searchUsers,
    onSuccess: (res) => {
      setSearchResult(res.data);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const { mutateAsync: SendFriendRequest } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (res) => {
      displaySuccessToast(res.message)
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onEnter = async (e) => {
    if (e.key === "Enter") {
      await SearchUsers({ query: searchInput });
    }
  };

  const sendAddFriendRequest = async ({ e, user }) => {
    e.stopPropagation();
    await SendFriendRequest({ guestId: user.userId });
  };

  const routeToGuestProfilePage = ({ e, user }) => {
    e.stopPropagation();
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.CURRENT_URL,
      `${WEB_ROUTE_PATHS.user.profile}/${user.userId}`
    );
    router.push(`${WEB_ROUTE_PATHS.user.profile}/${user.userId}`);
  };

  return (
    <Overlay>
      <Modal title={t("add_friends_modal.title")} onCloseModal={onCloseModal}>
        <div className="flex flex-col items-center w-full">
          <CustomSearchBar
            // placeholder="Search User"
            placeholder={t("add_friends_modal.search_bar")}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={onEnter}
            onReset={() => setSearchInput("")}
          />
          {searchResult.length > 0 && (
            <ul
              className="flex flex-col bg-s1 w-fit mt-5 rounded-lg max-h-[350px] 
                            overflow-y-auto md:scroll-bar-appearance"
            >
              {searchResult.map((user, index) => (
                <li
                  key={index}
                  role="button"
                  className="py-5 px-10 cursor-pointer hover:bg-s2/30"
                  onClick={(e) => routeToGuestProfilePage({ e, user })}
                >
                  <div className="flex flex-row gap-x-5 md:gap-x-10 items-center justify-center">
                    <CustomAvatar
                      src={user?.userAvatar}
                      alt="User Avatar"
                      varient="size-12"
                    />
                    <div className="flex flex-col gap-y-2 items-center w-full">
                      <p className="text-xl font-semibold">{user?.fullname}</p>
                      <p className="text-sm font-medium">{user?.username}</p>
                    </div>
                    <CustomButton
                      icon={<PlusIcon className="size-5" />}
                      style="list-add-friend-btn"
                      onClick={(e) => sendAddFriendRequest({ e, user })}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </Overlay>
  );
};

export default AddFriendsModal;
