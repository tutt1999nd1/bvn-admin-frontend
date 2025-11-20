import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class ApiCar{
    download= () => {
        return axiosClient.get(API_MAP.CAR_DOWNLOAD)
    }
    searchCar= (body) => {
        return axiosClient.post(API_MAP.CAR_SEARCH,body)
    }
    createCar= (body) => {
        return axiosClient.post(API_MAP.CAR_CREATE,body)
    }
    updateCar= (body) => {
        return axiosClient.post(API_MAP.CAR_UPDATE,body)
    }
    deleteCar= (body) => {
        return axiosClient.post(API_MAP.CAR_DELETE,body)
    }


}

const apiCar = new ApiCar();

export default apiCar;