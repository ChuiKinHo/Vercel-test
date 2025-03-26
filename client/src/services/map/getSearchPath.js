import axios from "axios";

const getSearchPath = async ({ start, end, accessToken }) => {
    const res = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`
    );
    return res.data;
  };
  
export default getSearchPath;
