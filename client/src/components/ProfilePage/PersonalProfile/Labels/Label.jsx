import CustomFormInputField from "@components/common/InputFiled/CustomFormInputField";
import { useState } from "react";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ErrorMessage, useFormikContext } from "formik";
import CustomButton from "@components/common/Button/CustomButton";

const ProfileDetailLabel = ({
  personalDetailKey,
  personalDetail,
  isEditDetailsEnabled,
  setFieldEditingState,
}) => {
  const formik = isEditDetailsEnabled ? useFormikContext() : null;

  const [allowEdit, setAllowEdit] = useState(false);
  const [dataBuffer, setDataBuffer] = useState(personalDetail.data);

  const onEditClicked = () => {
    setAllowEdit(true);
    setDataBuffer(formik.values[personalDetailKey])
    setFieldEditingState({ key: personalDetailKey, state: true });
  };

  const onEditConfirmClicked = () => {
    setDataBuffer(formik.values[personalDetailKey]);
    setAllowEdit(false);
    setFieldEditingState({ key: personalDetailKey, state: false });
  };

  const onCancelEditClicked = () => {
    formik.setFieldValue(personalDetailKey, dataBuffer);
    setAllowEdit(false);
    setFieldEditingState({ key: personalDetailKey, state: false });
  };

  const onMenuItemSelected = ({name, code}) => {
    formik.setFieldValue("location", name);
    formik.setFieldValue("tel_country_code", code);
  }

  return (
    <div className="flex flex-row gap-7 items-center justify-center max-w-[500px]">
      {personalDetail.icon}
      <div className="flex flex-col gap-2 items-start justify-center">
        <label
          htmlFor={personalDetailKey}
          className="text-[15px] md:text-md font-semibold text-s5"
        >
          {personalDetail.label}
        </label>
        {isEditDetailsEnabled && allowEdit ? (
          <div>
            <CustomFormInputField
              type="text"
              name={personalDetailKey}
              id={personalDetailKey}
              style="personal-profile-edit-inputfield"
              varient={`${
                formik.errors?.[personalDetailKey] &&
                formik.touched?.[personalDetailKey]
                  ? "border-red-warning-heavy"
                  : "border-black focus:border-blue-light"
              } ${personalDetailKey === "phone" && "pl-[100px]"}`}
              placeholder={personalDetail.placeholder}
              onMenuItemSelected={onMenuItemSelected}
            />
            <ErrorMessage
              name={personalDetailKey}
              component="div"
              className="text-red-warning-heavy text-sm font-semibold my-1"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[15px] md:text-md font-semibold text-s7 min-h-[20px]">
              {formik ? formik?.values?.[personalDetailKey] : personalDetail.data}
            </div>
            <hr className="border-b border-s2 w-[200px] md:w-[350px]" />
          </div>
        )}
      </div>

      {isEditDetailsEnabled && (
        <div className="mt-8">
          {allowEdit ? (
            <div
              className={`flex flex-row gap-x-5 ${
                formik.errors?.[personalDetailKey] ? "mb-7" : ""
              }`}
            >
              {!formik.errors?.[personalDetailKey] && (
                <CustomButton
                  icon={<CheckIcon className="size-5" />}
                  type="button"
                  style="profile-page-modal-edit-btn"
                  onClick={onEditConfirmClicked}
                />
              )}
              <CustomButton
                icon={<XMarkIcon className="size-5" />}
                type="button"
                style="profile-page-modal-edit-btn"
                onClick={onCancelEditClicked}
              />
            </div>
          ) : (
            <CustomButton
              icon={<PencilIcon className="size-5" />}
              type="button"
              style="profile-page-modal-edit-btn"
              onClick={onEditClicked}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDetailLabel;
