const toiletDataFormatter = (toilet) => {
  return {
    toiletId: toilet?._id,
    user: toilet?.userId,
    name_en: toilet?.name_en,
    name_zh: toilet?.name_zh,
    address_en: toilet?.address_en,
    address_zh: toilet?.address_zh,
    sub_district_en: toilet?.sub_district_en,
    sub_district_zh: toilet?.sub_district_zh,
    district_en: toilet?.district_en,
    district_zh: toilet?.district_zh,
    area_en: toilet?.area_en,
    area_zh: toilet?.area_zh,
    x_easting: toilet?.x_easting,
    y_northing: toilet?.y_northing,
    location: toilet?.location,
    type_of_toilet: toilet?.type_of_toilet,
    isMale: toilet?.isMale,
    isFemale: toilet?.isFemale,
    isDisabled: toilet?.isDisabled,
    haveBathroom: toilet?.haveBathroom,
    rating: toilet?.rating,
    views: toilet?.views,
    comments: toilet?.comments,
    multimedia: toilet?.multimedia,
  };
};

export default toiletDataFormatter;
