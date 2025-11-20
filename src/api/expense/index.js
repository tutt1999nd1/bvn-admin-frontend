import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiExpense{
    download= () => {
        return axiosClient.get(API_MAP.EXPENSE_DOWNLOAD)
    }
    search= (body) => {
        return axiosClient.post(API_MAP.EXPENSE_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.EXPENSE_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.EXPENSE_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.EXPENSE_DELETE,body)
    }


}

const apiExpense = new ApiExpense();

export default apiExpense;