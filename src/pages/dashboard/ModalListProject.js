import DialogContent from "@mui/material/DialogContent";
import {
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import apiDashboard from "../../api/dashboard";
import {toast} from "react-toastify";
import apiSchedule from "../../api/schedule";
import {currencyFormatter} from "../../constants/utils";

export default function ModalListProject(props) {
    const {
        timeSearch,
        type,
        setIdDetail,
        openModal,
        handleCloseModal,
        setOpenModalDetail
    } = props
    const [info, setInfo] = useState({});
    const [listProject,setListProject] = useState([])
    const [loading,setLoading] = useState(false)
    const [total, setTotal] = useState({
        feesNotary:0,
        feesTransportation:0,
        feesCopy:0,
        feesCollection:0
    })
    useEffect(() => {
        let feesNotary=0;
        let feesTransportation=0;
        let feesCopy=0;
        let feesCollection=0;
        for (let i = 0; i < listProject.length; i++) {
            let schedule = listProject[i];
            if(schedule.scheduleStatus!=null){
                if(schedule.scheduleStatus.code=="done"){
                    feesNotary = feesNotary + schedule.feesNotary
                    feesTransportation = feesTransportation + schedule.feesTransportation
                    feesCopy = feesCopy + schedule.feesCopy
                    feesCollection = feesCollection + schedule.feesCollection
                }
            }
        }


        setTotal({
            feesCopy: feesCopy,
            feesTransportation: feesTransportation,
            feesNotary: feesNotary,
            feesCollection: feesCollection
        })
    }, [listProject])
    useEffect(() => {
        if (!openModal) {
            setInfo({})
            setListProject([])
            // setId(null)
        }

    }, [openModal])
    useEffect(()=>{
        let bodySearch={
            startDate:timeSearch.startDate,
            endDate:timeSearch.endDate,
            paging: false,
        }
        if(type.type=="notary"){
            bodySearch.notaryId=type.id
            bodySearch.scheduleStatusCode='done'
        }
        else if(type.type=="referralSource"){
            bodySearch.referralSource=type.id
            bodySearch.scheduleStatusCode='done'
        }
        else if(type.type=="sum"){
            bodySearch.scheduleStatusCode='done'
        }
        setLoading(true)
        getSchedule(bodySearch).then(r => {
            console.log('r')
            setLoading(false)
            setListProject(r.data?.responses || [])
        }).catch(e => {
            setLoading(false)
            console.log(e)
            toast.error("Có lỗi xảy ra")
        })
    },[type])

    const getSchedule = (body) => {
        return apiSchedule.search(body);
    }


    return (
        <div style={{width: '600px'}}>
            <Dialog PaperProps={{
                style: {
                    height: '100%', // Set the height to 100% to make it full height
                },
            }} fullWidth open={openModal} onClose={handleCloseModal} maxWidth={'lg'}>
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
                        <div className={'info-title'}>
                            {type.type=="notary"?'Công chứng viên: ':type.type=="referralSource"?"Nguồn việc: ":""}
                            {type.name}</div>
                        <div className={'sum-table'} style={{padding:'0px',marginBottom:'10px'}}>
                            {
                                type.type=="notary"?  <div className={'flex'}>
                                    <div className={'sum-table-label'}>
                                        Tổng doanh thu:&ensp;
                                    </div>
                                    <div className={'sum-table-amount'}>
                                        {currencyFormatter(total.feesNotary+total.feesCopy)}&ensp;VNĐ
                                    </div>
                                </div>:''
                            }

                            <div className={'flex'}>
                                <div className={'sum-table-label'}>
                                    Phí công chứng:&ensp;
                                </div>
                                <div className={'sum-table-amount'}>
                                    {currencyFormatter(total.feesNotary)}&ensp;VNĐ
                                </div>
                            </div>
                            <div className={'flex'}>
                                <div className={'sum-table-label'}>
                                    Phí sao y:&ensp;
                                </div>
                                <div className={'sum-table-amount'}>
                                    {currencyFormatter(total.feesCopy)}&ensp;VNĐ
                                </div>
                            </div>
                            {
                                type.type!=="notary"?
                                    <>
                                        <div className={'flex'}>
                                            <div className={'sum-table-label'}>
                                                Phí di chuyển:&ensp;
                                            </div>
                                            <div className={'sum-table-amount'}>
                                                {currencyFormatter(total.feesTransportation)}&ensp;VNĐ
                                            </div>
                                        </div>
                                        <div className={'flex'}>
                                            <div className={'sum-table-label'}>
                                                Phí thu hộ:&ensp;
                                            </div>
                                            <div className={'sum-table-amount'}>
                                                {currencyFormatter(total.feesCollection)}&ensp;VNĐ
                                            </div>
                                        </div>
                                    </>:''
                            }

                        </div>
                        <div style={{position: 'relative', marginTop: '10px'}}>
                            <div
                                className={`message-table-empty ${listProject.length === 0 &&!loading? '' : 'hidden'}`}>Không
                                có dữ liệu
                            </div>

                            <TableContainer className={'table-container table-modal'}  >
                                <Table stickyHeader className={"table-custom"}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{
                                                width: '50px !important',
                                                textAlign: 'center'
                                            }}>STT</TableCell>
                                            <TableCell>Tên hồ sơ</TableCell>
                                            <TableCell>Số công chứng</TableCell>
                                            <TableCell>Công chứng viên</TableCell>
                                            <TableCell>Thư ký</TableCell>
                                            <TableCell>Phí công chứng</TableCell>
                                            <TableCell>Phí sao y</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{overflowY: "auto", position: 'relative'}}>
                                        <div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>
                                            <CircularProgress size={30}></CircularProgress>
                                        </div>


                                        {
                                            listProject.map((item, index) => (
                                                <>
                                                    <TableRow onClick={() => {
                                                        setIdDetail(item.id);
                                                        setOpenModalDetail(true)
                                                    }} className={'row-table-dashboard'}>
                                                        {/*<TableCell style={{textAlign: 'center'}}>*/}
                                                        {/*    <div>{(currentPage) * limitOfPage + index + 1}</div>*/}
                                                        {/*</TableCell>*/}
                                                        <TableCell style={{
                                                            textAlign: 'center',
                                                            width: '50px'
                                                        }}>{index + 1}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.certificateNumber?.id}</TableCell>
                                                        <TableCell>{item.notary?.fullName}</TableCell>
                                                        <TableCell>{item.secretary?.fullName}</TableCell>
                                                        <TableCell style={{textAlign:'right'}}>{currencyFormatter(item.feesNotary)}</TableCell>
                                                        <TableCell style={{textAlign:'right'}}>{currencyFormatter(item.feesCopy)}</TableCell>
                                                    </TableRow>
                                                </>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
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