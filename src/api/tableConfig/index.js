import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiTableConfig{
    get= (data) => {
        return axiosClient.post(API_MAP.GET_CONFIG_TABLE,data)
    }
    update= (data) => {
        return axiosClient.post(API_MAP.UPDATE_CONFIG_TABLE,data)
    }
    // default= (data) => {
    //     return axiosClient.post(API_MAP.DEFAULT_CONFIG_TABLE,data)
    // }

}

const apiTableConfig = new ApiTableConfig();

export default apiTableConfig;