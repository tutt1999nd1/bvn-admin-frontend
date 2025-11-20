import {
    Backdrop,
    Button,
    CircularProgress, createTheme, Divider, Grid, Pagination, Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField, Tooltip
} from "@mui/material";
import apiUser from "../../api/user";
import React, {useEffect, useState} from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import apiLoginHistory from "../../api/login-history";
import moment from "moment";
import LogoutIcon from '@mui/icons-material/Logout';
import {ThemeProvider, useTheme} from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import apiEmail from "../../api/email";
import ModalUpdateEmailConfig from "./ModalUpdateEmailConfig";
export default function EmailPage() {
    const [openModal,setOpenModal] = useState(false)
    const [info,setInfo] = useState({})
    const [isRefresh,setIsRefresh] = useState(true);
    useEffect(()=>{
        console.log("info",info)
    },[info])
    useEffect(()=>{
        getConfig().then(r=>{
            setInfo(r.data)
        })
    },[isRefresh])
    const handleCloseModal = () => {
        setOpenModal(false)
    }
    const getConfig = (body) => {
        return apiEmail.getConfigEmail(body);
    }

    return (
        <div className={'main-content'} style={{fontSize:"0.8rem",marginTop:'10px',marginLeft:'10px'}}>

            <ModalUpdateEmailConfig  setIsRefresh={setIsRefresh} info={info} openModal={openModal} handleCloseModal={handleCloseModal}> </ModalUpdateEmailConfig>
            <div style={{width:'40%',border:'1px solid #d4d4d4', padding:'10px'}}>
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        <div className={'row-detail'}>
                            <div className={'row-detail-label'} style={{width:'300px'}}>
                                Máy chủ mail:
                            </div>
                            <div className={'row-detail-info'}>
                                {info.username || ''}
                            </div>

                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <div className={'row-detail'}>
                            <div className={'row-detail-label'} style={{width:'300px'}}>Cổng:</div>
                            <div className={'row-detail-info'}>
                                {info.port || ''}
                            </div>

                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <div className={'row-detail'}>
                            <div className={'row-detail-label'} style={{width:'300px'}}>Tên đăng nhập:</div>
                            <div className={'row-detail-info'}>
                                {info.username || ''}
                            </div>

                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <div className={'row-detail'}>
                            <div className={'row-detail-label'} style={{width:'300px'}}>Mật khẩu:</div>
                            <div className={'row-detail-info'}>
                                ********
                            </div>

                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <div className={'row-detail'}>
                            <div className={'row-detail-label'} style={{width:'300px'}}>Phương thức bảo mật:</div>
                            <div className={'row-detail-info'}>
                                STARTTLS
                            </div>

                        </div>
                    </Grid>
                    <Grid item md={12}>
                        <div className={'row-detail'}>
                            <div className={'row-detail-label'} style={{width:'300px'}}>Trạng thái:</div>
                            <div className={'row-detail-info'}>
                                {info.status?"Hoạt động":"Đã tắt"}
                            </div>

                        </div>
                    </Grid>
                </Grid>
            </div>
            <Button style={{marginTop:'10px'}} variant={"outlined"} onClick={()=>{setOpenModal(true)}}>Cập nhật</Button>

        </div>)
}