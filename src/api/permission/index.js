import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiPermission{
    search= (data) => {
        return axiosClient.post(API_MAP.SEARCH_PERMISSION,data)
    }
    create= (data) => {
        return axiosClient.post(API_MAP.CREATE_PERMISSION,data)
    }
    update= (data) => {
        return axiosClient.post(API_MAP.UPDATE_PERMISSION,data)
    }
    delete= (data) => {
        return axiosClient.post(API_MAP.DELETE_PERMISSION,data)
    }

}

const apiPermission = new ApiPermission();

export default apiPermission;