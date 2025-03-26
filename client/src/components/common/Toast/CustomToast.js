import { toast } from "react-toastify";

const displaySuccessToast = (title) => {
  toast.success(title);
};

const displayErrorToast = (title) => {
  toast.error(title);
};

export { displaySuccessToast, displayErrorToast };
