import {
    Button, CircularProgress,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import apiProject from "../../../api/project";
import apiTimeline from "../../../api/timeline";
import ModalConfirmDel from "../../../components/ModalConfirmDelete";
import ModalEdit from "./ModalEdit";
import {getDefaultConfigTable} from "../../../constants/common";
import {currencyFormatter} from "../../../constants/utils";
import apiPayment from "../../../api/payment";

export default function ManagePaymentPage(props) {
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [idDetail, setIdDetail] = useState({})
    const [loading,setLoading] = useState(false)
    const [limitOfPage, setLimitOfPage] = useState(10)
    const [infoProject, setInfoProject] = useState({})
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate()
    const [isRefresh, setIsRefresh] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalRemove, setOpenModalRemove] = useState(false)
    const [idRemove, setIdRemove] = useState(-1)
    const [columns, setColumns] = useState(getDefaultConfigTable("payment"))
    const [listResult, setListResult] = useState([])
    const [totalResults, setTotalResults] = useState(0)
    const [openModelEdit,setOpenModalEdit] = useState(false)
    const [isUpdate,setIsUpdate] = useState(false)
    useEffect(() => {


    }, [])
    useEffect(() => {
        if (infoProject.id) {
            getTimelineApi({
                projectId: infoProject.id,
                paging: false
            }).then(r => {
                if (r.data) {
                    let result = r.data;

                    // const sortedList = result.sort((a, b) => moment(a.date, 'DD-MM-YYYY').valueOf() - moment(b.date, 'DD-MM-YYYY').valueOf());

                    for (let i = 0; i < result.length; i++) {
                        result[i].date = result[i].date?moment(result[i].date).format("DD-MM-YYYY"):""
                        result[i].paymentTimes = result[i].payment?result[i].payment.paymentTimes:""
                        result[i].amount = result[i].payment?result[i].payment.amount:""
                        result[i].percent = result[i].payment?result[i].payment.percent:""
                        result[i].description = result[i].payment?result[i].payment.description:""

                    }
                    console.log("list result",result)
                    setListResult(result)
                    // setListResultDashboard(sortedList);


                } else {
                    setListResult([])
                    // setListResultDashboard([]);

                }
            })
        }
    }, [infoProject, isRefresh])


    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    const handleCloseModalEdit = () => {
        setIdDetail(null)
        setOpenModalEdit(false)
        setIsRefresh(value=>!value)
    }

    const handleCloseModalRemove = () => {
        setOpenModalRemove(false)
    }

    const removeApi = (body) => {
        return apiPayment.delete(body)
    }
    const getTimelineApi = (body) => {
        return apiPayment.search(body);
    }

    const submitRemove = () => {
        if (idRemove != -1)
            removeApi({
                id: idRemove
            }).then(r => {
                handleCloseModalDel()
                setIsRefresh(!isRefresh)
                toast.success("Xóa thành công")
            }).catch(e => {
                console.log(e)
                handleCloseModalDel()
                toast.error("Vui lòng xóa các phụ thuộc trước")
            })
    }
    const handleRefresh = () => {
        setIsRefresh(!isRefresh)
    }

    const renderFilterSearch = (code) => {
        <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
        </TableCell>
    }
    const handleCloseDetail = () => {
        setIdDetail(null)
        setOpenModalDetail(false)
    }


    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get("projectId")) {
            let id = searchParams.get("projectId");
            setLoading(true)
            getDetailApi({
                paging: false,
                id: id,
            }).then(r => {
                // setListRepository()
                setLoading(false)

                setInfoProject(r.data.responses[0])


            }).catch(r => {
                navigate('/project')
            })
        } else {
            navigate('/project')
        }
    }, [searchParams])
    const getDetailApi = (body) => {
        return apiProject.search(body);
    }

    return (
        <div className={'main-content'}>
            <ModalConfirmDel submitDelete={submitRemove} openModalDel={openModalRemove}
                             handleCloseModalDel={handleCloseModalRemove}></ModalConfirmDel>
            {/*<ModalDetail*/}
            {/*    type={type}*/}
            {/*    id={idDetail}*/}
            {/*    openModal={openModalDetail}*/}
            {/*    handleCloseModal={handleCloseDetail}></ModalDetail>*/}
            <ModalEdit
                isUpdate={isUpdate}
                idDetail={idDetail}
                idProject={searchParams.get("projectId")}
                openModal={openModelEdit}
                handleCloseModal={handleCloseModalEdit}></ModalEdit>

            <div className={'organization-content'} style={{}}>
                <div style={{width: '100%'}}>

                    <div className={'children-organization'}>
                        <div className={'table-content'} style={{marginTop: '10px'}}>
                            <div className={'table-content-title'}
                                 style={{height: '40px', marginTop: '10px', marginBottom: '0px'}}>
                                Tiến độ thanh toán: {infoProject.name}

                                <div style={{
                                    marginRight: '15px',
                                    paddingBottom: '5px',
                                    display: "flex",
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {/*<div style={{marginLeft: '10px', marginRight: '10px'}}>*/}

                                    {/*    {*/}
                                    {/*        loadingExport ? <CircularProgress*/}
                                    {/*                size={25}></CircularProgress> :*/}
                                    {/*            <Tooltip title={"Xuất Excel"}>*/}
                                    {/*                <VerticalAlignBottomIcon onClick={exportSof}/>*/}

                                    {/*            </Tooltip>*/}
                                    {/*    }*/}
                                    {/*    /!*<CircularProgress*!/*/}
                                    {/*    /!*    size={20}></CircularProgress>*!/*/}

                                    {/*            size={20}></CircularProgress></div> :*/}
                                    {/*        <div  style={{marginLeft: '10px', marginRight: '10px'}}>*/}
                                    {/*            <VerticalAlignBottomIcon onClick={exportSof}/></div>*/}
                                    {/*}*/}
                                    {
                                        currentUser.roles.includes("create_payment") ?
                                            <Button style={{marginRight: "5px"}} onClick={() => {
                                                setIsUpdate(false)
                                                setOpenModalEdit(true)
                                            }} variant={'outlined'}>Thêm mới</Button> : ""

                                    }

                                    {/*<Tooltip title={"Cài đặt hiển thị"} arrow disableInteractive>*/}
                                    {/*    <SettingsIcon onClick={handleClickNotification}/>*/}

                                    {/*</Tooltip>*/}
                                    {/*<IconButton onClick={handleClickNotification}>*/}
                                    {/*    <SettingsIcon/>*/}
                                    {/*</IconButton>*/}
                                </div>

                            </div>
                            <Divider></Divider>
                            <div style={{position: 'relative'}}>
                                <div
                                    className={`message-table-empty ${listResult.length === 0 &&!loading? 'mt-30' : 'hidden'}`}>Không
                                    có dữ liệu
                                </div>
                                <TableContainer className={'table-container'} style={{maxHeight: '350px'}}>
                                    <Table stickyHeader className={"table-custom"}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{textAlign: 'center'}}>STT</TableCell>
                                                {columns.map((column, index) => (
                                                    column.visible &&
                                                    <TableCell style={{cursor: 'pointer'}}
                                                               key={index}

                                                    >
                                                        <div className={'flex'} style={{
                                                            cursor: 'pointer',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                            {column.name}

                                                        </div>


                                                    </TableCell>
                                                ))}
                                                <TableCell className={"action-header"}>Thao tác</TableCell>
                                            </TableRow>
                                            {/*<TableRow>*/}
                                            {/*    <TableCell className={"filter-table"}*/}
                                            {/*               style={{textAlign: 'center', top: 41}}></TableCell>*/}
                                            {/*    {columns.map((column, index) => {*/}
                                            {/*            if (column.visible)*/}
                                            {/*                return (*/}
                                            {/*                    renderFilterSearch(column.code)*/}
                                            {/*                )*/}
                                            {/*        }*/}
                                            {/*    )}*/}
                                            {/*    <TableCell style={{top: 41}}*/}
                                            {/*               className={"action-header filter-table"}></TableCell>*/}
                                            {/*</TableRow>*/}
                                        </TableHead>
                                        <TableBody style={{overflowY: "auto", position: 'relative'}}>
                                            <div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>
                                                <CircularProgress size={30}></CircularProgress>
                                            </div>


                                            {
                                                listResult.map((item, index) => (
                                                    <>
                                                        <TableRow>
                                                            <TableCell style={{textAlign: 'center'}}>
                                                                <div>{index + 1}</div>
                                                            </TableCell>
                                                            {columns.map((column, columnIndex) => {
                                                                    if (column.visible) {
                                                                        if (column.code == 'percent') {
                                                                            return <TableCell
                                                                                style={{textAlign: 'right'}}>{item[column.code]?.toString().replace('.',',')}</TableCell>
                                                                        }
                                                                        else if (column.code == 'amount') {
                                                                            return <TableCell
                                                                                style={{textAlign: 'right'}}>{currencyFormatter(item[column.code])}</TableCell>
                                                                        }
                                                                        else if (column.code == "id") {
                                                                            return <TableCell style={{textAlign: 'center'}}
                                                                            >{item[column.code]}</TableCell>
                                                                        } else return <TableCell>{item[column.code]}</TableCell>
                                                                    } else return ""
                                                                }
                                                            )}


                                                            <TableCell className={"action"}
                                                                       style={{textAlign: 'center'}}>
                                                                <div className={'icon-action'} style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    width: '100%'
                                                                }}>
                                                                    {
                                                                        currentUser.roles.includes('update_payment')?
                                                                            <Tooltip arrow disableInteractive
                                                                                     placement="right-start"
                                                                                     title={'Cập nhật'}>
                                                                                <EditIcon
                                                                                    fontSize={'small'}

                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                        color: "#1e1e44",
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        setIdDetail(item.id)
                                                                                        setIsUpdate(true)
                                                                                        setOpenModalEdit(true)
                                                                                    }}
                                                                                ></EditIcon>
                                                                            </Tooltip>:""
                                                                    }
                                                                    {
                                                                        currentUser.roles.includes('delete_payment')?
                                                                            <Tooltip arrow disableInteractive
                                                                                     placement="right-start"
                                                                                     title={"Xóa"}>
                                                                                <DeleteForeverIcon
                                                                                    fontSize={'small'}
                                                                                    color={"error"}
                                                                                    onClick={() => {
                                                                                        setIdRemove(item.id)
                                                                                        setOpenModalRemove(true)
                                                                                    }}
                                                                                ></DeleteForeverIcon>
                                                                            </Tooltip>:""
                                                                    }

                                                                </div>
                                                            </TableCell>


                                                        </TableRow>
                                                    </>
                                                ))
                                            }

                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </div>

                        </div>

                    </div>
                </div>
            </div>


        </div>)
}