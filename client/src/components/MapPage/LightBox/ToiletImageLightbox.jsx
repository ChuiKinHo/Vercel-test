import Overlay from "@layout/Overlay";
import Lightbox from "@layout/Lightbox";
import CustomButton from "@components/common/Button/CustomButton";
import {
  HeartIcon as HeartOutlineIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import QUERY_KEYS from "@utils/constants/QueryKeys";
import { displayErrorToast } from "@components/common/Toast/CustomToast";
import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import likeToiletMultimedia from "@services/map/likeToiletMultimedia";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import CustomComments from "@components/common/Comments/CustomComments";
import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { commentSchema } from "@utils/validationSchema/globalSchema";
import addMultimediaComment from "@services/map/addMultimediaComment";
import LoginRequiredModal from "../Modals/LoginRequiredModal";
import { LuShare2 } from "react-icons/lu";

const ToiletImageLightbox = ({
  onCloseLightbox,
  image,
  toiletId,
  setSelectedToilet,
  setOpenShareToiletURLModal,
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const userId = queryClient.getQueryData([QUERY_KEYS.USER_DATA])?.data?.userId;

  const [updatedImage, setUpdatedImage] = useState(image);
  const [isLiked, setIsLiked] = useState(false);
  const [openCommentGrid, setOpenCommentGrid] = useState(false);

  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  useEffect(() => {
    if (userId) {
      const userIsLiked = updatedImage?.likes.includes(userId);
      if (userIsLiked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [updatedImage]);

  const { mutateAsync: LikeToiletMultimedia } = useMutation({
    mutationFn: likeToiletMultimedia,
    onSuccess: (res) => {
      setSelectedToilet(res.data.selectedToilet);
      setUpdatedImage(res.data.selectedMultimedia);
      console.log(res.data);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const { mutateAsync: AddMultimediaComment } = useMutation({
    mutationFn: addMultimediaComment,
    onSuccess: (res) => {
      setSelectedToilet(res.data.selectedToilet);
      setUpdatedImage(res.data.selectedMultimedia);
      console.log(res.data);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onLikeBtnClicked = async () => {
    if (userId) {
      await LikeToiletMultimedia({
        multimediaId: updatedImage._id,
        toiletId: toiletId,
      });
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  const onCommentBtnClicked = () => {
    if (userId) {
      if (openCommentGrid) {
        setOpenCommentGrid(false);
      } else {
        setOpenCommentGrid(true);
      }
    } else {
      setShowLoginRequiredModal(true);
    }
  };

  const handleSubmit = async (data, { setSubmitting, setFieldValue }) => {
    setSubmitting(true);
    try {
      await AddMultimediaComment({
        comment: data.comment,
        multimediaId: updatedImage._id,
        toiletId: toiletId,
      });
      setSubmitting(false);
      setFieldValue("comment", "", false);
    } catch (err) {
      setSubmitting(false);
      setFieldValue("comment", "");
    }
  };

  return (
    <Overlay>
      <Lightbox styles="mt-8" onCloseLightbox={onCloseLightbox}>
        <div className="flex flex-col gap-y-5 justify-center items-center px-5">
          {updatedImage && (
            <div className="relative">
              <img
                src={updatedImage.url}
                alt="Clicked image"
                className="max-w-full max-h-[60vh] rounded-lg"
              />

              {openCommentGrid && (
                <div className="absolute left-0 bottom-8 px-6 flex flex-col gap-y-4 w-full max-h-[150px] md:max-h-[300px] overflow-y-auto">
                  <CustomComments
                    comments={updatedImage?.comments}
                    textStyle="text-text toilet-light-box-comment"
                    usernameTextStyle="text-sm font-bold"
                    timeIntervalTextStyle="text-xs text-end pr-3"
                    avatarStyle="size-8"
                  />
                  <Formik
                    initialValues={{ comment: "" }}
                    validationSchema={commentSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, isSubmitting, touched }) => (
                      <Form className="w-full">
                        <div className="flex flex-col gap-y-5">
                          <div className="space-y-1">
                            <label
                              htmlFor="comment"
                              className="text-xs md:text-sm font-semibold"
                            >
                              {t("common_phases.form.labels.your_comment")}
                            </label>
                            <div className="grid grid-cols-3 gap-x-5 w-full">
                              <div className="col-span-2">
                                <CustomFormInputField
                                  type="textarea"
                                  name="comment"
                                  id="comment"
                                  placeholder={t(
                                    "common_phases.form.placeholders.add_new_comment"
                                  )}
                                  style="comment-textarea"
                                  varient={`w-full h-full ${
                                    errors.comment && touched.comment
                                      ? "border-red-warning-heavy"
                                      : "border-black/50 focus:border-black/100"
                                  }`}
                                  autoComplete="comment"
                                />
                              </div>
                              <div className="col-span-1">
                                <CustomButton
                                  type="submit"
                                  disabled={isSubmitting}
                                  style="comment-submit-btn"
                                  varient={`w-full h-12 mt-1 ${
                                    isSubmitting ? "opacity-30" : ""
                                  }`}
                                  icon={
                                    <PaperAirplaneIcon className="size-5" />
                                  }
                                  loading={isSubmitting}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-row-reverse gap-x-3 w-full h-full">
            <CustomButton
              type="button"
              style="multimedia-share-btn"
              icon={<LuShare2 className="size-4 text-s6 hover:text-s9" />}
              onClick={() => setOpenShareToiletURLModal(true)}
            />

            <div className="flex gap-x-2 items-center">
              <CustomButton
                icon={<ChatBubbleOvalLeftEllipsisIcon className="size-5" />}
                onClick={onCommentBtnClicked}
              />
              <p className="text-xs">{updatedImage.comments.length}</p>
            </div>

            <div className="flex gap-x-2 items-center">
              <CustomButton
                icon={
                  isLiked ? (
                    <HeartSolidIcon className="size-5 text-red-500" />
                  ) : (
                    <HeartOutlineIcon className="size-5" />
                  )
                }
                onClick={onLikeBtnClicked}
              />
              <p className="text-xs">{updatedImage.likes.length}</p>
            </div>
          </div>
        </div>

        {showLoginRequiredModal && (
          <LoginRequiredModal
            onCloseModal={() => setShowLoginRequiredModal(false)}
          />
        )}
      </Lightbox>
    </Overlay>
  );
};

export default ToiletImageLightbox;
