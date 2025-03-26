import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const DISPLAY_TIME = 5000; // in second

const AddToiletSuccessDrawerContent = ({ setShowAddToiletSuccessDrawer }) => {
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setShowAddToiletSuccessDrawer(false);
    }, DISPLAY_TIME);
  }, []);

  return (
    <div className="w-full rounded-lg">
      <div className="flex flex-col gap-y-3 items-center justify-center">
        <CheckCircleIcon className="size-32 text-green-300" />
        <p className="text-lg font-semibold text-center">
          The location of the toilet is pending verification.
        </p>
        <p className="mt-10 text-sm text-s5">
          User will be awarded{" "}
          <span className="font-bold text-base text-url">200 coins</span> for after verification
        </p>
        <p className="mt-12 text-sm text-s5">
          Thank you for submission
        </p>
      </div>
    </div>
  );
};

export default AddToiletSuccessDrawerContent;
