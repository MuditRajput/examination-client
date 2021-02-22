import axios from 'axios';
import { baseURL } from '../../configs/Constants';

export const callApi = async (method, route, data, params) => {
  try {
    const response = await axios({
      method,
      baseURL,
      url: route,
      data,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      params,
    });
    return response;
  } catch (err) {
    const serverError = {
      data: {
        message: 'Internal Server Error',
      },
    };
    if (err.response) {
      return err.response;
    }
    return serverError;
  }
};
