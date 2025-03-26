import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const getRegistrationCredential = async (req, res) => {
  try {
    const { email } = req.cookieValue;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: ErrorMessages.COOKIE_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: 200,
      data: { email: email },
      message: SuccessMessages.GET_CREDENTIAL_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getRegistrationCredential;
