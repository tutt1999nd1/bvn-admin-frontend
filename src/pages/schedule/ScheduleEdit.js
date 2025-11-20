import React, {useEffect, useState} from "react";
import {Autocomplete, Box, Button, Divider, Grid, InputAdornment, TextField} from "@mui/material";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Accordion, AccordionTab} from "primereact/accordion";
import {DateTimePicker, DesktopDatePicker, DesktopDateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {convertToAutoComplete} from "../../constants/common";
import apiCategory from "../../api/category";
import {NumericFormat} from "react-number-format";
import apiSchedule from "../../api/schedule";
import apiUser from "../../api/user";

export default function ScheduleEdit(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();
    const [listScheduleStatus, setListScheduleStatus] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [listDocumentType, setListDocumentType] = useState([]);


    const [info, setInfo] = useState({
        "id": 0,
        "name": "",
        "customerName": "",
        "referralSource": "",
        "date": new dayjs(),
        "feesNotary": "",
        "feesTransportation": "",
        "feesCopy": "",
        "feesCollection": "",
        "address":"",
        "description":"",
        "contact":"",
        "notary": {
            id: "",
            name: ""
        },
        "documentType": {
            id: "",
            code: ""
        },
        "scheduleStatus": {
            id: "",
            name: ""
        },


    })
    const {isUpdate, type} = props
    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required('Không được để trống'),



    });
    const backList = () => {
        window.history.back();
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                getDetailApi({
                    id: Number(location.get('id')),
                    paging: false,
                }).then(r => {
                    let data = r.data
                    console.log("data",data)
                    console.log("notary",data.notary)
                    setInfo(data)
                })
            } else navigate('/')
        }

    }, [location]);

    useEffect(() => {
        getCategoryApi({paging: false, type: "ScheduleStatus"}).then((r) => {
            setListScheduleStatus(convertToAutoComplete(r.data.responses, 'name'))
        })
        getCategoryApi({paging: false, type: "DocumentType"}).then((r) => {
            setListDocumentType(convertToAutoComplete(r.data.responses, 'name'))
        })
        getListUserApi({paging: false}).then((r) => {
            setListUser(convertToAutoComplete(r.data.responses, 'fullName'))
        })


    }, [])

    const submitForm = (value) => {
        if (isUpdate) {
            value.id = Number(location.get('id'));
            updateApi(value).then((r) => {
                toast.success("Cập nhật thành công");
                back()
            }).catch(e => {
                toast("Có lỗi xảy ra")
                console.log(e)
            })
        } else {
            createApi(value).then((r) => {
                toast.success("Thêm mới thành công");
                back()
            }).catch(e => {
                toast("Có lỗi xảy ra")
                console.log(e)
            })
        }

    }

    const back = () => {
        navigate("/schedule");
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body)
    }

    const createApi = (body) => {
        return apiSchedule.create(body)
    }
    const updateApi = (body) => {
        return apiSchedule.update(body)
    }
    const getDetailApi = (body) => {
        return apiSchedule.getDetail(body);
    }
    const getListUserApi = (body) => {
        return apiUser.getListUser(body);
    }

    return (
        <div className={'main-content'}>
            <div className={'main-content-body'}>
                <div className={'main-content-body-tittle'}>
                    <h4>{isUpdate ? 'Cập nhật' : 'Thêm mới'} </h4>
                </div>
                <Divider light/>
                <Formik
                    enableReinitialize
                    initialValues={{
                        "id": info.id,
                        "name": info.name,
                        "customerName": info.customerName||"",
                        "referralSource": info.referralSource,
                        "feesNotary": info.feesNotary,
                        "feesTransportation": info.feesTransportation,
                        "feesCopy": info.feesCopy,
                        "feesCollection": info.feesCollection,
                        "description": info.description,
                        "address":info.address,
                        "contact":info.contact,
                        "date": isUpdate ? dayjs(info.date) : info.date,
                        "scheduleStatusId": info.scheduleStatus?.id||"",
                        "scheduleStatusName": info.scheduleStatus?.name||"",
                        "documentTypeId": info.documentType?.id||"",
                        "documentTypeName": info.documentType?.name||"",
                        "notaryId": info.notary?.id||"",
                        "notaryName": info.notary?.fullName||"",



                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            console.log("Values: ", values)
                            submitForm(values)
                        }
                    }
                >
                    {props => {
                        const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            setFieldValue,
                            handleSubmit
                        } = props;
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Box sx={{flexGrow: 1}} className={'form-content'}>
                                    <Accordion multiple activeIndex={[0, 1, 2]}>
                                        <AccordionTab header={"Thông tin chi tiết"}>
                                            <Grid container spacing={2}>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Lịch hẹn
                                                            <span className={'error-message'}>*</span>
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <TextField
                                                                size={"small"}
                                                                id='name'
                                                                name='name'
                                                                className={'formik-input'}
                                                                // variant="standard"
                                                                value={values.name}
                                                                onChange={handleChange}
                                                                error={touched.name && Boolean(errors.name)}
                                                                helperText={touched.name && errors.name}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Tên khách hàng
                                                            <span className={'error-message'}>*</span>
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <TextField
                                                                size={"small"}
                                                                id='customerName'
                                                                name='customerName'
                                                                className={'formik-input'}
                                                                // variant="standard"
                                                                value={values.customerName}
                                                                onChange={handleChange}
                                                                error={touched.customerName && Boolean(errors.customerName)}
                                                                helperText={touched.customerName && errors.customerName}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Người giới thiệu
                                                            {/*<span className={'error-message'}>*</span>*/}
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <TextField
                                                                size={"small"}
                                                                id='referralSource'
                                                                name='referralSource'
                                                                className={'formik-input'}
                                                                // variant="standard"
                                                                value={values.referralSource}
                                                                onChange={handleChange}
                                                                error={touched.referralSource && Boolean(errors.referralSource)}
                                                                helperText={touched.referralSource && errors.referralSource}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Phí công chứng
                                                            {/*<span className={'error-message'}>*</span>*/}
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <NumericFormat
                                                                id='feesNotary'
                                                                name='feesNotary'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.feesNotary}
                                                                customInput={TextField}
                                                                error={touched.feesNotary && Boolean(errors.feesNotary)}
                                                                helperText={touched.feesNotary && errors.feesNotary}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                                onValueChange={(values) => {
                                                                    const {formattedValue, value, floatValue} = values;
                                                                    const re = /^[0-9\b]+$/;
                                                                    if (re.test(floatValue)) {
                                                                        setFieldValue('feesNotary', floatValue)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Phí di chuyển
                                                            {/*<span className={'error-message'}>*</span>*/}
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <NumericFormat
                                                                id='feesTransportation'
                                                                name='feesTransportation'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.feesTransportation}
                                                                customInput={TextField}
                                                                error={touched.feesTransportation && Boolean(errors.feesTransportation)}
                                                                helperText={touched.feesTransportation && errors.feesTransportation}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                                onValueChange={(values) => {
                                                                    const {formattedValue, value, floatValue} = values;
                                                                    const re = /^[0-9\b]+$/;
                                                                    if (re.test(floatValue)) {
                                                                        setFieldValue('feesTransportation', floatValue)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Phí sao y
                                                            {/*<span className={'error-message'}>*</span>*/}
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <NumericFormat
                                                                id='feesCopy'
                                                                name='feesCopy'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.feesCopy}
                                                                customInput={TextField}
                                                                error={touched.feesCopy && Boolean(errors.feesCopy)}
                                                                helperText={touched.feesCopy && errors.feesCopy}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                                onValueChange={(values) => {
                                                                    const {formattedValue, value, floatValue} = values;
                                                                    const re = /^[0-9\b]+$/;
                                                                    if (re.test(floatValue)) {
                                                                        setFieldValue('feesCopy', floatValue)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Phí thu hộ
                                                            {/*<span className={'error-message'}>*</span>*/}
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <NumericFormat
                                                                id='feesCollection'
                                                                name='feesCollection'
                                                                className={'formik-input text-right'}
                                                                size={"small"}
                                                                value={values.feesCollection}
                                                                customInput={TextField}
                                                                error={touched.feesCollection && Boolean(errors.feesCollection)}
                                                                helperText={touched.feesCollection && errors.feesCollection}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                                                                }}
                                                                thousandSeparator={"."}
                                                                decimalSeparator={","}
                                                                onValueChange={(values) => {
                                                                    const {formattedValue, value, floatValue} = values;
                                                                    const re = /^[0-9\b]+$/;
                                                                    if (re.test(floatValue)) {
                                                                        setFieldValue('feesCollection', floatValue)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Loại việc</div>
                                                        <div className={'row-input-field'}>
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={listDocumentType}
                                                                value={{
                                                                    id: values.documentTypeId,
                                                                    label: values.documentTypeName
                                                                }
                                                                }

                                                                renderInput={(params) => < TextField  {...params}
                                                                                                      id='documentTypeId'
                                                                                                      name='documentTypeId'
                                                                                                      placeholder=""
                                                                                                      error={touched.documentTypeId && Boolean(errors.documentTypeId)}
                                                                                                      helperText={touched.documentTypeId && errors.documentTypeId}/>}
                                                                size={"small"}
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setFieldValue('documentTypeId', newValue.id)
                                                                        setFieldValue('documentTypeName', newValue.label)

                                                                    } else {
                                                                        setFieldValue('documentTypeId', '')
                                                                        setFieldValue('documentTypeName', '')

                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Trạng thái</div>
                                                        <div className={'row-input-field'}>
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={listScheduleStatus}
                                                                value={{
                                                                    id: values.scheduleStatusId,
                                                                    label: values.scheduleStatusName
                                                                }
                                                                }

                                                                renderInput={(params) => < TextField  {...params}
                                                                                                      id='scheduleStatusId'
                                                                                                      name='scheduleStatusId'
                                                                                                      placeholder=""
                                                                                                      error={touched.scheduleStatusId && Boolean(errors.scheduleStatusId)}
                                                                                                      helperText={touched.scheduleStatusId && errors.scheduleStatusId}/>}
                                                                size={"small"}
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setFieldValue('scheduleStatusId', newValue.id)
                                                                        setFieldValue('scheduleStatusName', newValue.label)

                                                                    } else {
                                                                        setFieldValue('scheduleStatusId', '')
                                                                        setFieldValue('scheduleStatusName', '')

                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Công chứng viên</div>
                                                        <div className={'row-input-field'}>
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={listUser}
                                                                value={{
                                                                    id: values.notaryId,
                                                                    label: values.notaryName
                                                                }
                                                                }

                                                                renderInput={(params) => < TextField  {...params}
                                                                                                      id='notaryId'
                                                                                                      name='notaryId'
                                                                                                      placeholder=""
                                                                                                      error={touched.notaryId && Boolean(errors.notaryId)}
                                                                                                      helperText={touched.notaryId && errors.notaryId}/>}
                                                                size={"small"}
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setFieldValue('notaryId', newValue.id)
                                                                        setFieldValue('notaryName', newValue.label)

                                                                    } else {
                                                                        setFieldValue('notaryId', '')
                                                                        setFieldValue('notaryName', '')

                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>

                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Thời gian
                                                            {/*<span className={'error-message'}>*</span>*/}
                                                        </div>
                                                        <div className={'row-input-field'}>
                                                            <LocalizationProvider style={{width: '100%'}}
                                                                                  dateAdapter={AdapterDayjs}>
                                                                <DateTimePicker
                                                                    className={'new-date-apply'}
                                                                    style={{width: '100% !important', height: '30px'}}
                                                                    inputFormat="HH:mm:ss DD-MM-YYYY"
                                                                    referenceDate={dayjs('2022-04-17T15:30')}

                                                                    value={values.date}
                                                                    onChange={value => props.setFieldValue("date", value)}
                                                                    error={touched.date && Boolean(errors.date)}
                                                                    // error={touchSubmit && dayjs(values.founding_date).format('DD-MM-YYYY') == "Invalid Date"}
                                                                    helperText={touched.date && errors.date}
                                                                    renderInput={(params) => <TextField size={"small"}
                                                                                                        fullWidth {...params} />}
                                                                />
                                                                {/*<DateTimePicker*/}
                                                                {/*    label="Responsive"*/}
                                                                {/*    renderInput={(params) => <TextField {...params} />}*/}
                                                                {/*    value={value}*/}
                                                                {/*    onChange={(newValue) => {*/}
                                                                {/*        setValue(newValue);*/}
                                                                {/*    }}*/}
                                                                {/*/>*/}
                                                                {/*<DesktopDateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />*/}
                                                            </LocalizationProvider>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Địa chỉ</div>
                                                        <div className={'row-input-field'}>
                                                            <TextField
                                                                multiline={true}
                                                                rows={3}
                                                                size={"small"}
                                                                id='address'
                                                                name='address'
                                                                className={'formik-input'}
                                                                // variant="standard"
                                                                value={values.address}
                                                                onChange={handleChange}
                                                                error={touched.address && Boolean(errors.address)}
                                                                helperText={touched.address && errors.address}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Thông tin liên hệ</div>
                                                        <div className={'row-input-field'}>
                                                            <TextField
                                                                multiline={true}
                                                                rows={3}
                                                                size={"small"}
                                                                id='contact'
                                                                name='contact'
                                                                className={'formik-input'}
                                                                // variant="standard"
                                                                value={values.contact}
                                                                onChange={handleChange}
                                                                error={touched.contact && Boolean(errors.contact)}
                                                                helperText={touched.contact && errors.contact}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <div className={'row-input'}>
                                                        <div className={'label-input'}>Ghi chú
                                                            </div>
                                                        <div className={'row-input-field'}>
                                                            <TextField
                                                                multiline={true}
                                                                rows={3}
                                                                size={"small"}
                                                                id='description'
                                                                name='description'
                                                                className={'formik-input'}
                                                                // variant="standard"
                                                                value={values.description}
                                                                onChange={handleChange}
                                                                error={touched.description && Boolean(errors.description)}
                                                                helperText={touched.description && errors.description}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                            </Grid>

                                        </AccordionTab>

                                    </Accordion>

                                    <div className={''}
                                         style={{display: "flex", justifyContent: "center", marginTop: '10px'}}>
                                        <Button style={{marginRight: '10px'}} onClick={backList}
                                                variant="outlined">Hủy</Button>
                                        <Button variant="contained"
                                                type='submit'>Lưu</Button>

                                    </div>
                                </Box>

                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    )
}
