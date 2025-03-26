import { Toilet, Multimedia, Rating } from "../../../models/index.js";
import {
  ErrorMessages,
  SuccessMessages,
} from "../../../utils/constants/Message.js";

const deleteNonVerifiedToilet = async (req, res) => {
  try {
    const { toiletId } = req.body;

    const non_verified_toilet = await Toilet.findById(toiletId);

    if (!non_verified_toilet) {
      return res.status(404).json({
        status: 404,
        message: ErrorMessages.TOILET_NOT_FOUND,
      });
    }

    const MultimediaToBeDeleted = non_verified_toilet.multimedia;
    const RatingToBeDeleted = non_verified_toilet.rating;

    if (MultimediaToBeDeleted.length > 0) {
      await Multimedia.deleteMany({ _id: { $in: MultimediaToBeDeleted } });
    }
    if (RatingToBeDeleted.length > 0) {
      await Rating.deleteMany({ _id: { $in: RatingToBeDeleted } });
    }
    await Toilet.findByIdAndDelete(toiletId);

    return res.status(200).json({
      status: 200,
      message: SuccessMessages.DELETE_NON_VERIFIED_TOILET_SUCCESS,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

export default deleteNonVerifiedToilet;
