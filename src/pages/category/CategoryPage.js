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
import {useLocation, useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import apiCategory from "../../api/category";
import {getTitleFromCodeCategory} from "../../constants/utils";
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import {ThemeProvider, useTheme} from "@mui/material/styles";
import * as locales from "@mui/material/locale";

export default function CategoryPage(props) {
    const {type} = props;
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0)
    const [totalResults, setTotalResults] = useState(0)
    const [limitOfPage, setLimitOfPage] = useState(10)
    const [result, setResult] = useState([])
    const [searchUsername, setSearchUsername] = useState("")
    const [totalPage, setTotalPage] = useState(0)
    const [search, setSearch] = useState(true)
    const [isRefreshTable, setRefreshTable] = useState(true)
    const currentUser = useSelector(state => state.currentUser)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [idDel,setIdDel] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    useEffect(() => {
        // setSearchUsername("")
        submitSearch()
    }, [type])
    const submitSearch = () => {
        getUserApi({
            name: searchUsername,
            pageSize: limitOfPage,
            pageIndex: currentPage+1,
            type: type,
            paging: true
        }).then(r => {
            console.log(r.data);
            if (r.data.responses) {
                setResult(r.data.responses);
                setTotalPage(r.data.page.total_pages)
                setTotalResults(r.data.page.total_elements)
            } else {
                setResult([]);
                setTotalPage(0)
                setTotalResults(0)
            }

        })
    }
    useEffect(() => {
        submitSearch()
    }, [currentPage, isRefreshTable,limitOfPage])


    const getUserApi = (body) => {
        return apiCategory.getCategory(body);
    }

    const deleteUserApi = (body) => {
        return apiCategory.deleteCategory(body)
    }
    const submitDel = () => {
        deleteUserApi({
            type: type,
            id: idDel
        }).then(r => {
            submitSearch()
            toast.success("Xóa thành công")
        }).catch(e=>{
            toast.error("Vui lòng xóa các phụ thuộc trước")
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
                            <div className={'label-input'}>Tên</div>
                            <TextField
                                size={"small"}
                                fullWidth
                                value={searchUsername}
                                onChange={(e) => {
                                    setSearchUsername(e.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        submitSearch()
                                    }
                                }}
                            />
                        </div>
                        <div style={{marginLeft: "20px", marginTop: '16px'}}>
                            <Button variant={"outlined"} onClick={submitSearch}>Tìm kiếm</Button>
                        </div>
                    </div>
                    <Divider></Divider>
                </div>
                <div className={'table-content'}>
                    <div className={'table-content-title'}>
                        {getTitleFromCodeCategory(type)}
                        {currentUser.roles.includes('create_category')||currentUser.roles.includes('manage_book')?<div>
                            <Button onClick={() => {
                                navigate(`${pathname}/create`)
                            }} variant="outlined" startIcon={<ControlPointIcon/>}>
                                Thêm mới
                            </Button>
                        </div>:''}

                    </div>
                    <TableContainer className={'table-container'}>
                        <Table stickyHeader className={"table-custom"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: '30px'}} align="center">STT</TableCell>
                                    <TableCell>Tên </TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    {
                                        currentUser.roles.includes('edit_category')||currentUser.roles.includes('delete_category')||currentUser.roles.includes('manage_book')?
                                            <TableCell className={"action-header"} style={{width: '150px'}}>Thao tác</TableCell>:""
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody style={{overflowY: "auto"}}>
                                {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                {/*    <CircularProgress size={30}></CircularProgress>*/}
                                {/*</div>*/}
                                <div
                                    className={`message-table-empty ${result.length === 0 ? 'mt-30' : 'hidden'}`}>Không
                                    có dữ liệu
                                </div>
                                {
                                    result.map((item, index) => (
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                    <div>{index + 1 + ((currentPage ) * limitOfPage)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{item.description}</div>
                                                </TableCell>
                                                {
                                                    currentUser.roles.includes('edit_category')||currentUser.roles.includes('delete_category')||currentUser.roles.includes('manage_book')?
                                                        <TableCell className={"action"}>
                                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                                                {
                                                                    currentUser.roles.includes('edit_category')||currentUser.roles.includes('manage_book')? <Tooltip title={"Cập nhật"}>
                                                                        <EditIcon style={{color: "#1e1e44", marginRight: "10px"}}
                                                                                  onClick={() => {
                                                                                      navigate(`${pathname}/update?id=${item.id}`)
                                                                                  }}></EditIcon>
                                                                    </Tooltip>:""
                                                                }
                                                                {
                                                                    currentUser.roles.includes('delete_category')||currentUser.roles.includes('manage_book')?  <Tooltip title={"Xóa"}>
                                                                        <DeleteForeverIcon onClick={() => {
                                                                            setIdDel(item.id)
                                                                            setOpenModalDelete(true)

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
                        marginTop: "5px"
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