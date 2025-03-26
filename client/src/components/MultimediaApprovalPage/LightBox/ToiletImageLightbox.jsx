import Overlay from "@layout/Overlay";
import Lightbox from "@layout/Lightbox";

const ToiletImageLightbox = ({ onCloseLightbox, image }) => {
  return (
    <Overlay>
      <Lightbox styles="mt-8" onCloseLightbox={onCloseLightbox}>
        <div className="flex flex-col gap-y-5 justify-center items-center px-5">
          {image && (
            <div className="relative">
              <img
                src={image.url}
                alt="Clicked image"
                className="max-w-full max-h-full rounded-lg"
              />
            </div>
          )}
        </div>
      </Lightbox>
    </Overlay>
  );
};

export default ToiletImageLightbox;
