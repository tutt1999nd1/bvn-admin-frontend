import {Box, Button, FormControl, Grid, MenuItem, Select, TextField,} from "@mui/material";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Form, Formik} from "formik";
import {toast} from "react-toastify";
import * as yup from 'yup';
import apiRepository from "../../api/repository";

export default function ModalEditRepositoryChild(props) {
    const {currentRepository,currentRepositoryChild, isUpdateChild, openModalEditChild, handleCloseModalEditChild, isRefresh,setIsRefresh} = props;
    const [disable, setDisable] = useState(false);

    const [info, setInfo] = useState({
        id:null,
        name: '',
        code: '',
        description: '',
        parentId: null,
        location:'',
        status:'empty'
    })
    const validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .required('Không được để trống')
            .max(255, 'Tối đa 255 ký tự'),

        // description: yup
        //     .string()
        //     .trim()
        //     .required('Không được để trống')
        //     .max(255, 'Tối đa 4000 ký tự'),


    });
    useEffect(() => {
        if(isUpdateChild){
            getDetailRepositoryApi({
                id:currentRepositoryChild.id
            }).then(r=>{
                setInfo(r.data);
                console.log("tutt r.data",r.data)
            }).catch(e=>{

            })
            // setInfo(updateOrganization);
        }
    }, [isUpdateChild,currentRepositoryChild])

    const submit = (value) => {
        if(!isUpdateChild){
            createRepositoryApi(
                {
                    name:value.name,
                    code:value.code,
                    description:value.description,
                    location:value.location,
                    parentId: currentRepository.id,
                    status:value.status
                }
            ).then(r=>{
                toast.success("Thêm mới thành công")
                handleCloseModalEditChild()
                setIsRefresh(!isRefresh)
            })
        }
        else {
            updateRepositoryApi(
                {
                    id:currentRepositoryChild.id,
                    name:value.name,
                    code:value.code,
                    description:value.description,
                    location:value.location,
                    parentId: currentRepository.id,
                    status:value.status
                }
            ).then(r=>{
                toast.success("Cập nhật thành công")
                handleCloseModalEditChild()
                setIsRefresh(!isRefresh)

            })
        }

    }

    const createRepositoryApi = (body) => {
        return apiRepository.createRepository(body)
    }
    const updateRepositoryApi = (body) => {
        return apiRepository.updateRepository(body)
    }
    const getDetailRepositoryApi = (body) => {
        return apiRepository.getDetailRepository(body)
    }
    const [filterValue, setFilterValue] = useState('');
    useEffect(()=>{
        if(!openModalEditChild){
            setInfo({
                id:null,
                name: '',
                code: '',
                description: '',
                parentId: null,
                location:'',
                status:'empty'
            })
        }
    },[openModalEditChild])
    const filterOptions = {
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
        filterValue: filterValue,

    };

    return (

        <div style={{width:'400px'}}>
            <Dialog className={"modal"}  open={openModalEditChild} onClose={handleCloseModalEditChild}
                    fullWidth={true}
                    maxWidth="sm"
            >

                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        {
                            isUpdateChild?"Sửa phương tiện lưu trữ":"Thêm phương tiện lưu trữ"
                        }
                    </div>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModalEditChild}
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
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: info.name,
                        description: info.description,
                        code: info.code,
                        location: info.location,
                        status:info.status
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            let valueConvert = {...values};
                            submit(valueConvert)
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
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} md={12}>
                                            <div className={'label-input'}>Tên<span
                                                className={'error-message'}>*</span></div>
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
                                        </Grid>

                                        <Grid item xs={6} md={12}>
                                            <div className={'label-input'}>Mô tả</div>
                                            <TextField
                                                className={'formik-input'}
                                                // variant="standard"
                                                id='description'
                                                name='description'
                                                multiline
                                                rows={3}
                                                value={values.description}
                                                onChange={handleChange}
                                                error={touched.description && Boolean(errors.description)}
                                                helperText={touched.description && errors.description}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <div className={'label-input'}>Địa điểm</div>
                                            <TextField
                                                size={"small"}
                                                id='location'
                                                name='location'
                                                className={'formik-input'}
                                                // variant="standard"
                                                value={values.location}
                                                onChange={handleChange}
                                                error={touched.location && Boolean(errors.location)}
                                                helperText={touched.location && errors.location}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={12}>
                                            <div className={'label-input'}>Trạng thái</div>
                                            <FormControl fullWidth>
                                                <Select
                                                    id='status'
                                                    name='status'
                                                    value={values.status}
                                                    onChange={(event) => {
                                                        setFieldValue('status', event.target.value);
                                                    }}
                                                    size={"small"}>
                                                    <MenuItem value={'empty'}>Còn trống</MenuItem>
                                                    <MenuItem value={'full'}>Đã đầy</MenuItem>
                                                </Select>

                                            </FormControl>
                                        </Grid>
                                        {/*<Grid item xs={6} md={6}>*/}
                                        {/*    <input type="file"/>*/}
                                        {/*</Grid>*/}
                                        <Grid item xs={6} md={12}>
                                            <div className={''} style={{display: "flex", justifyContent: "center"}}>
                                                <Button style={{marginRight: '10px'}} onClick={handleCloseModalEditChild}
                                                        variant="outlined">Hủy</Button>
                                                <Button disabled={disable} variant="contained"
                                                        type='submit'>Lưu</Button>

                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>

                            </Form>
                        )
                    }}
                </Formik>

            </Dialog>
        </div>
    );
}