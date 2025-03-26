import ProfileFriendLabel from "./Label";

const ProfileDetailLabels = ({ friendsDetails }) => {
  return friendsDetails?.map((friendDetail, index) => (
    <ProfileFriendLabel key={index} friendDetail={friendDetail} />
  ));
};

export default ProfileDetailLabels;
