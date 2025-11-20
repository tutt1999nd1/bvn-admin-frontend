import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiBoss{
    search= (body) => {
        return axiosClient.post(API_MAP.BOSS_SEARCH,body)
    }
    create= (body) => {
        return axiosClient.post(API_MAP.BOSS_CREATE,body)
    }
    update= (body) => {
        return axiosClient.post(API_MAP.BOSS_UPDATE,body)
    }
    delete= (body) => {
        return axiosClient.post(API_MAP.BOSS_DELETE,body)
    }


}

const apiBoss = new ApiBoss();

export default apiBoss;