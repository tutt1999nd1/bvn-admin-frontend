import axiosClient from "../axiosClient";
import API_MAP from "../../constants/api";
import {convertObjectToParameter} from "../../constants/common";

class DashboardApi {
    getPublishDocumentByOrganization= (body) => {
        return axiosClient.post(API_MAP.GET_PUBLISH_DOCUMENT_BY_ORGANIZATION,body)
    }
    getPublishDocumentByTime= (body) => {
        return axiosClient.post(API_MAP.GET_PUBLISH_DOCUMENT_BY_TIME,body)
    }
    getPublishDocumentByMonth= (body) => {
        return axiosClient.post(API_MAP.GET_PUBLISH_DOCUMENT_BY_MONTH,body)
    }
    getPublishDocumentByTypeDocument= (body) => {
        return axiosClient.post(API_MAP.GET_PUBLISH_DOCUMENT_BY_TYPE_DOCUMENT,body)
    }
    getDossierDashboardByGroupDossier= (body) => {
        return axiosClient.post(API_MAP.GET_DOSSIER_DASHBOARD_BY_GROUP_DOSSIER,body)
    }
    getDocumentDashboardByTypeDocument= (body) => {
        return axiosClient.post(API_MAP.GET_DOCUMENT_DASHBOARD_BY_TYPE_DOCUMENT,body)
    }
    getDossierLoanByTime= (body) => {
        return axiosClient.post(API_MAP.GET_DOSSIER_LOAN_BY_TIME,body)
    }
    getLateDossierLoan= (body) => {
        return axiosClient.post(API_MAP.GET_LATE_DOSSIER_LOAN,body)
    }


}

const apiDashboard = new DashboardApi();

export default apiDashboard;