import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiChecklistCar{

    search= (body) => {
        return axiosClient.post(API_MAP.CHECKLIST_CAR_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.CHECKLIST_CAR_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.CHECKLIST_CAR_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.CHECKLIST_CAR_DELETE,body)
    }


}

const apiChecklistCar = new ApiChecklistCar();

export default apiChecklistCar;