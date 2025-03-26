import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import updateToiletRating from "@services/map/updateToiletRating";
import StarRating from "@components/common/StarRating/CustomStarRating";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import CustomAvatar from "@components/common/Avatar/Avatar";
import CustomButton from "@components/common/Button/CustomButton";
import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import { Formik, Form } from "formik";
import { commentSchema } from "@utils/validationSchema/globalSchema";
import addToiletComment from "@services/map/addToiletComment";
import CustomComments from "@components/common/Comments/CustomComments";
import { displayErrorToast } from "@components/common/Toast/CustomToast";

const CommentGrid = ({
  userData,
  selectedToilet,
  setOverallRating,
  setSelectedToilet,
}) => {
  const { t } = useTranslation();

  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    // Calculate overall rating
    if (selectedToilet?.rating && selectedToilet.rating.length > 0) {
      const totalRating = selectedToilet.rating.reduce(
        (sum, rating) => sum + rating.value,
        0
      );
      const averageRating = (
        totalRating / selectedToilet.rating.length
      ).toFixed(1);
      setOverallRating(averageRating);

      const userRating = selectedToilet.rating.find(
        (rating) => rating.userId.toString() === userData?.userId
      );
      if (userRating) {
        setUserRating(userRating.value);
      } else {
        setUserRating(0);
      }
    } else {
      setOverallRating(0);
    }
  }, [selectedToilet]);

  const { mutateAsync: UpdateToiletRating } = useMutation({
    mutationFn: updateToiletRating,
    onSuccess: (res) => {
      setSelectedToilet(res.data);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const { mutateAsync: AddToiletComment } = useMutation({
    mutationFn: addToiletComment,
    onSuccess: (res) => {
      setSelectedToilet(res.data);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onRatingChange = async (rating) => {
    if (userData && selectedToilet) {
      await UpdateToiletRating({
        rating: rating,
        toiletId: selectedToilet.toiletId,
      });
    }
  };

  const handleSubmit = async (data, { setSubmitting, setFieldValue }) => {
    setSubmitting(true);
    try {
      await AddToiletComment({
        comment: data.comment,
        toiletId: selectedToilet?.toiletId,
      });
      setSubmitting(false);
      setFieldValue("comment", "", false);
    } catch (err) {
      setSubmitting(false);
      setFieldValue("comment", "");
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {userData && (
        <div className="flex flex-col gap-y-6">
          <div className="flex gap-x-4 items-center">
            <CustomAvatar
              src={userData?.userAvatar}
              alt="User Avatar"
              varient="size-10"
            />
            <StarRating
              initialRating={userRating}
              onRatingChange={onRatingChange}
            />
          </div>

          <Formik
            initialValues={{ comment: "" }}
            validationSchema={commentSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, isSubmitting, touched }) => (
              <Form>
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
                      varient="border-black/50 focus:border-black/30 "
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
                      icon={<PaperAirplaneIcon className="size-5" />}
                      loading={isSubmitting}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className="mt-2 mr-3 py-1 pr-6 max-h-[220px] overflow-y-auto overflow-x-hidden">
        <CustomComments
          comments={selectedToilet?.comments}
          style="toilet-comment"
          textStyle="font-medium text-s5 text-sm"
          usernameTextStyle="text-text text-sm"
          avatarStyle="size-9"
          timeIntervalTextStyle="text-text comment-grid-comment text-end"
        />
      </div>
    </div>
  );
};

export default CommentGrid;
