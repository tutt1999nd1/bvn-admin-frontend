import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiDossier{
    download= () => {
        return axiosClient.get(API_MAP.DOSSIER_DOWNLOAD)
    }
    search= (body) => {
        return axiosClient.post(API_MAP.DOSSIER_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.DOSSIER_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.DOSSIER_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.DOSSIER_DELETE,body)
    }


}

const apiDossier = new ApiDossier();

export default apiDossier;