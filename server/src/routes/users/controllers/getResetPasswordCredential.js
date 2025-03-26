import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getResetPasswordCredential = async (req, res) => {
  try {
    const data = req.tokenValue;
    return res.status(200).json({
      status: 200,
      data: data,
      message: SuccessMessages.VERIFICATION_SUCCESS,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getResetPasswordCredential;
