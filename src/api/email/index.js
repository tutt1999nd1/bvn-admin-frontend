import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiEmail{
    getConfigEmail= () => {
        return axiosClient.post(API_MAP.GET_CONFIG_EMAIL)
    }
    updateConfigEmail= (body) => {
        return axiosClient.post(API_MAP.UPDATE_CONFIG_EMAIL,body)
    }
    checkConfigEmail= (body) => {
        return axiosClient.post(API_MAP.CHECK_CONFIG_EMAIL,body)
    }
}

const apiEmail = new ApiEmail();

export default apiEmail;