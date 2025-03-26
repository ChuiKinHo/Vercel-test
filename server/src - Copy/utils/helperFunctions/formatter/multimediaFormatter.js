const multimediaFormatter = (multimedia) => {
  const formattedMultimedia = multimedia?.map((element) => {
    return {
      multimediaId: element?._id,
      multimedia_type: element?.multimedia_type,
      user: element?.userId,
      toilet: element?.toiletId,
      url: element?.url,
      likes: element?.likes,
      comments: element?.comments,
      createdAt: element?.createdAt,
    };
  });
  return formattedMultimedia;
};

export default multimediaFormatter;
