import CustomButton from "@components/common/Button/CustomButton";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const Modal = ({
  children,
  title,
  onCloseModal,
  isReturnButtonEnabled = false,
  onReturn,
  styles="pr-16 -mr-16",
  modalHeight = "h-fit",
  modalWidth = "w-3/5",
}) => {
  return (
    <div
      className={`flex flex-col bg-s1 p-8 rounded-lg shadow-lg shadow-shadow ${modalHeight} ${modalWidth} 
                  min-w-[430px] md:min-w-[600px] max-h-[95vh] max-w-[37vw]`}
    >
      <div className="flex flex-row w-full pb-3 relative">
        {isReturnButtonEnabled && (
          <CustomButton
            type="button"
            icon={
              <ChevronLeftIcon className="size-6 text-s6 hover:text-s9" />
            }
            style="modal-return-btn"
            varient="absolute left-0"
            onClick={onReturn}
          />
        )}

        <h1 className="text-text w-full text-center font-bold text-2xl">{title}</h1>

        <CustomButton
          type="button"
          icon={
            <XMarkIcon className="size-6 text-s6 hover:text-s9" />
          }
          style="modal-close-btn"
          varient="absolute right-0"
          onClick={onCloseModal}
        />
      </div>
      <div
        className={`relative h-full overflow-y-auto md:scroll-bar-appearance ${styles}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
