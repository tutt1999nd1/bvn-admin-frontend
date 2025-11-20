import React, {useEffect, useState} from "react";
import {Autocomplete, Box, Button, Divider, Grid, TextField} from "@mui/material";
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Accordion, AccordionTab} from "primereact/accordion";

import apiPermission from "../../../api/permission";

export default function PermissionEdit(props) {
    const navigate = useNavigate();
    const [location, setLocation] = useSearchParams();

    const [info, setInfo] = useState({
        "id": 0,
        "name": "",
        "code": "",
        "description": "",
    })
    const {isUpdate, type} = props
    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required('Không được để trống'),
        code: yup
            .string()
            .trim()
            .required('Không được để trống'),

    });
    const backList = () => {
        navigate('/permission')
    }
    useEffect(() => {
        if (isUpdate) {
            if (location.get('id')) {
                getDetailApi({
                    id: Number(location.get('id')),
                    paging: false,
                }).then(r => {
                    let data = r.data.responses[0]
                    setInfo(data)
                })
            } else navigate('/boss')
        }

    }, [location]);



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
        navigate('/permission')
    }

    const createApi = (body) => {
        return apiPermission.create(body)
    }
    const updateApi = (body) => {
        return apiPermission.update(body)
    }
    const getDetailApi = (body) => {
        return apiPermission.search(body);
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
                        "code": info.code,
                        "description": info.description,


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
                                                        <div className={'label-input'}>Tên
                                                            <span className={'error-message'}>*</span></div>
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
                                                        <div className={'label-input'}>Mã
                                                            <span className={'error-message'}>*</span></div>
                                                        <div className={'row-input-field'}>
                                                            <TextField
                                                                size={"small"}
                                                                id='code'
                                                                name='code'
                                                                className={'formik-input'}
                                                                // variant="standard"
                                                                value={values.code}
                                                                onChange={handleChange}
                                                                error={touched.code && Boolean(errors.code)}
                                                                helperText={touched.code && errors.code}
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
