import axios from 'axios';
import constants from '../constants';


export const getClient = () => {
  return axios.create({
    baseURL: constants.BASE_URL
  });
};


export const getCSRFToken = () => {
  let result = null;

  //Read all cookies
  const allCookies = document.cookie;

  if (allCookies) {
    // Get specific cookie (csrftoken)
    result = allCookies
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  }

  return result;
}

