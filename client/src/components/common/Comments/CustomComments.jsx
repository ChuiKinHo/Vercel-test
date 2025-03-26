import CustomAvatar from "../Avatar/Avatar";
import calculateTimeInterval from "@utils/helperFunctions/calculateTimeInterval";
import { styles } from "./styles";

const CustomComments = ({
  comments,
  style = "default",
  varient,
  usernameTextStyle,
  timeIntervalTextStyle,
  textStyle,
  avatarStyle,
}) => {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      {comments?.map((comment, index) => (
        <div key={index}>
          <div className={`${styles[style]} ${varient}`}>
            <CustomAvatar
              src={comment?.userId?.userAvatar}
              alt="User Avatar"
              varient={`${avatarStyle}`}
            />
            <div className="flex flex-col gap-y-1 justify-center">
              <p className={`${usernameTextStyle}`}>
                {comment?.userId?.username}
              </p>
              <p className={`${textStyle} break-words whitespace-normal`}>
                {comment?.text}
              </p>
            </div>
          </div>
          <p className={timeIntervalTextStyle}>
            {calculateTimeInterval(comment.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CustomComments;
