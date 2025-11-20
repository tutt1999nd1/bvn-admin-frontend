import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiNotification{
    getNotification= () => {
        return axiosClient.post(API_MAP.GET_NOTIFICATION)
    }
    readNotification= (body) => {
        return axiosClient.post(API_MAP.READ_NOTIFICATION,body)
    }

}

const apiNotification = new ApiNotification();

export default apiNotification;