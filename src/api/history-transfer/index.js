import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class HistoryTransfer{
    download= () => {
        return axiosClient.get(API_MAP.HISTORY_TRANSFER_DOWNLOAD)
    }
    search= (body) => {
        return axiosClient.post(API_MAP.HISTORY_TRANSFER_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.HISTORY_TRANSFER_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.HISTORY_TRANSFER_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.HISTORY_TRANSFER_DELETE,body)
    }


}

const apiHistoryTransfer = new HistoryTransfer();

export default apiHistoryTransfer;