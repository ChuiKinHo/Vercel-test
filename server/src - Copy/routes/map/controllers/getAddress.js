import axios from "axios";

const getAddress = async ({
  longitude,
  latitude,
  GOOGLE_API_KEY,
  language,
}) => {
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=${
      language == "en_us" ? "en" : "zh-Hant"
    }`
  );

  if (res.data.results && res.data.results.length > 0) {
    let sub_district = "";
    let area = "";
    res.data.results[0].address_components.forEach((address_components) => {
      if (address_components.types.includes("neighborhood")) {
        sub_district = address_components.long_name;
      } else if (
        address_components.types.includes("administrative_area_level_1")
      ) {
        area = address_components.long_name;
      }
    });

    return {
      address: res.data.results[0].formatted_address,
      area: area,
      sub_district: sub_district,
    };
  }

  return null;
};

export default getAddress;
