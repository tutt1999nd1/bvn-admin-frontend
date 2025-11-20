import {
    Autocomplete,
    Button,
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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {ThemeProvider, useTheme} from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import apiTableConfig from "../../../api/tableConfig";
import apiPermission from "../../../api/permission";
import ModalConfirmDel from "../../../components/ModalConfirmDelete";
import SettingColumnTable from "../../../components/SettingColumnTable";
import {getDefaultConfigTable} from "../../../constants/common";


export default function Permission(props) {
    const navigate = useNavigate()
    const {pathname} = useLocation();
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [idDetail, setIdDetail] = useState(null)
    const [listResult, setListResult] = useState([]);
    const currentUser = useSelector(state => state.currentUser)
    const [isRefresh, setIsRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [columns, setColumns] = useState(getDefaultConfigTable("permission"))
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);
    const [isRefreshConfigTable, setIsRefreshConfigTable] = useState(false)
    const [anchorElSettingTable, setAnchorElSettingTable] = useState(null);
    const openSettingTable = Boolean(anchorElSettingTable);
    const [limitOfPage, setLimitOfPage] = useState(50)
    const [totalResults, setTotalResults] = useState(0)
    const [openModalRemove, setOpenModalRemove] = useState(false)
    const [idRemove, setIdRemove] = useState(-1)
    const [loadingExport, setLoadingExport] = useState(false)
    const [isInitialRenderTime, setIsInitialRenderTime] = useState(true);
    const [objectSearch, setObjectSearch] = useState({
        name: "",
        code:"",
        description:"",
        summary:""
    })

    useEffect(() => {
        getConfigTableApi({tableName: "permission"}).then(r => {
            if (r.data.length == 0) {
                setColumns(getDefaultConfigTable("permission"))
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
        submitSearch()
    }, [objectSearch.carId])

    useEffect(() => {
        console.log("objectSearch", objectSearch)
    }, [objectSearch])

    useEffect(() => {
        if (!isInitialRender) {
            submitSearch();
        } else {
            setIsInitialRender(false);
        }
    }, [currentPage, limitOfPage])
    useEffect(() => {
        submitSearch();

    }, [isRefresh])


    const submitSearch = () => {
        searchApi({
            id: checkColumnVisible("id") ? objectSearch.id != "" ? objectSearch.id : null : null,
            name: checkColumnVisible("name") ? objectSearch.name != "" ? objectSearch.name : null : null,
            code: checkColumnVisible("code") ? objectSearch.code != "" ? objectSearch.code : null : null,
            description: checkColumnVisible("description") ? objectSearch.description != "" ? objectSearch.description : null : null,


            pageSize: limitOfPage,
            pageIndex: currentPage + 1,
            paging: true,
            sortBy: sortField,
            sortDirection: sortDirection
        }).then(r => {
            if (r.data.responses) {
                let result = r.data.responses;
                for (let i = 0; i < result.length; i++) {
                    // result[i].createdBy = result[i].createdBy?.name || ""

                }
                setListResult(result);
                setTotalResults(r.data.page.total_elements)

            } else {
                setTotalResults(0)
                setListResult([]);
            }
        })


    }
    const convertBookGenresToString = (arr) => {
        let result = "";
        for (let i = 0; i < arr.length; i++) {
            result = result + arr[i]['name'] + (i == arr.length - 1 ? "" : ", ");
        }
        return result;
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
        return apiPermission.search(body);
    }

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
        } else if (code == "id") {
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
        else if (code == "description") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.description}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, description: e.target.value})
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

        else if (code == "code") {
            return (
                <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
                    <div>
                        <TextField
                            size={"small"}
                            fullWidth
                            value={objectSearch.code}
                            onChange={(e) => {
                                setObjectSearch({...objectSearch, code: e.target.value})
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

        else return (
            <TableCell className={"filter-table"} style={{minWidth: '150px', top: 41}}>
            </TableCell>
        )

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
                console.log("e",e)
                handleCloseModalRemove()
                toast.error("Vui lòng xóa các phụ thuộc trước")
            })
    }
    const removeApi = (body) => {
        return apiPermission.delete(body)
    }

    return (
        <div className={'main-content'}>

            <ModalConfirmDel submitDelete={submitRemove} openModalDel={openModalRemove}
                             handleCloseModalDel={handleCloseModalRemove}></ModalConfirmDel>
            <div className={'organization-content'} style={{}}>
                <div style={{width: '100%'}}>

                    <div className={'children-organization'}>
                        <div className={'table-content'} style={{marginTop: '10px'}}>

                            <div className={'table-content-title'}
                                 style={{height: '40px', marginTop: '10px', marginBottom: '0px'}}>
                                Danh sách quyền
                                <div style={{
                                    marginRight: '15px',
                                    paddingBottom: '5px',
                                    display: "flex",
                                    justifyContent: 'center',
                                    alignItems:'center'
                                }}>
                                    {
                                        currentUser.roles.includes("edit_role") ?
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
                                            tableName={'permission'}
                                            columns={columns}
                                            isRefreshConfigTable={isRefreshConfigTable}
                                            setIsRefreshConfigTable={setIsRefreshConfigTable}>
                                        </SettingColumnTable>

                                    </Menu>
                                </div>

                            </div>

                            <Divider></Divider>

                            <div style={{position: 'relative'}}>
                                <div
                                    className={`message-table-empty ${listResult.length === 0 ? '' : 'hidden'}`}>Không
                                    có dữ liệu
                                </div>
                                <TableContainer className={'table-container'} style={{maxHeight: '700px'}}>
                                    <Table stickyHeader className={"table-custom"}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{textAlign: 'center'}}>STT</TableCell>

                                                {columns.map((column, index) => (
                                                    column.visible &&
                                                    <TableCell style={{cursor: 'pointer'}}
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


                                                    </TableCell>
                                                ))}
                                                <TableCell className={"action-header"}>Thao tác</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={"filter-table"}
                                                           style={{textAlign: 'center', top: 41}}></TableCell>
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
                                            {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                            {/*    <CircularProgress size={30}></CircularProgress>*/}
                                            {/*</div>*/}


                                            {
                                                listResult.map((item, index) => (
                                                    <>
                                                        <TableRow>
                                                            <TableCell style={{textAlign: 'center'}}>
                                                                <div>{(currentPage) * limitOfPage + index + 1}</div>
                                                            </TableCell>
                                                            {columns.map((column, columnIndex) => {
                                                                    if (column.visible) {
                                                                        if (column.code == "id") {
                                                                            return <TableCell style={{textAlign: 'center',}}
                                                                            >{item[column.code]}</TableCell>
                                                                        }
                                                                        else if (column.code == "stt") {
                                                                            return <TableCell style={{textAlign: 'center',}}
                                                                            >{item[column.code]}</TableCell>
                                                                        }
                                                                        else return <TableCell>{item[column.code]}</TableCell>
                                                                    } else return ""
                                                                }
                                                            )}

                                                            <TableCell className={"action"}>
                                                                <div className={'icon-action'} style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',

                                                                }}>

                                                                    {
                                                                        currentUser.roles.includes('edit_role') ?

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
                                                                        currentUser.roles.includes('edit_role') ?
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

                    </div>
                </div>
            </div>


        </div>)
}