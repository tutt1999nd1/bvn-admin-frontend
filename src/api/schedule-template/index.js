import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiScheduleTemplate{

    search= (body) => {
        return axiosClient.post(API_MAP.SCHEDULE_TEMPLATE_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.SCHEDULE_TEMPLATE_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.SCHEDULE_TEMPLATE_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.SCHEDULE_TEMPLATE_DELETE,body)
    }


}

const apiScheduleTemplate = new ApiScheduleTemplate();

export default apiScheduleTemplate;