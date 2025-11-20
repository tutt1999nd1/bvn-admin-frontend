import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiMaintenance{
    search= (body) => {
        return axiosClient.post(API_MAP.MAINTENANCE_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.MAINTENANCE_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.MAINTENANCE_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.MAINTENANCE_DELETE,body)
    }


}

const apiMaintenance = new ApiMaintenance();

export default apiMaintenance;