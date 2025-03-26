import CustomButton from "@components/common/Button/CustomButton";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Lightbox = ({ children, onCloseLightbox, styles }) => {
  return (
    <div
      className={`flex flex-col bg-transparent py-8 px-4 md:px-8 rounded-xl h-fit w-fit 
                  min-w-[430px] md:min-w-[600px] max-h-[95vh] max-w-[37vw] md:max-w-full relative`}
    >
      <div className="absolute top-5 right-5 z-10">
        <CustomButton
          type="button"
          icon={
            <XMarkIcon className="size-5 text-s6 hover:text-s9" />
          }
          style="lightbox-close-btn"
          onClick={onCloseLightbox}
        />
      </div>
      <div className={`relative pr-16 -mr-16 overflow-y-auto ${styles}`}>{children}</div>
    </div>
  );
};

export default Lightbox;
