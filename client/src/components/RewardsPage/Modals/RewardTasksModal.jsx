import { useState } from "react";
import moment from "moment-timezone";
import Overlay from "@layout/Overlay";
import Modal from "@layout/Modal";
import LOCAL_STORAGE_KEYS from "@utils/constants/LocalStorageKeys";
import { useTranslation } from "react-i18next";
import { GiTwoCoins } from "react-icons/gi";
import CustomButton from "@components/common/Button/CustomButton";
import { useRouter } from "next/navigation";
import CustomDropdown from "@components/common/Dropdown/CustomDropdown";
import CustomInputField from "@components/common/InputFiled/CustomInputField";
import WEB_ROUTE_PATHS from "@utils/constants/WebRoutes";
import useTasksMenu from "@components/common/Dropdown/DropdownMenu/TasksMenu";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { FaGift } from "react-icons/fa6";
import { TbGiftOff } from "react-icons/tb";

const RewardTasksModal = ({ onCloseModal, userData }) => {
  const router = useRouter();

  const { t } = useTranslation();
  const currentLanguage =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || "en_us"
      : "en_us";

  const TasksMenu = useTasksMenu();

  const [taskDropdownValue, setTaskDropdownValue] = useState(TasksMenu.daily);
  const [taskItems, setTaskItems] = useState(
    userData?.tasks?.filter((task) => task.category === "daily")
  );

  console.log(userData)

  const getLoginStreak = () => {
    const today = moment().tz("Asia/Hong_Kong");
    const todayWeekday = today.isoWeekday();

    // Calculate the start of the week (Monday)
    const startOfWeek = today.clone().subtract(todayWeekday - 1, "days");

    // Generate the last 7 days starting from Monday
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfWeek.clone().add(i, "days"); // Get each day of the week
      return date.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    });

    // Convert login history dates to Hong Kong time and extract YYYY-MM-DD
    const uniqueLogins = [
      ...new Set(
        userData?.login_history?.map((date) =>
          moment(date).tz("Asia/Hong_Kong").format("YYYY-MM-DD")
        )
      ),
    ];

    return last7Days.map((day) => ({
      date: day,
      isLogin: uniqueLogins.includes(day),
    }));
  };

  const loginStreak = getLoginStreak();

  const onTaskBtnClicked = (task) => {
    switch (task.title) {
      case "view-toilet":
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          WEB_ROUTE_PATHS.map
        );
        router.push(WEB_ROUTE_PATHS.map);
        break;

      case "add-toilet":
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          WEB_ROUTE_PATHS.map
        );
        router.push(WEB_ROUTE_PATHS.map);
        break;

      case "add-toilet-multimedia":
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          WEB_ROUTE_PATHS.map
        );
        router.push(WEB_ROUTE_PATHS.map);
        break;

      case "add-toilet-comment":
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          WEB_ROUTE_PATHS.map
        );
        router.push(WEB_ROUTE_PATHS.map);
        break;

      case "add-multimedia-comment":
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          WEB_ROUTE_PATHS.map
        );
        router.push(WEB_ROUTE_PATHS.map);
        break;

      case "edit-profile":
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          `${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`
        );
        router.push(`${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`);
        break;

      case "edit-user-avatar":
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          `${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`
        );
        router.push(`${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`);
        break;

      default:
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.CURRENT_URL,
          `${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`
        );
        router.push(`${WEB_ROUTE_PATHS.user.profile}/${userData?.userId}`);
        break;
    }
  };

  return (
    <Overlay>
      <Modal
        title={t("reward_tasks_modal.title")}
        onCloseModal={onCloseModal}
        styles="pb-2 pr-16 -mr-16 my-5"
      >
        <div className="flex w-full relative justify-end">
          <CustomInputField
            type="text"
            name="task"
            id="task"
            style="reward-dropdown-inputfield"
            varient="text-sm text-s6"
            disabled={true}
            value={taskDropdownValue.name}
          />
          <div className="absolute top-1.5 right-2">
            <CustomDropdown
              buttonStyle="reward-dropdown-btn"
              buttonIcon={<ChevronDownIcon className="size-5 text-text" />}
              dropdownMenu={TasksMenu}
              menuWidth="w-32"
              dropdownMenuPosition="right"
              dropdownMenuVarient="mt-2 -mr-1.5"
              dropdownMenuItemStyle="reward-dropdown-item"
              dropdownMenuItemVarient="gap-x-2 text-s9"
              menuGap={0}
              onMenuItemSelected={(menuItem) => {
                const updatedTaskItems = userData?.tasks?.filter(
                  (task) => task.category === menuItem.value
                );
                setTaskItems(updatedTaskItems);
                setTaskDropdownValue(menuItem);
              }}
            />
          </div>
        </div>

        <div className="mt-7">
          <div className="bg-s2 rounded-lg w-full">
            <div className="flex justify-between gap-x-5 p-5 overflow-y-auto">
              {loginStreak.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      day.isLogin ? "bg-yellow-400" : "bg-s3"
                    }`}
                  >
                    {day.isLogin ? (
                      <FaGift className="text-s1" />
                    ) : (
                      <TbGiftOff className="text-s5" />
                    )}
                  </div>
                  <span className="text-s7 text-sm font-semibold">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="bg-s2 p-5 rounded-lg min-h-[400px] max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-y-4">
              <p className="text-base text-text font-semibold">{`${
                taskDropdownValue.name
              } ${t("reward_tasks_modal.tasks")}`}</p>
              <div className="flex flex-col gap-y-3">
                {taskItems.map((task) => (
                  <div key={task.taskId} className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-y-0.5 w-[75%]">
                        <p className="text-sm font-semibold text-s9 break-words">
                          {t(
                            `reward_tasks_modal.${task.description
                              .replace(/\s+/g, "_")
                              .toLowerCase()}`
                          )}
                        </p>
                        <div className="flex items-center gap-x-2">
                          <GiTwoCoins className="size-4 text-yellow-500" />
                          <p className="text-xs text-s6">
                            {`${task.coins} coins`}
                          </p>
                        </div>
                      </div>

                      <CustomButton
                        style="task-go-button"
                        varient={
                          task.isCompleted
                            ? "opacity-30"
                            : "hover:bg-transparent hover:text-text hover:border-dashed"
                        }
                        text={task.isCompleted ? `${t("reward_tasks_modal.completed")}` : `${t("reward_tasks_modal.go")}`}
                        textStyles="text-sm"
                        disabled={task.isCompleted}
                        onClick={() => {
                          onTaskBtnClicked(task);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Overlay>
  );
};

export default RewardTasksModal;
