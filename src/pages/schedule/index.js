import {
    Autocomplete,
    Button,
    CircularProgress,
    createTheme,
    Divider,
    Menu,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import SettingsIcon from '@mui/icons-material/Settings';
import SettingColumnTable from "../../components/SettingColumnTable";
import apiTableConfig from "../../api/tableConfig";
import {convertToAutoComplete, getDefaultConfigTable} from "../../constants/common";
import apiRepository from "../../api/repository";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {ThemeProvider, useTheme} from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ModalDetail from "./ModalDetail";
import moment from "moment/moment";
import apiCategory from "../../api/category";
import {currencyFormatter} from "../../constants/utils";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FileDownload from "js-file-download";
import Axios from "axios";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import API_MAP from "../../constants/api";
import apiSchedule from "../../api/schedule";

export default function SchedulePage(props) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const {pathname} = useLocation();
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [idDetail, setIdDetail] = useState(null)
    const [listResult, setListResult] = useState([]);

    const [listScheduleStatus, setListScheduleStatus] = useState([]);
    const [listReferralSource, setListReferralSource] = useState([]);
    const [listDocumentType, setListDocumentType] = useState([]);
    const [totalExpense,setTotalExpense] = useState({
        feesNotary:0,
        feesTransportation:0,
        feesCopy:0,
        feesCollection:0,
    })

    const currentUser = useSelector(state => state.currentUser)
    const [isRefresh, setIsRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(() => {
        // Lấy thông tin từ sessionStorage hoặc sử dụng defaultUser
        const storedUser = sessionStorage.getItem('currentPage');
        return storedUser ? JSON.parse(storedUser) : 0;
    })
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [columns, setColumns] = useState(getDefaultConfigTable("schedule"))
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [isRefreshConfigTable, setIsRefreshConfigTable] = useState(false)
    const [anchorElSettingTable, setAnchorElSettingTable] = useState(null);
    const openSettingTable = Boolean(anchorElSettingTable);
    const [limitOfPage, setLimitOfPage] = useState(() => {
        // Lấy thông tin từ sessionStorage hoặc sử dụng defaultUser
        const storedUser = sessionStorage.getItem('limitOfPage');
        return storedUser ? JSON.parse(storedUser) : 50;
    })
    const [totalResults, setTotalResults] = useState(0)
    const [openModalRemove, setOpenModalRemove] = useState(false)
    const [idRemove, setIdRemove] = useState(-1)
    const [loadingExport, setLoadingExport] = useState(false)
    const [isInitialRenderTime, setIsInitialRenderTime] = useState(true);
    const [total, setTotal] = useState(0)
    const [amountRemain, setAmountRemain] = useState(0)
    const [amountPaid, setAmountPaid] = useState(0)
    const [totalAmount, setTotalAmount] = useState({
        total: 0,
        done: 0,
        remain: 0,
    })
    const defaultSearch = {
        name: "",
        certificateNumber: "",
        secretary: "",
        customerName: "",
        createBy: "",
        documentTypeName: "",
        documentTypeId: "",
        scheduleStatusId: "",
        scheduleStatusName: ""   ,
        referralSourceName: "",
        referralSourceId: ""
    }
    const [objectSearch, setObjectSearch] = useState(() => {
        // Lấy thông tin từ sessionStorage hoặc sử dụng defaultUser
        const storedUser = sessionStorage.getItem('objectSearch');
        return storedUser ? JSON.parse(storedUser) : defaultSearch;
    })
    useEffect(()=>{
        sessionStorage.setItem('objectSearch', JSON.stringify(objectSearch));
    },[objectSearch])

    const [listCar, setListCar] = useState([])

    const [timeSearch, setTimeSearch] = useState(()=>{
        const storedUser = sessionStorage.getItem('timeSearch');
        return storedUser ? JSON.parse(storedUser) :  {
            start: new dayjs().startOf('month'),
            end: new dayjs().endOf('month'),
        };
    }

    )
    const [isCurrentMonth, setIsCurrentMonth] = useState(false)
    const [isCurrentYear, setIsCurrentYear] = useState(true)
    useEffect(() => {
        getConfigTableApi({tableName: "schedule"}).then(r => {
            if (r.data.length == 0) {
                setColumns(getDefaultConfigTable("schedule"))
            } else {
                setColumns(JSON.parse(r.data[0].columns))
            }
        })
    }, [isRefreshConfigTable])

    useEffect(() => {
        if (sortField != null && sortDirection != null) {
            submitSearch()
        }
    }, [sortField, sortDirection])
    useEffect(() => {
        if (!isInitialRenderTime) {
            submitSearch()

        } else {
            setIsInitialRenderTime(false);
        }
        sessionStorage.setItem('timeSearch', JSON.stringify(timeSearch))
    }, [timeSearch])
    useEffect(() => {
        submitSearch()
    }, [objectSearch.scheduleStatusId,objectSearch.documentTypeId,objectSearch.referralSourceId, isRefresh])


    const exportExcel = () => {
        setLoadingExport(true)
        Axios.post(API_MAP.SCHEDULE_EXPORT, {
            id: checkColumnVisible("id") ? objectSearch.id != "" ? objectSearch.id : null : null,
            certificateNumber: checkColumnVisible("certificateNumber") ? objectSearch.certificateNumber != "" ? objectSearch.certificateNumber : null : null,
            name: checkColumnVisible("name") ? objectSearch.name != "" ? objectSearch.name : null : null,
            notary: checkColumnVisible("notary") ? objectSearch.notary != "" ? objectSearch.notary : null : null,
            secretary: checkColumnVisible("secretary") ? objectSearch.secretary != "" ? objectSearch.secretary : null : null,
            createBy: checkColumnVisible("createBy") ? objectSearch.createBy != "" ? objectSearch.createBy : null : null,
            customerName: checkColumnVisible("customerName") ? objectSearch.customerName != "" ? objectSearch.customerName : null : null,
            scheduleStatusId: checkColumnVisible("scheduleStatus") ? objectSearch.scheduleStatusId != "" ? objectSearch.scheduleStatusId : null : null,
            documentTypeId: checkColumnVisible("documentType") ? objectSearch.documentTypeId != "" ? objectSearch.documentTypeId : null : null,
            referralSource: checkColumnVisible("referralSource") ? objectSearch.referralSourceId != "" ? objectSearch.referralSourceId : null : null,
            startDate: timeSearch.start != null ? timeSearch.start : null,
            endDate: timeSearch.end != null ? timeSearch.end : null,
            paging: false,
        }, {
            headers: {'Authorization': `Bearer ${currentUser.accessToken}`},
            responseType: 'blob'
        }).then(response => {
            // setLoadingExport(false)
            let nameFile = response.headers['content-disposition'].split(`"`)[1]
            FileDownload(response.data, nameFile);
            setLoadingExport(false)
        }).catch(e => {
            setLoadingExport(false)
        })
    }
    useEffect(() => {
        if (!isInitialRender) {
            submitSearch();
        } else {
            setIsInitialRender(false);
        }
        sessionStorage.setItem('currentPage', JSON.stringify(currentPage))
        sessionStorage.setItem('limitOfPage', JSON.stringify(limitOfPage))
    }, [currentPage, limitOfPage])

    const submitSearch = () => {
        setLoading(true)
        searchApi({
            id: checkColumnVisible("id") ? objectSearch.id != "" ? objectSearch.id : null : null,
            certificateNumber: checkColumnVisible("certificateNumber") ? objectSearch.certificateNumber != "" ? objectSearch.certificateNumber : null : null,
            name: checkColumnVisible("name") ? objectSearch.name != "" ? objectSearch.name : null : null,
            notary: checkColumnVisible("notary") ? objectSearch.notary != "" ? objectSearch.notary : null : null,
            secretary: checkColumnVisible("secretary") ? objectSearch.secretary != "" ? objectSearch.secretary : null : null,
            createBy: checkColumnVisible("createBy") ? objectSearch.createBy != "" ? objectSearch.createBy : null : null,
            customerName: checkColumnVisible("customerName") ? objectSearch.customerName != "" ? objectSearch.customerName : null : null,
            scheduleStatusId: checkColumnVisible("scheduleStatus") ? objectSearch.scheduleStatusId != "" ? objectSearch.scheduleStatusId : null : null,
            documentTypeId: checkColumnVisible("documentType") ? objectSearch.documentTypeId != "" ? objectSearch.documentTypeId : null : null,
            referralSource: checkColumnVisible("referralSource") ? objectSearch.referralSourceId != "" ? objectSearch.referralSourceId : null : null,
            startDate: timeSearch.start != null ? timeSearch.start : null,
            endDate: timeSearch.end != null ? timeSearch.end : null,
            pageSize: limitOfPage,
            pageIndex: currentPage + 1,
            paging: true,
            sortBy: sortField,
            sortDirection: sortDirection
        }).then(r => {

            if (r.data.responses) {
                let result = r.data.responses;
                for (let i = 0; i < result.length; i++) {
                    console.log("result",result)
                    // result[i].createdBy = result[i].createdBy?.name || ""
                    result[i].documentType = result[i].documentType?.name || ""
                    result[i].notary = result[i].notary?.fullName || ""
                    result[i].createBy = result[i].createBy?.fullName || ""
                    result[i].secretary = result[i].secretary?.fullName || ""
                    result[i].scheduleStatus = result[i].scheduleStatus?.name || ""
                    result[i].referralSource = result[i].referralSource?.name || ""
                    result[i].certificateNumber = result[i].certificateNumber?.id || ""
                    result[i].isPaid = result[i].isPaid?'Đã nộp' : "Chưa nộp"
                    result[i].date = result[i].date ? moment(result[i].date).format('HH:mm DD-MM-YYYY') : "";


                }
                setListResult(result);
                setTotalResults(r.data.page.total_elements)

            } else {
                setTotalResults(0)
                setListResult([]);
            }
            setLoading(false)
        }).catch(e => {
            toast.error("Có lỗi xảy ra")
            setLoading(false)
        })


        // TỔNG
        searchApi({
            id: checkColumnVisible("id") ? objectSearch.id != "" ? objectSearch.id : null : null,
            certificateNumber: checkColumnVisible("certificateNumber") ? objectSearch.certificateNumber != "" ? objectSearch.certificateNumber : null : null,
            name: checkColumnVisible("name") ? objectSearch.name != "" ? objectSearch.name : null : null,
            referralSource: checkColumnVisible("referralSource") ? objectSearch.referralSource != "" ? objectSearch.referralSource : null : null,
            notary: checkColumnVisible("notary") ? objectSearch.notary != "" ? objectSearch.notary : null : null,
            secretary: checkColumnVisible("secretary") ? objectSearch.secretary != "" ? objectSearch.secretary : null : null,
            createBy: checkColumnVisible("createBy") ? objectSearch.createBy != "" ? objectSearch.createBy : null : null,
            customerName: checkColumnVisible("customerName") ? objectSearch.customerName != "" ? objectSearch.customerName : null : null,
            scheduleStatusId: checkColumnVisible("scheduleStatus") ? objectSearch.scheduleStatusId != "" ? objectSearch.scheduleStatusId : null : null,
            startDate: timeSearch.start != null ? timeSearch.start : null,
            endDate: timeSearch.end != null ? timeSearch.end : null,
            paging: false,
            sortBy: sortField,
            sortDirection: sortDirection
        }).then(r => {

            if (r.data.responses) {
                let result = r.data.responses;

                let feesNotary=0;
                let feesTransportation=0;
                let feesCopy=0;
                let feesCollection=0;
                for (let i = 0; i < result.length; i++) {
                    let item = result[i]
                    if(item.scheduleStatus!=null){
                        if(item.scheduleStatus.code=="done"){
                            feesNotary = feesNotary + item.feesNotary
                            feesTransportation = feesTransportation + item.feesTransportation
                            feesCopy = feesCopy + item.feesCopy
                            feesCollection = feesCollection + item.feesCollection
                        }
                    }
                }
                setTotalExpense({
                    feesCopy: feesCopy,
                    feesTransportation: feesTransportation,
                    feesNotary: feesNotary,
                    feesCollection: feesCollection
                })

            } else {
                setTotalExpense({
                    feesCopy: 0,
                    feesTransportation: 0,
                    feesNotary: 0,
                    feesCollection: 0
                })
            }
            setLoading(false)
        }).catch(e => {
            toast.error("Có lỗi xảy ra")
            setLoading(false)
        })

    }

    const handleSort = (field) => {
        // Xử lý sự kiện nhấp vào tiêu đề cột
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getConfigTableApi = (body) => {
        return apiTableConfig.get(body)
    }

    const searchApi = (body) => {
        return apiSchedule.search(body);
    }


    useEffect(() => {

        getCategoryApi({paging: false, type: "ScheduleStatus"}).then((r) => {
            setListScheduleStatus(convertToAutoComplete(r.data.responses, 'name'))
        })
        getCategoryApi({paging: false, type: "DocumentType"}).then((r) => {
            setListDocumentType(convertToAutoComplete(r.data.responses, 'name'))
        })
        getCategoryApi({paging: false, type: "ReferralSource"}).then((r) => {
            setListReferralSource(convertToAutoComplete(r.data.responses, 'name'))
        })

    }, [])
    const checkColumnVisible = (code) => {
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].code == code) {
                return columns[i].visible
            }
        }
        return false;
    }
    const renderFilterSearch = (code) => {
        if (code == "name") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.name}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, name: e.target.value})
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch()
                                }
                            }}
                            onBlur={(e) => {
                                submitSearch()
                            }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == "createBy") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.createBy}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, createBy: e.target.value})
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch()
                                }
                            }}
                            onBlur={(e) => {
                                submitSearch()
                            }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == "secretary") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.secretary}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, secretary: e.target.value})
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch()
                                }
                            }}
                            onBlur={(e) => {
                                submitSearch()
                            }}
                        />
                    </div>

                </TableCell>

            )
        }

        else if (code == "customerName") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.customerName}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, customerName: e.target.value})
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch()
                                }
                            }}
                            onBlur={(e) => {
                                submitSearch()
                            }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == "notary") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.notary}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, notary: e.target.value})
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch()
                                }
                            }}
                            onBlur={(e) => {
                                submitSearch()
                            }}
                        />
                    </div>

                </TableCell>

            )
        }
    else if (code == "id") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '95px', maxWidth: '95px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.id}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, id: e.target.value})
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch()
                                }
                            }}
                            onBlur={(e) => {
                                submitSearch()
                            }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == "certificateNumber") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '95px', maxWidth: '95px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.certificateNumber}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, certificateNumber: e.target.value})
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    submitSearch()
                                }
                            }}
                            onBlur={(e) => {
                                submitSearch()
                            }}
                        />
                    </div>

                </TableCell>

            )
        }
        else if (code == "scheduleStatus") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <Autocomplete
                        // disablePortal
                        id="combo-box-demo"
                        options={listScheduleStatus}
                        value={{
                            id: objectSearch.scheduleStatusId,
                            label: objectSearch.scheduleStatusName
                        }
                        }

                        renderInput={(params) => < TextField  {...params}
                                                              id='scheduleStatusId'
                                                              name='scheduleStatusId'
                                                              placeholder=""
                        />}
                        size={"small"}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                setObjectSearch({...objectSearch, scheduleStatusId: newValue.id, scheduleStatusName: newValue.label})

                            } else {
                                setObjectSearch({...objectSearch, scheduleStatusId: '', scheduleStatusName: ''})
                            }
                        }}
                    />

                </TableCell>

            )
        }
        else if (code == "referralSource") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <Autocomplete
                        // disablePortal
                        id="combo-box-demo"
                        options={listReferralSource}
                        value={{
                            id: objectSearch.referralSourceId,
                            label: objectSearch.referralSourceName
                        }
                        }

                        renderInput={(params) => < TextField  {...params}
                                                              id='referralSourceId'
                                                              name='referralSourceId'
                                                              placeholder=""
                        />}
                        size={"small"}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                setObjectSearch({...objectSearch, referralSourceId: newValue.id, referralSourceName: newValue.label})

                            } else {
                                setObjectSearch({...objectSearch, referralSourceId: '', referralSourceName: ''})
                            }
                        }}
                    />

                </TableCell>

            )
        }
        else if (code == "documentType") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <Autocomplete
                        // disablePortal
                        id="combo-box-demo"
                        options={listDocumentType}
                        value={{
                            id: objectSearch.documentTypeId,
                            label: objectSearch.documentTypeName
                        }
                        }

                        renderInput={(params) => < TextField  {...params}
                                                              id='documentTypeId'
                                                              name='documentTypeId'
                                                              placeholder=""
                        />}
                        size={"small"}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                setObjectSearch({...objectSearch, documentTypeId: newValue.id, documentTypeName: newValue.label})

                            } else {
                                setObjectSearch({...objectSearch, documentTypeId: '', documentTypeName: ''})
                            }
                        }}
                    />

                </TableCell>

            )
        }
     else if (code == "stt") return (
            <TableCell className={"filter-table"} style={{minWidth: '50px', top: 41}}>
            </TableCell>
        )
        else return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                </TableCell>
            )
    }


    const handleRefresh = () => {
        setIsRefresh(!isRefresh)
    }
    const getRepository = () => {
        return apiRepository.getRepositoryByUserPublic()
    }
    const handleCloseModalRemove = () => {
        setOpenModalRemove(false)
    }
    const handleCloseModalDetail = () => {
        setOpenModalDetail(false)
    }
    const handleCloseNotification = () => {
        setAnchorElSettingTable(null);
    };
    const handleClickNotification = (event) => {
        setAnchorElSettingTable(event.currentTarget);
    };


    const [locale, setLocale] = React.useState('viVN');

    const theme = useTheme();

    const themeWithLocale = React.useMemo(
        () => createTheme(theme, locales[locale]),
        [locale, theme],
    );
    const submitRemove = () => {
        if (idRemove != -1)
            removeApi({
                id: idRemove
            }).then(r => {
                handleCloseModalRemove();
                setIsRefresh(!isRefresh)
                toast.success("Xóa thành công")
            }).catch(e => {
                handleCloseModalRemove()
                toast.error("Vui lòng xóa các phụ thuộc trước")
            })
    }
    const removeApi = (body) => {
        return apiSchedule.delete(body)
    }
    const getCategoryApi = (body) => {
        return apiCategory.getCategory(body);
    }

    return (
        <div className={'main-content'}>
            <ModalDetail
                id={idDetail}
                setId={setIdDetail}
                openModal={openModalDetail}
                handleCloseModal={handleCloseModalDetail}></ModalDetail>
            <ModalConfirmDel submitDelete={submitRemove} openModalDel={openModalRemove}
                             handleCloseModalDel={handleCloseModalRemove}></ModalConfirmDel>
            <div className={'organization-content'} style={{}}>
                <div style={{width: '100%'}}>

                    <div className={'children-organization'}>
                        <div className={'table-content'} style={{marginTop: '10px'}}>
                            <div className={'table-search-btn'}>
                                <div className={'flex'}>
                                    {/*<div className={'label-input'}>Khoảng thời gian</div>*/}
                                    <Button onClick={() => {
                                        setIsCurrentYear(true)
                                        setIsCurrentMonth(false)
                                        setTimeSearch({
                                            start: (new dayjs).startOf('year'),
                                            end: (new dayjs).endOf('year'),
                                        })
                                    }} variant="outlined">Năm nay</Button>
                                    <Button onClick={() => {
                                        setIsCurrentYear(false)
                                        setIsCurrentMonth(true)
                                        setTimeSearch({
                                            start: (new dayjs).startOf('month'),
                                            end: (new dayjs).endOf('month'),
                                        })
                                    }} style={{marginLeft: '5px'}} variant="outlined">Tháng này</Button>

                                    <div style={{margin: '0 15px'}}>
                                        <Button style={{
                                            maxWidth: '36px',
                                            maxHeight: '36px',
                                            minWidth: '36px',
                                            minHeight: '36px'
                                        }}
                                                onClick={() => {
                                                    if (isCurrentYear) {
                                                        setTimeSearch({
                                                            start: dayjs(timeSearch.start).subtract(1, 'year'),
                                                            end: dayjs(timeSearch.end).subtract(1, 'year')
                                                        })
                                                    } else if (isCurrentMonth) {
                                                        setTimeSearch({
                                                            start: dayjs(timeSearch.start).subtract(1, 'month'),
                                                            end: dayjs(timeSearch.end).subtract(1, 'month')
                                                        })
                                                    }

                                                }}

                                                variant="outlined"><ArrowBackIcon
                                            style={{fontSize: '20px'}}></ArrowBackIcon>
                                        </Button>
                                        <Button style={{
                                            maxWidth: '36px',
                                            maxHeight: '36px',
                                            minWidth: '36px',
                                            minHeight: '36px'
                                        }} onClick={() => {
                                            setTimeSearch({
                                                start: dayjs(timeSearch.start).add(1, 'month'),
                                                end: dayjs(timeSearch.end).add(1, 'month')
                                            })
                                            if (isCurrentYear) {
                                                setTimeSearch({
                                                    start: dayjs(timeSearch.start).add(1, 'year'),
                                                    end: dayjs(timeSearch.end).add(1, 'year')
                                                })
                                            } else if (isCurrentMonth) {
                                                setTimeSearch({
                                                    start: dayjs(timeSearch.start).add(1, 'month'),
                                                    end: dayjs(timeSearch.end).add(1, 'month')
                                                })
                                            }
                                        }}
                                                variant="outlined"><ArrowForwardIcon
                                            style={{fontSize: '20px'}}></ArrowForwardIcon> </Button>

                                    </div>
                                    <div className={''} style={{display: "flex", alignItems: "center", width: '350px'}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                style={{height: '30px'}}
                                                inputFormat="DD-MM-YYYY"
                                                value={timeSearch.start}
                                                onChange={(values) => {
                                                    if (values != null) {
                                                        setTimeSearch({
                                                            ...timeSearch,
                                                            start: values.startOf('day')
                                                        })
                                                    } else {
                                                        setTimeSearch({...timeSearch, start: null})
                                                    }
                                                }}

                                                renderInput={(params) => <TextField
                                                    size={"small"}  {...params} />}
                                            />
                                        </LocalizationProvider>
                                        <div style={{margin: '0 5px'}}>đến</div>
                                        <LocalizationProvider style={{width: '50px !important', height: '30px'}}
                                                              dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                style={{width: '50px !important', height: '30px'}}
                                                inputFormat="DD-MM-YYYY"
                                                value={timeSearch.end}
                                                onChange={(values) => {
                                                    if (values != null) {
                                                        setTimeSearch({...timeSearch, end: values.endOf('day')})
                                                    } else {
                                                        setTimeSearch({...timeSearch, end: null})
                                                    }
                                                }}
                                                // onChange={value => props.setFieldValue("founding_date", value)}
                                                renderInput={(params) => <TextField
                                                    size={"small"}  {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>

                                    <div>

                                    </div>
                                </div>

                            </div>
                            <Divider></Divider>
                            <div className={'info-sum-table'}>
                                <div>
                                    <div className={'sum-table'}>
                                        <div className={'flex'}>
                                            <div className={'sum-table-label'}>
                                               Phí công chứng:&ensp;
                                            </div>
                                            <div className={'sum-table-amount'}>
                                                {currencyFormatter(totalExpense.feesNotary)}&ensp;VNĐ
                                            </div>
                                        </div>
                                        <div className={'flex'}>
                                            <div className={'sum-table-label'}>
                                                Phí sao y:&ensp;
                                            </div>
                                            <div className={'sum-table-amount'}>
                                                {currencyFormatter(totalExpense.feesCopy)}&ensp;VNĐ
                                            </div>
                                        </div>
                                        <div className={'flex'}>
                                            <div className={'sum-table-label'}>
                                                Phí di chuyển:&ensp;
                                            </div>
                                            <div className={'sum-table-amount'}>
                                                {currencyFormatter(totalExpense.feesTransportation)}&ensp;VNĐ
                                            </div>
                                        </div>    <div className={'flex'}>
                                            <div className={'sum-table-label'}>
                                                Phí thu hộ:&ensp;
                                            </div>
                                            <div className={'sum-table-amount'}>
                                                {currencyFormatter(totalExpense.feesCollection)}&ensp;VNĐ
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div style={{display:'flex',alignItems:'center'}}>
                                    {
                                        currentUser.roles.includes("create_schedule") ?
                                            <div>
                                                <Button onClick={()=>{
                                                    if(!loadingExport){
                                                        exportExcel()
                                                    }}
                                                } style={{marginLeft: '10px', marginRight: '10px'}}
                                                        variant="outlined"
                                                        startIcon={<VerticalAlignBottomIcon/>}>{loadingExport?<CircularProgress size={20}></CircularProgress>:"Xuất Excel"}</Button>
                                            </div>
                                            : ""
                                    }
                                    {           currentUser.roles.includes("create_schedule") ?
                                                        <Button style={{marginRight: "5px"}} onClick={() => {
                                                            navigate(`${pathname}/create`)
                                                        }} variant={'outlined'}>Thêm mới</Button> : ""
                                                }
                                    <Tooltip title={"Cài đặt hiển thị"} arrow disableInteractive>
                                        <SettingsIcon onClick={handleClickNotification}/>

                                    </Tooltip>
                                    <Menu
                                        id="icon-notification"
                                        anchorEl={anchorElSettingTable}
                                        open={openSettingTable}
                                        onClose={handleCloseNotification}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}>
                                        <SettingColumnTable
                                            tableName={'schedule'}
                                            columns={columns}
                                            isRefreshConfigTable={isRefreshConfigTable}
                                            setIsRefreshConfigTable={setIsRefreshConfigTable}>
                                        </SettingColumnTable>

                                    </Menu>
                                </div>

                            </div>
                            {/*<div className={'table-content-title'}*/}
                            {/*     style={{height: '40px', marginTop: '10px', marginBottom: '0px'}}>*/}
                            {/*    Danh sách lịch hẹn*/}
                            {/*    <div style={{*/}
                            {/*        marginRight: '15px',*/}
                            {/*        paddingBottom: '5px',*/}
                            {/*        display: "flex",*/}
                            {/*        justifyContent: 'center',*/}
                            {/*        alignItems: 'center'*/}
                            {/*    }}>*/}
                            {/*        <div style={{display: 'flex', alignItems: 'center'}}>*/}
                            {/*            {*/}
                            {/*                // currentUser.roles.includes("export_project") ?*/}
                            {/*                //     <div>*/}
                            {/*                //         <Button onClick={()=>{if(!loadingExport)exportExcel()}} style={{marginLeft: '10px', marginRight: '10px'}}*/}
                            {/*                //                 variant="outlined"*/}
                            {/*                //                 startIcon={<VerticalAlignBottomIcon/>}>{loadingExport?<CircularProgress size={20}></CircularProgress>:"Xuất Excel"}</Button>*/}
                            {/*                //     </div>*/}
                            {/*                //     : ""*/}
                            {/*            }*/}
                            {/*            {*/}
                            {/*                currentUser.roles.includes("create_schedule") ?*/}
                            {/*                    <Button style={{marginRight: "5px"}} onClick={() => {*/}
                            {/*                        navigate(`${pathname}/create`)*/}
                            {/*                    }} variant={'outlined'}>Thêm mới</Button> : ""*/}
                            {/*            }*/}

                            {/*            <Tooltip title={"Cài đặt hiển thị"} arrow disableInteractive>*/}
                            {/*                <SettingsIcon onClick={handleClickNotification}/>*/}

                            {/*            </Tooltip>*/}
                            {/*            <Menu*/}
                            {/*                id="icon-notification"*/}
                            {/*                anchorEl={anchorElSettingTable}*/}
                            {/*                open={openSettingTable}*/}
                            {/*                onClose={handleCloseNotification}*/}
                            {/*                MenuListProps={{*/}
                            {/*                    'aria-labelledby': 'basic-button',*/}
                            {/*                }}>*/}
                            {/*                <SettingColumnTable*/}
                            {/*                    tableName={'manageProject'}*/}
                            {/*                    columns={columns}*/}
                            {/*                    isRefreshConfigTable={isRefreshConfigTable}*/}
                            {/*                    setIsRefreshConfigTable={setIsRefreshConfigTable}>*/}
                            {/*                </SettingColumnTable>*/}

                            {/*            </Menu>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}

                            {/*</div>*/}


                            <div style={{position: 'relative'}}>
                                <div
                                    className={`message-table-empty ${listResult.length === 0 && !loading ? '' : 'hidden'}`}>Không
                                    có dữ liệu
                                </div>

                                <TableContainer className={'table-container'} style={{maxHeight: '710px'}}>
                                    <Table stickyHeader className={"table-custom"}>
                                        <TableHead>
                                            <TableRow>
                                                {/*<TableCell style={{width: '50px', textAlign: 'center'}}>STT</TableCell>*/}
                                                {columns.map((column, index) => {
                                                    if (column.visible) {
                                                        if (column.code == "stt") {
                                                            return (
                                                                <TableCell style={{cursor: 'pointer', maxWidth: '50px'}}
                                                                           key={index}
                                                                           onClick={() => handleSort(column.code)}
                                                                >
                                                                    <div className={'flex'} style={{
                                                                        cursor: 'pointer',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        {column.name}
                                                                        {/*{sortField === column.code && (*/}
                                                                        {/*    sortDirection === 'asc'*/}
                                                                        {/*        ? <ArrowUpwardIcon*/}
                                                                        {/*            style={{display: 'block', fontSize: '18px'}}/>*/}
                                                                        {/*        : <ArrowDownwardIcon*/}
                                                                        {/*            style={{display: 'block', fontSize: '18px'}}/>*/}
                                                                        {/*)}*/}
                                                                    </div>


                                                                </TableCell>)
                                                        } else {
                                                            return (<TableCell style={{cursor: 'pointer'}}
                                                                               key={index}
                                                                               onClick={() => handleSort(column.code)}
                                                            >
                                                                <div className={'flex'} style={{
                                                                    cursor: 'pointer',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    {column.name}
                                                                    {/*{sortField === column.code && (*/}
                                                                    {/*    sortDirection === 'asc'*/}
                                                                    {/*        ? <ArrowUpwardIcon*/}
                                                                    {/*            style={{display: 'block', fontSize: '18px'}}/>*/}
                                                                    {/*        : <ArrowDownwardIcon*/}
                                                                    {/*            style={{display: 'block', fontSize: '18px'}}/>*/}
                                                                    {/*)}*/}
                                                                </div>


                                                            </TableCell>)
                                                        }
                                                    }


                                                })}

                                                <TableCell className={"action-header"}>Thao tác</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                {/*<TableCell className={"filter-table"}*/}
                                                {/*           style={{textAlign: 'center', top: 41}}></TableCell>*/}
                                                {columns.map((column, index) => {
                                                        if (column.visible)
                                                            return (
                                                                renderFilterSearch(column.code)
                                                            )
                                                    }
                                                )}
                                                <TableCell style={{top: 41}}
                                                           className={"action-header filter-table"}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody style={{overflowY: "auto", position: 'relative'}}>
                                            <div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>
                                                <CircularProgress size={30}></CircularProgress>
                                            </div>


                                            {
                                                listResult.map((item, index) => (
                                                    <>
                                                        <TableRow >
                                                            {/*<TableCell style={{textAlign: 'center'}}>*/}
                                                            {/*    <div>{(currentPage) * limitOfPage + index + 1}</div>*/}
                                                            {/*</TableCell>*/}
                                                            {columns.map((column, columnIndex) => {
                                                                    if (column.visible) {
                                                                        if (column.code == "id") {
                                                                            return <TableCell style={{textAlign: 'center',}}
                                                                            >{item[column.code]}</TableCell>
                                                                        } else if (column.code == "stt") {
                                                                            return <TableCell style={{
                                                                                maxWidth: '50px',
                                                                                textAlign: 'center',
                                                                            }}
                                                                            >{item[column.code]}</TableCell>
                                                                        } else if (column.code == "projectStatus") {
                                                                            return <TableCell
                                                                                className={`${item.projectStatusId == 4 ? 'v' : (item.projectStatusId == 3 ||item.projectStatusId == 10)? 't' : item.projectStatusId == 2 ? 'x' : item.projectStatusId == 0 ? "d" : "tt"}`}
                                                                            >{item[column.code]}</TableCell>
                                                                        } else if (column.code == "feesNotary") {
                                                                            return <TableCell style={{textAlign: 'right',}}
                                                                            >{currencyFormatter(item[column.code])}</TableCell>
                                                                        } else if (column.code == "feesTransportation") {
                                                                            return <TableCell style={{textAlign: 'right',}}
                                                                            >{currencyFormatter(item[column.code])}</TableCell>
                                                                        } else if (column.code == "feesCopy") {
                                                                            return <TableCell style={{textAlign: 'right',}}
                                                                            >{currencyFormatter(item[column.code])}</TableCell>
                                                                        } else if (column.code == "feesCollection") {
                                                                            return <TableCell style={{textAlign: 'right',}}
                                                                            >{currencyFormatter(item[column.code])}</TableCell>
                                                                        } else if (column.code == "percent") {
                                                                            return <TableCell style={{textAlign: 'center',}}
                                                                            >{item[column.code]?.toString().replace('.', ',')}</TableCell>
                                                                        } else return <TableCell>{item[column.code]}</TableCell>
                                                                    } else return ""
                                                                }
                                                            )}

                                                            <TableCell className={"action"}>
                                                                <div className={'icon-action'} style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',

                                                                }}>
                                                                    <Tooltip arrow disableInteractive
                                                                             placement="right-start"
                                                                             title={'Xem chi tiết'}>
                                                                        <RemoveRedEyeIcon
                                                                            style={{
                                                                                color: "#1e1e44",
                                                                            }}
                                                                            onClick={() => {
                                                                                // setDetail(item)
                                                                                setIdDetail(item.id);
                                                                                setOpenModalDetail(true)
                                                                            }}>
                                                                        </RemoveRedEyeIcon>
                                                                    </Tooltip>




                                                                    {
                                                                        currentUser.roles.includes('update_schedule') ?

                                                                            <Tooltip arrow disableInteractive
                                                                                     placement="right-start"
                                                                                     title={"Cập nhật"}>
                                                                                <EditIcon style={{color: "#1e1e44"}}
                                                                                          onClick={() => {
                                                                                              navigate(`${pathname}/update?id=${item.id}`)
                                                                                          }}></EditIcon>
                                                                            </Tooltip> : ""
                                                                    }
                                                                    {
                                                                        currentUser.roles.includes('delete_schedule') ?
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
                                                                            </Tooltip> : ''
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
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: 'end',
                                    // marginTop: "5px"
                                }}>
                                    <ThemeProvider theme={themeWithLocale}>
                                        <TablePagination
                                            component="div"
                                            count={totalResults}
                                            page={currentPage}
                                            onPageChange={(e, value) => {
                                                setCurrentPage(value)
                                            }}
                                            rowsPerPageOptions={[10, 50, 100]}
                                            rowsPerPage={limitOfPage}
                                            onRowsPerPageChange={(event, value) => {
                                                setLimitOfPage(parseInt(event.target.value, 10));
                                                setCurrentPage(0);
                                            }}
                                        />
                                    </ThemeProvider>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


        </div>)
}