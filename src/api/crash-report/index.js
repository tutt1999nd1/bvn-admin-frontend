import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiCrashReport{
    search= (body) => {
        return axiosClient.post(API_MAP.CRASH_REPORT_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.CRASH_REPORT_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.CRASH_REPORT_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.CRASH_REPORT_DELETE,body)
    }


}

const apiCrashReport = new ApiCrashReport();

export default apiCrashReport;