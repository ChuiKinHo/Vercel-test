const nonVerifiedMultimediaFormatter = (non_verified_multimedia) => {
  const regroupedMultimedia = non_verified_multimedia.reduce(
    (acc, multimedia) => {
      const toiletId = multimedia.toiletId._id.toString();
      const userId = multimedia.userId._id.toString();

      // Create a unique key for each toiletId and userId combination
      const key = `${toiletId}-${userId}`;

      // Initialize the group if it doesn't exist
      if (!acc[key]) {
        acc[key] = {
          toilet: multimedia.toiletId,
          user: multimedia.userId,
          multimedia: [],
        };
      }

      // Add the multimedia item to the group
      acc[key].multimedia.push({
        multimediaId: multimedia._id,
        multimedia_type: multimedia.multimedia_type,
        url: multimedia.url,
      });

      return acc;
    },
    {}
  );

  // Convert the regrouped object into an array
  return Object.values(regroupedMultimedia);
};

export default nonVerifiedMultimediaFormatter;
