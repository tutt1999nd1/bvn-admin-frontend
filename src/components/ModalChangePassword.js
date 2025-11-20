import DialogContent from "@mui/material/DialogContent";
import {Backdrop, Button, CircularProgress, Grid, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {toast} from "react-toastify";
import * as yup from "yup";
import {Form, Formik} from "formik";
import apiUser from "../api/user";


export default function ModalChangePassword(props) {
    const {
        openModal,
        handleCloseModal,
        setIsRefresh,
        info} = props
    const [loading,setLoading] = useState(false)

    const validationSchema = yup.object({
        oldPassword: yup
            .string()
            .required('Mật khẩu không được để trống'),
        newPassword: yup
            .string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .test('passwordsg-match', 'Mật khẩu mới không được trùng mật khẩu cũ', function (value) {
                return this.parent.oldPassword !== value
            })
            .required('Mật khẩu không được để trống'),
        rePassword: yup.string()
            .test('passwords-match', 'Mật khẩu không khớp', function (value) {
                return this.parent.newPassword === value
            })
    })
    useEffect(() => {
        if (!openModal) {
        }
    }, [openModal])


    const submitForm = (values) => {
        setLoading(true)
        changePasswordApi({
            oldPassword:values.oldPassword,
            newPassword:values.newPassword,
        }).then(r=>{
            setLoading(false)
            toast.success("Đổi mật khẩu thành công")
            handleCloseModal()
        }).catch(e=>{
            setLoading(false)
            console.log("error",e)
            toast.error("Mật khẩu cũ không đúng")
        })
    }
    const changePasswordApi = (body) => {
      return apiUser.changePassword(body);
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
                        Đổi mật khẩu
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
                        oldPassword:"",
                        rePassword:"",
                        newPassword:"",
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
                                                <div className={'label-input'}>Mật khẩu cũ<span className={'error-message'}>*</span></div>
                                                <div className={'row-input-field'}>
                                                    <TextField
                                                        size={"small"}
                                                        id='oldPassword'
                                                        name='oldPassword'
                                                        fullWidth
                                                        type={"password"}
                                                        value={values.oldPassword}
                                                        onChange={handleChange}
                                                        error={touched.oldPassword && Boolean(errors.oldPassword)}
                                                        helperText={touched.oldPassword && errors.oldPassword}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={12}>
                                            <div className={'form-input'}>
                                                <div className={'label-input'}>Mật khẩu mới<span className={'error-message'}>*</span></div>
                                                <div className={'row-input-field'}>
                                                    <TextField
                                                        size={"small"}
                                                        id='newPassword'
                                                        name='newPassword'
                                                        fullWidth
                                                        type={"password"}
                                                        value={values.newPassword}
                                                        onChange={handleChange}
                                                        error={touched.newPassword && Boolean(errors.newPassword)}
                                                        helperText={touched.newPassword && errors.newPassword}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={12}>
                                            <div className={'form-input'}>
                                                <div className={'label-input'}>Nhập lại mật khẩu mới<span className={'error-message'}>*</span></div>
                                                <div className={'row-input-field'}>
                                                    <TextField
                                                        size={"small"}
                                                        id='rePassword'
                                                        name='rePassword'
                                                        type={"password"}
                                                        fullWidth
                                                        value={values.rePassword}
                                                        onChange={handleChange}
                                                        error={touched.rePassword && Boolean(errors.rePassword)}
                                                        helperText={touched.rePassword && errors.rePassword}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>

                                    </Grid>

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