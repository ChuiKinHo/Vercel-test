import { Multimedia } from "../../../models/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const deleteNonVerifiedMultimedia = async (req, res) => {
  try {
    const { multimediaIds } = req.body;

    if (multimediaIds.length > 0) {
      await Multimedia.deleteMany({ _id: { $in: multimediaIds } });
    }

    return res.status(200).json({
      status: 200,
      message: SuccessMessages.DELETE_NON_VERIFIED_MULTIMEDIA_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default deleteNonVerifiedMultimedia;
