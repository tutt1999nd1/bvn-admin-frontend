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
import apiRole from "../../api/role";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {ThemeProvider, useTheme} from "@mui/material/styles";
import * as locales from "@mui/material/locale";
export default function RolePage() {
    const currentUser = useSelector(state => state.currentUser)
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0)
    const [totalResults, setTotalResults] = useState(0)
    const [limitOfPage, setLimitOfPage] = useState(10)
    const [result, setResult] = useState([])
    const [searchRoleName, setSearchRoleName] = useState("")
    const [searchRoleCode, setSearchRoleCode] = useState("")
    const [totalPage, setTotalPage] = useState(0)
    const [search, setSearch] = useState(true)
    const [isRefreshTable, setRefreshTable] = useState(true)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel,setIdDel] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    useEffect(() => {
        submitSearch()
    }, [])
    const submitSearch = () => {
        getRoleApi({
            name: searchRoleName,
            code: searchRoleCode,
            pageSize: limitOfPage,
            pageIndex: currentPage+1,
            paging: true
        }).then(r => {
            console.log(r.data);
            if(r.data.responses){
                setResult(r.data.responses);
                setTotalPage(r.data.page.total_pages)
                setTotalResults(r.data.page.total_elements)

            }
            else {
                setResult([]);
                setTotalPage(0);
                setTotalResults(0)

            }

        })
    }
    useEffect(() => {
        submitSearch()
    }, [ currentPage, isRefreshTable,limitOfPage])
    const getRoleApi = (body) => {
        return apiRole.getListRole(body);
    }

    const deleteRoleApi = (body) => {
        return apiRole.deleteRole(body)
    }
    const submitDel = () => {
        deleteRoleApi({
            id: idDel
        }).then(r=>{
            submitSearch()
            toast.success("Xóa thành công")
        })
    }
    const [locale, setLocale] = React.useState('viVN');

    const theme = useTheme();

    const themeWithLocale = React.useMemo(
        () => createTheme(theme, locales[locale]),
        [locale, theme],
    );

    return (
        <div className={'main-content'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete} handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
            <div className={'wrapper-table'}>
                <div className={'table-search'}>
                    <div className={'table-content-title'}>Thông tin tìm kiếm</div>
                    <div className={'table-search-btn'}>
                        <div style={{width: '20%'}}>
                            <div className={'label-input'}>Tên nhóm quyền</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchRoleName}
                                onChange={(e) =>{
                                    setSearchRoleName(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{width: '20%',marginLeft:"20px"}}>
                            <div className={'label-input'}>Mã nhóm quyền</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchRoleCode}
                                onChange={(e) =>{
                                    setSearchRoleCode(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{marginLeft:"20px",marginTop:'16px'}}>
                            <Button variant={"outlined"} onClick={submitSearch}>Thông tin tìm kiếm</Button>
                        </div>
                    </div>
                    <Divider ></Divider>
                </div>
                <div className={'table-content'}>
                    <div className={'table-content-title'}>
                        Nhóm quyền
                        <div>
                            {
                                currentUser.roles.includes('create_role')? <Button onClick={()=>{navigate("/role/create")}} variant="outlined" startIcon={<ControlPointIcon />}>
                                    Thêm mới
                                </Button>:""
                            }
                            {
                                currentUser.roles.includes('edit_role')? <Button style={{marginLeft:'10px'}} onClick={()=>{navigate("/permission")}} variant="outlined" >
                                    Danh sách quyền
                                </Button>:""
                            }
                        </div>

                    </div>
                    <TableContainer className={'table-container'}>
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:'30px'}} align="center">STT</TableCell>
                                    <TableCell>Tên nhóm quyền</TableCell>
                                    <TableCell>Mã nhóm quyền</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    {
                                        currentUser.roles.includes('edit_role')||currentUser.roles.includes('delete_role')?
                                            <TableCell className={"action-header"} style={{width:'150px'}}>Thao tác</TableCell>
                                            :""
                                    }
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
                                                   <div>{item.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                   <div>{item.code}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.description}</div>
                                                </TableCell>
                                                {
                                                    currentUser.roles.includes('edit_role')||currentUser.roles.includes('delete_role')?
                                                        <TableCell className={"action"}>
                                                            <div style={{display:'flex',justifyContent:'center'}}>
                                                                {
                                                                    currentUser.roles.includes('edit_role')?
                                                                        <Tooltip title={"Phân quyền"} arrow disableInteractive>
                                                                            <AssignmentTurnedInIcon style={{color:"#1e1e44",marginRight:"10px"}} onClick={()=>{navigate(`/role/permission?id=${item.id}`)}}></AssignmentTurnedInIcon>
                                                                        </Tooltip>:""
                                                                }
                                                                {
                                                                    currentUser.roles.includes('edit_role')?
                                                                        <Tooltip title={"Cập nhật"} arrow disableInteractive>
                                                                            <EditIcon style={{color:"#1e1e44",marginRight:"10px"}} onClick={()=>{navigate(`/role/update?id=${item.id}`)}}></EditIcon>
                                                                        </Tooltip>:""
                                                                }
                                                                {
                                                                    currentUser.roles.includes('delete_role')?<Tooltip title={"Xóa"} arrow disableInteractive>
                                                                        <DeleteForeverIcon onClick={()=>{
                                                                            setIdDel(item.id)
                                                                            setOpenModalDelete(true);

                                                                        }} color={"error"}>
                                                                        </DeleteForeverIcon>
                                                                    </Tooltip>:""
                                                                }



                                                            </div>
                                                        </TableCell>:""
                                                }

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