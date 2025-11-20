import apiDocument from "../../api/document";
import {useEffect} from "react";
import FileDownload from "js-file-download";
import Axios from "axios";
import API_MAP from "../../constants/api";

export default function Test() {
    // useEffect(()=>{
    //     Axios.get(API_MAP.DOCUMENT, {
    //         // headers: {'Authorization': `Bearer ${currentUser.accessToken}`},
    //         headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`},
    //         // responseType: 'blob'
    //     }).then(response => {
    //         let nameFile = response.headers['content-disposition'].split(`filename=`)[1]
    //         FileDownload(response.data, nameFile);
    //     }).catch(e => {
    //     })
    //     // downloadApi().then(response=>{
    //     //     console.log(response)
    //     //     let nameFile = response.headers['content-disposition'].split(`filename=`)[1]
    //     //     FileDownload(response.data, nameFile);
    //     // })
    // },[])
    const downloadApi = () => {
      return apiDocument.download();
    }
    return(<div>Tính năng đang phát triển</div>)
}