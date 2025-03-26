const defaultStyle = `bg-btn text-btn border-border`;

export const styles = {
  "resend-btn-enabled": `bg-transparent hover:underline`,
  "resend-btn-disabled": `text-gray-default bg-transparent`,
  "login-submit-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2  hover:bg-transparent hover:text hover:border-dashed`,
  "forgot-password-submit-btn": `${defaultStyle} px-4 py-2 rounded-lg border-2 hover:bg-transparent hover:text hover:border-dashed`,
  "reset-password-submit-btn": `${defaultStyle} px-4 py-2 rounded-lg border-2 hover:bg-transparent hover:text hover:border-dashed`,
  "register-submit-btn": `${defaultStyle} px-4 py-2 rounded-lg border-2 hover:bg-transparent hover:text hover:border-dashed`,
  "verification-code-submit-btn-disabled": `${defaultStyle} px-4 py-2 rounded-lg border-2 opacity-30`,
  "verification-code-submit-btn-enabled": `${defaultStyle} px-4 py-2 rounded-lg border-2 opacity-100 hover:bg-transparent hover:text-black hover:border-dashed`,
  "navigation-bar-toggle-btn":
    "cursor-pointer rounded-lg transition-bg-color duration-300 text-black/70 dark:text-gray-300",
  "profile-page-navigation-bar-btn":
    "w-full border-b-4 pb-3 transition duration-500 hover:opacity-100",
  "profile-page-edit-enabled-btn":
    "flex flex-row-reverse items-center gap-2 px-2 py-1 transition-opacity duration-300 opacity-60 hover:opacity-100",
  "profile-page-modal-edit-btn":
    "transition-opacity duration-300 opacity-30 hover:opacity-90",
  "profile-page-modal-submit-btn-enabled":
    "bg-black text-white px-6 py-2 rounded-lg border-2",
  "profile-page-modal-submit-btn-disabled":
    "bg-btn text-btn px-6 py-2 rounded-lg border-2 border-border opacity-30",
  "profile-page-modal-edit-avatar-btn": "bg-s1 p-2 rounded-full",
  "profile-page-modal-edit-avatar-submit-btn":
    "px-5 py-2 text-btn bg-btn cursor-pointer rounded-xl border-2 border-border border-solid",
  "profile-page-add-friends-btn":
    "flex flex-row-reverse items-center gap-2 px-2 py-1 transition-opacity duration-300 opacity-60 hover:opacity-100",
  "list-add-friend-btn": "p-2 hover:s3 hover:opacity-50 rounded-lg",
  "modal-close-btn":
    "p-1 rounded-full transition-bg-colors duration-300 hover:s3 hover:text-s9",
  "modal-return-btn":
    "p-1 rounded-full transition-bg-colors duration-300 hover:s3 hover:text-s9",
  "lightbox-close-btn":
    "p-2 rounded-full transition-bg-colors duration-300 hover:s3 hover:text-s9",
  "phone-dropdown-btn": "rounded-lg px-3.5 py-2.5",
  "banner-dropdown-btn":
    "rounded-lg px-3 py-1.5 hover:bg-btn hover:bg-opacity-10 max-w-[30px]",
  "search-bar-reset-button":
    "p-1.5 rounded-full hover:bg-s2 hover:bg-opacity-50",
  "notification-cancel-btn":
    "absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
  "notification-friend-accept-btn":
    "px-2.5 py-1.5 bg-sky-300 hover:bg-sky-400 rounded-lg",
  "guest-profile-follow-btn": "px-10 py-2 rounded-lg",
  "guest-profile-unfollow-btn":
    "px-10 py-2 bg-s2 hover:bg-transparent rounded-lg border-2 hover:border-dashed hover:border-border",
  "left-carousel-btn": "p-2 rounded-full",
  "right-carousel-btn": "p-2 rounded-full",
  "photo-gallery-dropdown-btn":
    "rounded-lg px-3 py-1.5 hover:bg-btn hover:bg-opacity-20 max-w-[30px]",
  "change-password-modal-submit-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2 hover:bg-transparent hover:text hover:border-dashed`,
  "change-email-modal-submit-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2 hover:bg-transparent hover:text hover:border-dashed`,
  "comment-submit-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2  hover:bg-transparent hover:text hover:border-dashed`,
  "popup-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2 hover:bg-transparent hover:text hover:border-dashed`,
  "popup-close-btn":
    "p-1 rounded-full transition-bg-colors duration-300 hover:s3 hover:text-s9",
  "popup-bookmark-btn":
    "p-1 rounded-full transition-bg-colors duration-300 hover:s3 hover:text-s9",
  "toilet-share-btn":
    "p-1 rounded-full transition-bg-colors duration-300 hover:s3 hover:text-s9",
  "map-search-btn": "p-4 rounded-full",
  "popup-geolocation-btn": "p-4 rounded-full bg-s1",
  "map-home-btn":
    "w-full border-b-4 py-2 transition duration-500 hover:opacity-100",
  "map-setting-btn":
    "w-full border-b-4 py-2 transition duration-500 hover:opacity-100",
  "map-bookmark-btn":
    "w-full border-b-4 py-2 transition duration-500 hover:opacity-100",
  "map-add-toilet-btn":
    "w-full border-b-4 py-2 transition duration-500 hover:opacity-100",
  "district-dropdown-btn": "rounded-lg hover:bg-black hover:bg-opacity-10 p-1",
  "sub-district-dropdown-btn":
    "rounded-lg hover:bg-btn hover:bg-opacity-10 p-1",
  "area-dropdown-btn": "rounded-lg hover:bg-btn hover:bg-opacity-10 p-1",
  "search-bar-filter-btn": "p-1.5 rounded-full hover:bg-s2",
  "toilet-verification-refresh-btn": `text-[#D1D5DB] p-2 rounded-lg border-2`,
  "type-of-toilet-dropdown-btn": "p-1",
  "add-toilet-submit-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2`,
  "admin-toilet-verification-next-page-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2`,
  "admin-toilet-verification-approve-btn": `${defaultStyle} w-full px-4 py-2 rounded-lg border-2`,
  "toilet-drawer-navigation-bar-btn":
    "w-full border-b-4 pb-2 transition duration-500 hover:opacity-100",
  "reward-exchange-btn": `${defaultStyle} w-28 px-2.5 py-1.5 rounded-md border-2 md:hover:bg-transparent md:hover:text md:hover:border-dashed`,
  "reward-dropdown-btn": "rounded-lg p-1",
  "task-go-button":
    "rounded-full text-btn bg-btn py-1 px-4 border-border border-2",
  "toilet-camera-btn": `bg-s3 rounded-full p-3`,
  "login-required-modal-cancel-btn": `bg-transparent hover:underline`,
  "login-required-modal-login-btn": `${defaultStyle} px-8 py-2 rounded-lg border-2 opacity-100 hover:bg-transparent hover:text-black hover:border-dashed`,
  "non-verified-multimedia-dropdown-btn": "rounded-lg p-1",
  "multimedia-share-btn":
    "p-1 rounded-full transition-bg-colors duration-300 hover:s3 hover:text-s9",
};
