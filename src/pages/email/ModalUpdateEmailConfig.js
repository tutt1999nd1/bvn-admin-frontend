import DialogContent from "@mui/material/DialogContent";
import {Backdrop, Button, CircularProgress, Grid, Switch, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {toast} from "react-toastify";
import * as yup from "yup";
import {Form, Formik} from "formik";
import apiEmail from "../../api/email";


export default function ModalUpdateEmailConfig(props) {
    const {
        openModal,
        handleCloseModal,
        setIsRefresh,
        info} = props
    const [loading,setLoading] = useState(false)

    const [host,setHost] = useState("")
    const [status,setStatus] = useState(true)
    const [port,setPort] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("        ")
    const [firstChangePassword,setFirstChangePassword] = useState(true)
    const validationSchema = yup.object({
        host: yup
            .string()
            .trim()
            .required('Không được để trống'),
        port: yup
            .string()
            .trim()
            .required('Không được để trống'),
        username: yup
            .string()
            .trim()
            .required('Không được để trống'),
        password: yup
            .string()
            .required('Không được để trống'),

    });
    useEffect(() => {
        setFirstChangePassword(true)
        if (!openModal) {
        }
    }, [openModal])
    useEffect(()=>{
        console.log("firstChangePassword",firstChangePassword)
    },[firstChangePassword])
    useEffect(()=>{
        setHost(info.host)
        setPort(info.port)
        setUsername(info.username)
        setStatus(info.status)
    },[info])
    const submitForm = (values) => {
        setLoading(true)
        updateConfigApi({
            host:values.host,
            port:values.port,
            username:values.username,
            password:values.password,
            status:status

        }).then(r=>{
            setLoading(false)
            setIsRefresh(prevState => !prevState);
            toast.success("Cấu hình mail server thành công")
            handleCloseModal()
        }).catch(e=>{
            setLoading(false)

            toast.error("Cấu hình mail server thất bại")
        })
    }
    const checkConfig = (values) => {
        setLoading(true)
        checkConfigApi({
            host:values.host,
            port:values.port,
            username:values.username,
            password:values.password,
        }).then(r=>{
            setLoading(false)
            // setIsRefresh(prevState => !prevState);
            toast.success("Thông tin cấu hình hợp lệ")
        }).catch(e=>{
            setLoading(false)

            toast.error("Thông tin cấu hình không hợp lệ")
        })
    }
    const updateConfigApi = (body) => {
      return apiEmail.updateConfigEmail(body)
    }
    const checkConfigApi = (body) => {
        return apiEmail.checkConfigEmail(body)
    }
    return (
        <div >
            <Dialog fullWidth
                    open={openModal} onClose={handleCloseModal}
                    maxWidth={'sm'}
                // PaperProps={{
                //     style: {
                //         height: '100%', // Set the height to 100% to make it full height
                //     },
                // }}
            >
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={loading}
                    // onClick={handleClose}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <DialogTitle>
                    <div className={'vmp-tittle'}>
                        Cập nhật cấu hình mail server
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
                <Formik
                    enableReinitialize
                    initialValues={{
                        host:host,
                        port:port,
                        username:username,
                        password:password,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={
                        (values, actions) => {
                            console.log("Values: ",values)
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
                                <DialogContent dividers className={"model-project"}>

                                    <Grid container spacing={2}>
                                        <Grid item md={12}>
                                            <div className={'form-input'}>
                                                <div className={'label-input'}>Máy chủ mail<span className={'error-message'}>*</span></div>
                                                <div className={'row-input-field'}>
                                                    <TextField
                                                        size={"small"}
                                                        id='host'
                                                        name='host'
                                                        fullWidth
                                                        value={values.host}
                                                        onChange={handleChange}
                                                        error={touched.host && Boolean(errors.host)}
                                                        helperText={touched.host && errors.host}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={12}>
                                            <div className={'form-input'}>
                                                <div className={'label-input'}>Cổng<span className={'error-message'}>*</span></div>
                                                <div className={'row-input-field'}>
                                                    <TextField
                                                        size={"small"}
                                                        id='port'
                                                        name='port'
                                                        fullWidth
                                                        value={values.port}
                                                        onChange={(event) => {
                                                            // const {formattedValue, value, floatValue} = values;
                                                            // // do something with floatValue
                                                            // console.log(floatValue)
                                                            //
                                                            const re = /^[0-9\b]+$/;
                                                            if (re.test(event.target.value)) {
                                                                setFieldValue('port', event.target.value)
                                                            } else if (event.target.value == '') {
                                                                setFieldValue('port', "")

                                                            }
                                                        }}
                                                        error={touched.port && Boolean(errors.port)}
                                                        helperText={touched.port && errors.port}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={12}>
                                            <div className={'form-input'}>
                                                <div className={'label-input'}>Tên đăng nhập<span className={'error-message'}>*</span></div>
                                                <div className={'row-input-field'}>
                                                    <TextField
                                                        size={"small"}
                                                        id='username'
                                                        name='username'
                                                        fullWidth
                                                        value={values.username}
                                                        onChange={handleChange}
                                                        error={touched.username && Boolean(errors.username)}
                                                        helperText={touched.username && errors.username}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={12}>
                                            <div className={'form-input'}>
                                                <div className={'label-input'}>Mật khẩu<span className={'error-message'}>*</span></div>
                                                <div className={'row-input-field'}>
                                                    <TextField
                                                        type={'password'}
                                                        size={"small"}
                                                        id='password'
                                                        name='password'
                                                        fullWidth
                                                        value={values.password}
                                                        onChange={(event)=>{
                                                            if(firstChangePassword){
                                                                setFirstChangePassword(false)
                                                                setFieldValue('password', event.target.value.trim())
                                                            }else {
                                                                setFieldValue('password', event.target.value)
                                                            }
                                                        }}
                                                        error={touched.password && Boolean(errors.password)}
                                                        helperText={touched.password && errors.password}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={12}>
                                            <div className={'form-input'}>
                                                <div className={'label-input'}>Trạng thái</div>
                                                <div className={'row-input-field'}>
                                                    <Switch
                                                        checked={status}
                                                        onChange={(event)=>{
                                                            setStatus(event.target.checked)
                                                        }}
                                                        inputProps={{ 'aria-label': 'controlled' }} />
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Button variant="outlined" onClick={()=>{
                                        checkConfig(values)
                                    }}>
                                        Kiểm tra cấu hình
                                    </Button>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="outlined" onClick={handleCloseModal}>
                                        Hủy
                                    </Button>
                                    <Button type={"submit"} variant={'contained'}>Lưu</Button>
                                </DialogActions>
                            </Form>
                        )
                    }}
                </Formik>

            </Dialog>
        </div>
    )
}