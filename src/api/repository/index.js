import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiRepository{
    getRepository= (body) => {
        return axiosClient.post(API_MAP.GET_REPOSITORY_BY_ORGANIZATION,body)
    }
    getRepositoryByUser= () => {
        return axiosClient.post(API_MAP.GET_REPOSITORY_BY_USER)
    }
    getRepositoryByUserPublic= () => {
        return axiosClient.post(API_MAP.GET_REPOSITORY_BY_USER_PUBLIC)
    }
    getDetailRepository= (body) => {
        return axiosClient.post(API_MAP.GET_DETAIL_REPOSITORY,body)
    }
    createRepository= (body) => {
        return axiosClient.post(API_MAP.CREATE_REPOSITORY,body)
    }
    updateRepository= (body) => {
        return axiosClient.post(API_MAP.UPDATE_REPOSITORY,body)
    }
    deleteRepository= (body) => {
        return axiosClient.post(API_MAP.DELETE_REPOSITORY,body)
    }

}

const apiRepository = new ApiRepository();

export default apiRepository;