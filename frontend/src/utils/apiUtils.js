import axios from 'axios';
import constants from '../constants';

/* Configure axios response handling */
axios.interceptors.response.use(function (response) {
  // Optional: Do something with response data
  return response;
}, function (error) {
  // Do whatever you want with the response error here:

  // But, be SURE to return the rejected promise, so the caller still has 
  // the option of additional specialized handling at the call-site:
  return Promise.reject(error);
});

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

