import {
    Button,
    CircularProgress, createTheme, Divider, Pagination, Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField, Tooltip
} from "@mui/material";
import apiUser from "../../api/user";
import React, {useEffect, useState} from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import apiLoginHistory from "../../api/login-history";
import moment from "moment";
import LogoutIcon from '@mui/icons-material/Logout';
import {ThemeProvider, useTheme} from "@mui/material/styles";
import * as locales from "@mui/material/locale";
export default function LoginHistoryPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0)
    const [limitOfPage, setLimitOfPage] = useState(10)
    const [result, setResult] = useState([])
    const [searchUsername, setSearchUsername] = useState("")
    const [totalPage, setTotalPage] = useState(0)
    const [search, setSearch] = useState(true)
    const [totalResults, setTotalResults] = useState(0)
    const [isRefreshTable, setRefreshTable] = useState(true)
    useEffect(() => {
        submitSearch()
    }, [])
    const submitSearch = () => {
        getLoginHistoryApi({
            username: searchUsername,
            pageSize: limitOfPage,
            pageIndex: currentPage+1,
            paging: true
        }).then(r => {
            if(r.data.responses){
                setResult(r.data.responses);
                setTotalPage(r.data.page.total_pages)
                setTotalResults(r.data.page.total_elements)

            }
            else {
                setResult([]);
                setTotalPage(0)
                setTotalResults(0)

            }

        })
    }
    useEffect(() => {
        submitSearch()
    }, [ currentPage, isRefreshTable,limitOfPage])

    const getLoginHistoryApi = (body) => {
        return apiLoginHistory.getLoginHistory(body);
    }
    const logoutByAdminApi = (body) => {
        return apiLoginHistory.logoutByAdmin(body);
    }
    const [locale, setLocale] = React.useState('viVN');

    const theme = useTheme();

    const themeWithLocale = React.useMemo(
        () => createTheme(theme, locales[locale]),
        [locale, theme],
    );


    return (
        <div className={'main-content'}>
            <div className={'wrapper-table'}>
                <div className={'table-search'}>
                    <div className={'table-content-title'}>Thông tin tìm kiếm</div>
                    <div className={'table-search-btn'}>
                        <div style={{width: '20%',marginLeft:"20px"}}>
                            <div className={'label-input'}>Tên đăng nhập</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchUsername}
                                onChange={(e) =>{
                                    setSearchUsername(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{marginLeft:"20px",marginTop:'16px'}}>
                            <Button variant={"outlined"} onClick={submitSearch}>Tìm kiếm</Button>
                        </div>
                    </div>
                    <Divider ></Divider>
                </div>
                <div className={'table-content'}>
                    <div className={'table-content-title'}>
                        Lịch sử đăng nhập
                        {/*<div>*/}
                        {/*    <Button onClick={()=>{navigate("/user/create")}} variant="outlined" startIcon={<ControlPointIcon />}>*/}
                        {/*        Thêm mới*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>
                    <TableContainer className={'table-container'}>
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:'30px'}} align="center">STT</TableCell>
                                    <TableCell>Tên đăng nhập</TableCell>
                                    <TableCell>Thời gian đăng nhập</TableCell>
                                    {/*<TableCell>Địa chỉ ip</TableCell>*/}
                                    <TableCell>Thiết bị</TableCell>
                                    <TableCell className={"action-header"} style={{width:'150px'}}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY: "auto"}}>
                                {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                {/*    <CircularProgress size={30}></CircularProgress>*/}
                                {/*</div>*/}
                                <div
                                    className={`message-table-empty ${result.length === 0  ? 'mt-30' : 'hidden'}`}>Không
                                    có dữ liệu
                                </div>
                                {
                                    result.map((item,index)=>(
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                   <div>{index+1+((currentPage)*limitOfPage)}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{item.username}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{moment(item.time).format("HH:MM:SS DD/MM/YYYY")}</div>
                                                </TableCell>
                                                {/*<TableCell>*/}
                                                {/*    <div>{item.ip}</div>*/}
                                                {/*</TableCell>*/}
                                                <TableCell>
                                                    <div>{item.device}</div>
                                                </TableCell>
                                                <TableCell className={"action"}>
                                                    <div style={{display:'flex',justifyContent:'center'}}>
                                                        {/*<Tooltip title={"Cập nhật"}>*/}
                                                        {/*    <EditIcon onClick={()=>{navigate(`/user/update?id=${item.id}`)}}></EditIcon>*/}
                                                        {/*</Tooltip>*/}
                                                        <Tooltip title={"Ngắt kết nối"} arrow disableInteractive>
                                                            <LogoutIcon onClick={()=>{
                                                                logoutByAdminApi({
                                                                    refreshToken: item.refreshToken
                                                                }).then(r=>{
                                                                    // submitSearch()
                                                                    toast.success("Ngắt kết nối thành công")
                                                                })
                                                            }} color={"error"}>
                                                            </LogoutIcon>
                                                        </Tooltip>

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
                        marginTop:"5px"
                    }}>
                        <ThemeProvider theme={themeWithLocale}>
                            <TablePagination
                                component="div"
                                count={totalResults}
                                page={currentPage}
                                onPageChange={(e, value) => {
                                    setCurrentPage(value)
                                }}
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
        </div>)
}