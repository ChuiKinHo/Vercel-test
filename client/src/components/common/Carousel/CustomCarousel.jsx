import CustomButton from "../Button/CustomButton";
import { styles } from "./styles";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const CustomCarousel = ({
  style = "default",
  images = [],
  videos = [],
  isDeleteBtn = false,
  onDelete,
  onClick,
}) => {
  const { t } = useTranslation();

  const [videoRefs, setVideoRefs] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [content, setContent] = useState([]);

  let startDragPosition = null;
  let endDragPosition = null;

  const nextItem = () => {
    videoRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    setActiveItemIndex((currentIndex) => (currentIndex + 1) % content.length);
  };

  const previousItem = () => {
    videoRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    setActiveItemIndex(
      (currentIndex) => (currentIndex - 1 + content.length) % content.length
    );
  };

  const onDragStart = (e) => {
    startDragPosition = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const onDragEnd = (e) => {
    if (startDragPosition === null) return;

    endDragPosition = e.touches ? e.changedTouches[0].clientX : e.clientX;
    const distance = endDragPosition - startDragPosition;
    const threshold = 50;

    if (distance > threshold) {
      previousItem();
    } else if (distance < -threshold) {
      nextItem();
    }

    startDragPosition = null;
    endDragPosition = null;
  };

  const handleDelete = ({ deleted }) => {
    if (content.length > 0) {
      const updatedContent = content.filter((_, index) => {
        return index !== activeItemIndex;
      });

      setContent(updatedContent);

      // Adjust active index to ensure it remains valid
      setActiveItemIndex((currentIndex) =>
        currentIndex >= updatedContent.length
          ? updatedContent.length - 1
          : currentIndex
      );

      if (onDelete) {
        onDelete(deleted);
      }
    }
  };

  useEffect(() => {
    if (images.length > 0 || videos.length > 0) {
      const updatedContent = [
        ...images.map((url, index) => ({
          type: "image",
          url: url,
        })),
        ...videos.map((url, index) => ({ type: "video", url: url })),
      ];
      setContent(updatedContent);
    }
  }, [videos, images]);

  useEffect(() => {
    if (videos.length > 0) {
      setVideoRefs(videos?.map(() => React.createRef()));
    }
  }, [videos]);

  return (
    <div
      className={`${styles[style]} ${
        content.length === 0 ? "px-4" : ""
      } relative`}
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
      onTouchStart={onDragStart}
      onTouchEnd={onDragEnd}
    >
      {content.length === 0 ? (
        <div className="flex justify-center items-center h-52 rounded-lg bg-s5/10">
          <p className="text-s9 text-lg">{t("custom_carousel.no_image_video")}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-center overflow-hidden relative">
            {content.map((item, index) => (
              <div
                key={item.url}
                className={`w-full transform duration-700 ease-in-out ${
                  index === activeItemIndex
                    ? "translate-x-0"
                    : activeItemIndex > index
                    ? "-translate-x-full absolute"
                    : "translate-x-full absolute"
                }`}
              >
                <div
                  className="relative flex justify-center items-center aspect-video bg-transparent"
                  onClick={() => {
                    if (onClick) {
                      onClick({ data: item });
                    }
                  }}
                >
                  {item.type === "image" ? (
                    <img
                      className="max-w-full max-h-full object-contain rounded-lg"
                      src={item.url}
                      alt={`carousel-${index}`}
                    />
                  ) : (
                    <video
                      className={`max-w-full w-full max-h-full object-contain rounded-lg ${
                        onClick ? "pointer-events-none" : ""
                      }`}
                      controls
                      controlsList="nodownload"
                      playsInline
                      ref={
                        videoRefs[
                          index - images.length >= 0 ? index - images.length : 0
                        ]
                      }
                    >
                      <source src={item.url} type="video/mp4" />
                      <source src={item.url} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isDeleteBtn && content.length > 0 && (
            <div className="absolute top-4 right-4">
              <CustomButton
                icon={<TrashIcon className="size-5 text-red-500" />}
                onClick={() =>
                  handleDelete({ deleted: content[activeItemIndex] })
                }
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="hidden md:block absolute top-1/2 left-2 md:left-10 transform -translate-y-1/2">
            <CustomButton
              style="left-carousel-btn"
              icon={<ChevronLeftIcon className="size-6" />}
              onClick={previousItem}
            />
          </div>

          <div className="hidden md:block absolute top-1/2 right-2 md:right-10 transform -translate-y-1/2">
            <CustomButton
              style="right-carousel-btn"
              icon={<ChevronRightIcon className="size-7" />}
              onClick={nextItem}
            />
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 w-full flex justify-center space-x-2">
            {content.map((_, index) => (
              <CustomButton
                key={index}
                varient={`size-2 rounded-full ${
                  index === activeItemIndex ? "bg-black" : "bg-s2"
                }`}
                onClick={() => setActiveItemIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomCarousel;
