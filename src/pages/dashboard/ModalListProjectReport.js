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
import apiProject from "../../api/project";
import {currencyFormatter} from "../../constants/utils";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";

export default function ModalListProjectReport(props) {
    const {
        setIdDetail,
        openModal,
        handleCloseModal,
        setOpenModalDetail
    } = props
    const [info, setInfo] = useState({});
    const [totalAmount,setTotalAmount] = useState({
        total:0,
        done:0,
        remain:0,
    })
    const [listProject,setListProject] = useState([])
    const [loading,setLoading] = useState(false)
    useEffect(() => {
        if (!openModal) {
            setInfo({})
            setListProject([])
            // setId(null)
        }else {
            setLoading(true)
            getProject({paging:false}).then(r => {
                console.log('r')
                setLoading(false)
                if(r.data){
                    setListProject(r.data)
                    let total=0;
                    let done = 0;
                    let remain = 0;
                    for (let i=0;i<r.data.length;i++){
                        total = total +r.data[i].amountOfEc;
                        done = done + r.data[i].amountPaid;
                        remain = remain + r.data[i].amountRemain;
                    }
                    setTotalAmount({total:total,done:done,remain:remain})
                }
                else {
                    setListProject([])
                }
            }).catch(e => {
                setLoading(false)
                console.log(e)
                toast.error("Có lỗi xảy ra")
            })
        }

    }, [openModal])


    const getProject = (body) => {
        return apiProject.getReport(body);
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
                        <div className={'info-sum-table'} style={{alignItems:'center'}}>
                            <div>
                                <div className={'sum-table'}>
                                    <div className={'flex'}>
                                        <div className={'sum-table-label'}>
                                            Dòng thu:&ensp;
                                        </div>
                                        <div className={'sum-table-amount'}>
                                            {currencyFormatter(totalAmount.total)}&ensp;VNĐ
                                        </div>
                                    </div>
                                    <div className={'flex'}>
                                        <div className={'sum-table-label'}>
                                            Đã thu:&ensp;
                                        </div>
                                        <div className={'sum-table-amount'}>
                                            {currencyFormatter(totalAmount.done)}&ensp;VNĐ
                                        </div>
                                    </div>
                                    <div className={'flex'}>
                                        <div className={'sum-table-label'}>
                                            Còn phải thu:&ensp;
                                        </div>
                                        <div className={'sum-table-amount'}>
                                            {currencyFormatter(totalAmount.remain)}&ensp;VNĐ
                                        </div>
                                    </div>

                                </div>
                            </div>


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
                                            <TableCell >Tên dự án</TableCell>
                                            <TableCell >Hãng</TableCell>
                                            <TableCell >SI</TableCell>
                                            <TableCell style={{minWidth: '150px'}}>Giá trị hợp đồng Bank</TableCell>
                                            <TableCell style={{width: '150px'}}>Giá trị hợp đồng EC</TableCell>
                                            <TableCell style={{width: '50px', textAlign: 'center'}}>Tỷ lệ</TableCell>
                                            <TableCell style={{minWidth: '150px'}}>Đã thu tiền</TableCell>
                                            <TableCell style={{minWidth: '150px'}}>Còn phải thu</TableCell>
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
                                                        <TableCell>{item.supplier?.code}</TableCell>
                                                        <TableCell>{item.partner?.code}</TableCell>
                                                        <TableCell style={{textAlign: 'right'}}>{currencyFormatter(item.amountOfBank)}</TableCell>
                                                        <TableCell style={{textAlign: 'right'}}>{currencyFormatter(item.amountOfEc)}</TableCell>
                                                        <TableCell style={{textAlign: 'center'}}>{currencyFormatter(item.percent)}</TableCell>
                                                        <TableCell style={{textAlign: 'right'}}>{currencyFormatter(item.amountPaid)}</TableCell>
                                                        <TableCell style={{textAlign: 'right'}}>{currencyFormatter(item.amountRemain)}</TableCell>
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