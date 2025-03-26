const defaultStyle =
  "px-4 py-2 rounded-md placeholder:text-sm placeholder:light-slate outline-none placeholder:tracking-wide placeholder:italic";

export const styles = {
  default: `${defaultStyle}`,
  "login-page-inputfield": `${defaultStyle} w-full bg-s2 border-2`,
  "registration-page-inputfield": `${defaultStyle} w-full bg-s2 border-2`,
  "forgot-password-page-inputfield": `${defaultStyle} w-full bg-s2 border-2`,
  "reset-password-page-inputfield": `${defaultStyle} w-full bg-s2 border-2`,
  "reset-password-page-inputfield-disabled": `${defaultStyle} w-full bg-s2 shadow`,
  "verification-code-inputfield":
    "shadow-md outline-none w-9 h-12 md:w-12 md:h-16 text-center text-lg font-bold rounded border-2 border-black focus:border-blue-light placeholder-black/60",
  "personal-profile-edit-inputfield": `${defaultStyle} w-[230px] md:w-[350px] border-2`,
  "file-upload-inputfield":
    "absolute bg-transparent w-full h-[392px] rounded-[30px] bg-s4 opacity-0 cursor-pointer hover:opacity-10",
  "search-bar-default": `w-full px-2 py-1.5 rounded-md placeholder:light-slate placeholder:tracking-wide placeholder:italic outline-none bg-s2`,
  "change-password-modal-inputfield": `${defaultStyle} w-full bg-s2 border-2`,
  "change-email-modal-inputfield": `${defaultStyle} w-full bg-s2 border-2`,
  "change-email-modal-inputfield-disabled": `${defaultStyle} w-full bg-s2 shadow-sm`,
  "comment-textarea": `${defaultStyle} bg-s1 border-2 text-sm`,
  "add-toilet-address-inputfield": `${defaultStyle} w-full bg-s2 shadow-sm`,
  "add-toilet-district-inputfield": `${defaultStyle} w-full bg-s2 shadow-sm pr-9`,
  "add-toilet-sub-district-inputfield": `${defaultStyle} w-full bg-s2 shadow-sm pr-9`,
  "add-toilet-area-inputfield": `${defaultStyle} w-full bg-s2 shadow-sm pr-9`,
  "toilet-verification-type-of-toilet-inputfield": "px-4 py-2.5 rounded-lg bg-s2 outline-none",
  "reward-dropdown-inputfield": `${defaultStyle} w-32 bg-s2 shadow-sm`
};
