import DialogContent from "@mui/material/DialogContent";
import {Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Accordion, AccordionTab} from "primereact/accordion";
import {currencyFormatter} from "../../constants/utils";
import moment from "moment";
import apiSchedule from "../../api/schedule";

export default function ModalDetail(props) {
    const {
        id,
        setId,
        openModal,
        handleCloseModal,
    } = props
    const [info, setInfo] = useState({});
    const [listPayment,setListPayment] = useState([])
    const [listProgress,setListProgress] = useState([])

    useEffect(() => {
        if (!openModal) {
            setInfo({})
            setId(null)
        }

    }, [openModal])
    useEffect(() => {
        console.log("id", id)
    }, [id])
    useEffect(() => {
        if (id != null) {
            getDetailApi({paging: false, id: id}).then(r => {
                if (r.data) {
                    let data = r.data
                    setInfo(data)
                }

            }).catch(r => {
                // alert("err")
            })


        }
    }, [id])
    // const getPaymentApi = (body) => {
    //     return apiPayment.search(body);
    // }
    // const getProgressApi = (body) => {
    //     return apiProgress.search(body);
    // }
    //
    const getDetailApi = (body) => {
        return apiSchedule.getDetail(body);
    }

    return (
        <div style={{width: '600px'}}>
            <Dialog PaperProps={{
                style: {
                    height: '100%', // Set the height to 100% to make it full height
                },
            }} fullWidth open={openModal} onClose={handleCloseModal} maxWidth={'md'}>
                <DialogTitle>
                    <div style={{display:'flex',alignItems:'center'}}>
                        <div className={'vmp-tittle'}>
                            Chi tiết
                        </div>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                right: 1,
                                top: 1,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </div>

                </DialogTitle>
                <DialogContent dividers className={"model-project"}>
                    <div style={{padding: '0px'}}>
                        {/*<div className={'info-title'}> Dự án:&ensp;{info.name}</div>*/}
                        {/*<div className={'sum-table'} style={{padding:'0px',marginBottom:'10px'}}>*/}
                        {/*    <div className={'flex'}>*/}
                        {/*        <div className={'sum-table-label'}>*/}
                        {/*            Tổng doanh thu:&ensp;*/}
                        {/*        </div>*/}
                        {/*        <div className={'sum-table-amount'}>*/}
                        {/*            {currencyFormatter(info.amountOfEc)}&ensp;VNĐ*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className={'flex'}>*/}
                        {/*        <div className={'sum-table-label'}>*/}
                        {/*            Tổng số tiền đã thu:&ensp;*/}
                        {/*        </div>*/}
                        {/*        <div className={'sum-table-amount'}>*/}
                        {/*            {currencyFormatter(info.amountPaid)}&ensp;VNĐ*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className={'flex'}>*/}
                        {/*        <div className={'sum-table-label'}>*/}
                        {/*            Tổng số tiền chưa thu:&ensp;*/}
                        {/*        </div>*/}
                        {/*        <div className={'sum-table-amount'}>*/}
                        {/*            {currencyFormatter(info.amountRemain)}&ensp;VNĐ*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                        {/*</div>*/}
                            <Accordion multiple activeIndex={[0, 1, 2]}>
                                <AccordionTab header="Thông tin chi tiết">
                                    <Grid container spacing={1}>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>
                                                    Tên lịch hẹn:
                                                </div>
                                                <div className={'row-detail-info'}>
                                                    {info.name}
                                                </div>

                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Lịch hẹn:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.name}
                                                </div>

                                            </div>
                                        </Grid>

                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Tên khách hàng:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.customerName}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Người giới thiệu:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.referralSource}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Phí công chứng:</div>
                                                <div className={'row-detail-info'}>
                                                    {currencyFormatter(info.feesNotary)}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Phí di chuyển:</div>
                                                <div className={'row-detail-info'}>
                                                    {currencyFormatter(info.feesTransportation)}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Phí sao y:</div>
                                                <div className={'row-detail-info'}>
                                                    {currencyFormatter(info.feesCopy)}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Phí thu hộ:</div>
                                                <div className={'row-detail-info'}>
                                                    {currencyFormatter(info.feesCollection)}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Loại việc:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.documentType?info.documentType.name:""}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Trạng thái:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.scheduleStatus?info.scheduleStatus.name:""}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Công chứng viên:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.notary?info.notary.name:""}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Thời gian:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.date?moment(info.date).format('DD-MM-YYYY'):""}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Địa chỉ:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.address}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Thông tin liên hệ:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.contact}
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <div className={'row-detail'}>
                                                <div className={'row-detail-label'}>Ghi chú:</div>
                                                <div className={'row-detail-info'}>
                                                    {info.description}
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>


                                </AccordionTab>
                                {/*<AccordionTab header="Tiến độ dự án">*/}
                                {/*    <div style={{position: 'relative'}}>*/}
                                {/*        <div*/}
                                {/*            className={`message-table-empty ${listProgress.length === 0 ? '' : 'hidden'}`}>Không*/}
                                {/*            có dữ liệu*/}
                                {/*        </div>*/}

                                {/*        <TableContainer className={'table-container'} style={{maxHeight: '420px'}}>*/}
                                {/*            <Table stickyHeader className={"table-custom"}>*/}
                                {/*                <TableHead>*/}
                                {/*                    <TableRow>*/}
                                {/*                        <TableCell>Thời gian</TableCell>*/}
                                {/*                        <TableCell>Tình trạng hợp đồng</TableCell>*/}
                                {/*                        <TableCell>Tiến độ chung của dự án</TableCell>*/}
                                {/*                        <TableCell>Tồn đọng, vướng mắc</TableCell>*/}
                                {/*                    </TableRow>*/}
                                {/*                </TableHead>*/}
                                {/*                <TableBody style={{overflowY: "auto", position: 'relative'}}>*/}
                                {/*                    {*/}
                                {/*                        listProgress.map((item, index) => (*/}
                                {/*                            <>*/}
                                {/*                                <TableRow >*/}
                                {/*                                    <TableCell >{item.date}</TableCell>*/}
                                {/*                                    <TableCell >{item.projectStatus}</TableCell>*/}
                                {/*                                    <TableCell >{item.description}</TableCell>*/}
                                {/*                                    <TableCell >{item.backlog}</TableCell>*/}
                                {/*                                </TableRow>*/}
                                {/*                            </>*/}
                                {/*                        ))*/}
                                {/*                    }*/}
                                {/*                </TableBody>*/}
                                {/*            </Table>*/}
                                {/*        </TableContainer>*/}

                                {/*    </div>*/}
                                {/*</AccordionTab>*/}

                                {/*<AccordionTab header="Tiến độ thanh toán">*/}
                                {/*    <div style={{position: 'relative'}}>*/}
                                {/*        <div*/}
                                {/*            className={`message-table-empty ${listPayment.length === 0 ? '' : 'hidden'}`}>Không*/}
                                {/*            có dữ liệu*/}
                                {/*        </div>*/}

                                {/*        <TableContainer className={'table-container'} style={{maxHeight: '420px'}}>*/}
                                {/*            <Table stickyHeader className={"table-custom"}>*/}
                                {/*                <TableHead>*/}
                                {/*                    <TableRow>*/}
                                {/*                        <TableCell>Thời gian</TableCell>*/}
                                {/*                        <TableCell>Lần thanh toán</TableCell>*/}
                                {/*                        <TableCell>Số tiền(VNĐ)</TableCell>*/}
                                {/*                        <TableCell>Phần trăm(%)</TableCell>*/}
                                {/*                        <TableCell>Ghi chú</TableCell>*/}
                                {/*                    </TableRow>*/}
                                {/*                </TableHead>*/}
                                {/*                <TableBody style={{overflowY: "auto", position: 'relative'}}>*/}
                                {/*                    /!*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*!/*/}
                                {/*                    /!*    <CircularProgress size={30}></CircularProgress>*!/*/}
                                {/*                    /!*</div>*!/*/}


                                {/*                    {*/}
                                {/*                        listPayment.map((item, index) => (*/}
                                {/*                            <>*/}
                                {/*                                <TableRow>*/}
                                {/*                                    <TableCell >{item.date}</TableCell>*/}
                                {/*                                    <TableCell >{item.paymentTimes}</TableCell>*/}
                                {/*                                    <TableCell >{currencyFormatter(item.amount)}</TableCell>*/}
                                {/*                                    <TableCell >{item.percent}</TableCell>*/}
                                {/*                                    <TableCell >{item.description}</TableCell>*/}
                                {/*                                </TableRow>*/}
                                {/*                            </>*/}
                                {/*                        ))*/}
                                {/*                    }*/}
                                {/*                </TableBody>*/}
                                {/*            </Table>*/}
                                {/*        </TableContainer>*/}

                                {/*    </div>*/}

                                {/*</AccordionTab>*/}


                            </Accordion>

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}