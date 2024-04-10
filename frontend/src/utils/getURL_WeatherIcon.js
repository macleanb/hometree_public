/* Internal Imports */
import constants from "../constants";

const getURL_WeatherIcon = (iconCode) => {
  return constants.URL_WEATHER_ICON + iconCode + '.png';
};

export default getURL_WeatherIcon;