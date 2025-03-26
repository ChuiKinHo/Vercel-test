import ProfileDetailLabel from "./Label";

const ProfileDetailLabels = ({
  personalDetails,
  isEditDetailsEnabled,
  setFieldEditingState,
}) => {
  const personalDetailKeys = Object.keys(personalDetails);

  return personalDetailKeys?.map((key, index) => (
    <ProfileDetailLabel
      key={index}
      personalDetailKey={key}
      personalDetail={personalDetails[key]}
      isEditDetailsEnabled={isEditDetailsEnabled}
      setFieldEditingState={setFieldEditingState}
    />
  ));
};

export default ProfileDetailLabels;
