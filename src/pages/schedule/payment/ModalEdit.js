import DialogContent from "@mui/material/DialogContent";
import {Autocomplete, Button, FormControl, Grid, InputAdornment, MenuItem, Select, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Accordion, AccordionTab} from "primereact/accordion";
import dayjs from "dayjs";
import {convertToAutoComplete} from "../../../constants/common";
import apiCategory from "../../../api/category";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {NumericFormat} from "react-number-format";
import apiTimeline from "../../../api/timeline";
import {toast} from "react-toastify";
import apiPayment from "../../../api/payment";
export default function ModalEdit(props) {
    const {
        id,
        idDetail,
        isUpdate,
        idProject,
        setId,
        openModal,
        handleCloseModal,
    } = props
    const [listProjectStatus,setListProjectStatus] = useState([]);
    const [isSubmit,setIsSubmit] = useState(false);
    const initialInfo = {
        "id":null,
        "date":new dayjs(),
        "description":"",
        "isPayment":true,
        "payment":
            {
                "id":"",
                "amount":"",
                "percent":"",
                "paymentTimes":"",
                "description":""

            },
        "projectStatus":{
            "id":"",
            "name":""
        }
    }
    const [info, setInfo] = useState(initialInfo);
    useEffect(()=>{
        if(!openModal){
            setIsSubmit(false)
            setInfo(initialInfo)
        }
    },[openModal])
    useEffect(()=>{
        console.log('info',info)
    },[info])
    const submit = () => {
        setIsSubmit(true)
        let result = {...info};
        result.projectId = idProject
        result.payment.percent = result.payment.percent.replace(",",".")

        if(info.description==""||info.description==null){
            result.description = null
        }
        if(info.projectStatus.id==null||info.projectStatus.id==""){
            result.projectStatus=null
        }

        if(info.payment.amount==""||info.payment.amount==0||info.payment.amount==null){
            toast.error("Số tiền không được để trống");
            result.payment=null
            return
        }
        else if(info.date==null){
            toast.error("Thời gian không được để trống");
            return
        }
        if (isUpdate){
            updateTimelineApi(result).then(r=>{
                toast.success("Cập nhật thành công");
                handleCloseModal();
            }).catch(e=>{
                console.log(e)
                toast.error("Có lỗi xảy ra")
                handleCloseModal();
            })
        }
        else {
            createTimelineApi(result).then(r=>{
                toast.success("Thêm mới thành công");
                handleCloseModal();
            }).catch(e=>{
                console.log(e)
                toast.error("Có lỗi xảy ra")
                handleCloseModal();
            })
        }


        console.log('info',info)
    }
    useEffect(()=>{
        console.log(info)
        if(isUpdate&&idDetail!=null){
            getDetailApi({
                id:idDetail
            }).then(r=>{
                if(r.data){
                    let result = r.data;

                    if(result.projectStatus==null){
                        result.projectStatus={id:"",name:""}
                    }
                    if(result.payment==null){
                        result.payment= {
                            "id":"",
                            "amount":"",
                            "percent":"",
                            "description":"",
                            "paymentTimes":""

                        }
                    }
                    result.payment.percent = result.payment.percent?.toString().replace(".",",")||""

                    // result.date = dayjs(info.date);
                    setInfo(result)
                }
            }).catch(e=>{
                console.log('e',e)
            })
        }
    },[idDetail])
    useEffect(()=>{
        getCategoryApi({paging: false, type: "ProjectStatus"}).then((r) => {
            setListProjectStatus(convertToAutoComplete(r.data.responses, 'name'))
        })
    },[])
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body)
    }
    const createTimelineApi = (body) => {
        return apiPayment.create(body);

    }
    const updateTimelineApi = (body) => {
        return apiPayment.update(body);

    }
    const getDetailApi = (body) => {
        return apiPayment.getDetail(body);

    }
    //
    // useEffect(() => {
    //     if (!openModal) {
    //         setInfo({})
    //         setId(null)
    //     }
    //
    // }, [openModal])
    // useEffect(() => {
    //     console.log("id", id)
    // }, [id])
    // useEffect(() => {
    //     if (id != null) {
    //         getDetailApi({paging: false, id: id}).then(r => {
    //             if (r.data.responses) {
    //                 let data = r.data.responses[0]
    //                 setInfo(data)
    //
    //             }
    //
    //         }).catch(r => {
    //             // alert("err")
    //         })
    //     }
    // }, [id])
    //
    //
    // const getDetailApi = (body) => {
    //     return apiProject.search(body)
    // }

    return (
        <div style={{width: '400px'}}>
            <Dialog PaperProps={{
                style: {
                    // height: '100%', // Set the height to 100% to make it full height
                },
            }} fullWidth open={openModal} onClose={handleCloseModal} maxWidth={'md'}>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        {isUpdate?"Cập nhật":"Thêm mới"}
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className={"modal-form"}>
                    <div style={{padding: '5px'}}>

                        <Grid container spacing={2}>
                            <Grid item md={6}>
                                <div className={'form-input'}>
                                    <div className={'label-input'}>Thời gian</div>
                                    <div className={'row-input-field'}>
                                        <LocalizationProvider style={{width: '100%'}}
                                                              dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                className={'new-date-apply'}
                                                style={{width: '100% !important', height: '30px'}}
                                                inputFormat="DD-MM-YYYY"
                                                value={info.date}
                                                onChange={value => setInfo({...info,date: value})}
                                                renderInput={(params) => <TextField size={"small"}
                                                                                    fullWidth {...params}
                                                                                    // error={!info.date?.isValid()||info.date==null}
                                                />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item md={6}>
                                <div className={'form-input'}>
                                    <div className={'label-input'}>Lần thanh toán</div>
                                    <div className={'row-input-field'}>
                                        <TextField
                                            size={"small"}
                                            className={'formik-input'}
                                            // variant="standard"
                                            value={info.payment.paymentTimes}
                                            onChange={(event)=>{setInfo({...info,payment: {...info.payment,paymentTimes: event.target.value}})}}
                                        />
                                    </div>
                                </div>
                            </Grid>

                            <Grid item md={6}>
                                <div className={'form-input'}>
                                    <div className={'label-input'}>Số tiền</div>
                                    <div className={'row-input-field'}>
                                        <NumericFormat
                                            className={'formik-input text-right'}
                                            size={"small"}
                                            value={info.payment.amount}
                                            customInput={TextField}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                            }}
                                            error={isSubmit && (info.payment.amount==""||info.payment.amount==0||info.payment.amount==null)}
                                            // error={isSubmit && Boolean(errors.amountOfBank)}
                                            thousandSeparator={"."}
                                            decimalSeparator={","}
                                            onValueChange={(values) => {
                                                const {formattedValue, value, floatValue} = values;
                                                const re = /^[0-9\b]+$/;

                                                if (re.test(floatValue)) {
                                                    setInfo({...info,payment: {...info.payment,amount: floatValue}})
                                                    // setFieldValue('amountOfEc', floatValue)
                                                }
                                                else if(floatValue==undefined){
                                                    setInfo({...info,payment: {...info.payment,amount: ''}})
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item md={6}>
                                <div className={'form-input'}>
                                    <div className={'label-input'}>Phần trăm</div>
                                    <div className={'row-input-field'}>
                                        <TextField
                                            size={"small"}
                                            id='percent'
                                            name='percent'
                                            className={'formik-input text-right'}                                                                // variant="standard"
                                            value={info.payment.percent}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                            onChange={(event) => {
                                                // const {formattedValue, value, floatValue} = values;
                                                // // do something with floatValue
                                                // console.log(floatValue)
                                                //
                                                // const re = /^[0-9\b]+$/;
                                                const re = /^[0-9,]+$/;

                                                if (re.test(event.target.value)) {
                                                    setInfo({...info,payment: {...info.payment,percent: event.target.value}})
                                                } else if (event.target.value == '') {
                                                    setInfo({...info,payment: {...info.payment,percent: ""}})


                                                }
                                            }}

                                        />

                                    </div>
                                </div>
                            </Grid>

                            <Grid item md={6}>
                                <div className={'form-input'}>
                                    <div className={'label-input'}>Ghi chú</div>
                                    <div className={'row-input-field'}>
                                        <TextField
                                            multiline={true}
                                            rows={3}
                                            size={"small"}
                                            className={'formik-input'}
                                            // variant="standard"
                                            value={info.payment.description}
                                            onChange={(event)=>{setInfo({...info,payment: {...info.payment,description: event.target.value}})}}
                                        />
                                    </div>
                                </div>
                            </Grid>
                        </Grid>


                    </div>
                </DialogContent>
                <DialogActions>
                    <div className={'modal-btn'}>
                        <Button variant="outlined" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button variant="contained" onClick={submit}>
                            Lưu
                        </Button>
                    </div>

                </DialogActions>
            </Dialog>
        </div>
    )
}