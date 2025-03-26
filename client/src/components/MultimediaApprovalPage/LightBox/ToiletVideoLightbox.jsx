import Overlay from "@layout/Overlay";
import Lightbox from "@layout/Lightbox";

const ToiletVideoLightbox = ({ onCloseLightbox, video }) => {
  return (
    <Overlay>
      <Lightbox styles="mt-8" onCloseLightbox={onCloseLightbox}>
        <div className="flex flex-col gap-y-5 justify-center items-center px-5">
          {video && (
            <div className="relative">
              <video
                className="max-w-full max-h-[700px] rounded-lg"
                controls
                controlsList="nodownload"
                autoPlay
              >
                <source src={video?.url} type="video/mp4" />
                <source src={video?.url} type="video/webm" />
                Your browser does not support this video format.
              </video>
            </div>
          )}
        </div>
      </Lightbox>
    </Overlay>
  );
};

export default ToiletVideoLightbox;
