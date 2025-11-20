import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import React, {useEffect, useState} from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from "react-toastify";
import apiOrganization from "../../api/organization";
import {buildInputTree, buildTreeAsset, sortTreeData} from "../../constants/utils";
import {Tree} from "primereact/tree";
import ModalEditRepository from "./ModalEditRepository";
import {TreeSelect} from "primereact/treeselect";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useSelector} from "react-redux";
import ModalConfirmDel from "../../components/ModalConfirmDelete";
import apiRepository from "../../api/repository";
import ModalEditRepositoryChild from "./ModalEditRepositoryChild";

export default function RepositoryPage() {
    const currentUser = useSelector(state => state.currentUser)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalDeleteChild, setOpenModalDeleteChild] = useState(false)
    const [selectedNodeKeysOrganization, setSelectedNodeKeysOrganization] = useState(null);
    const [expandedKeysOrganization, setExpandedKeysOrganization] = useState({0: true});
    const [listOrganizationTree, setListOrganizationTree] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    const [idDel, setIdDel] = useState(-1)
    const [idDelChild, setIdDelChild] = useState(-1)
    const handleCloseModalDel = () => {
        setOpenModalDelete(false)
    }
    const handleCloseModalDelChild = () => {
        setOpenModalDeleteChild(false)
    }
    const [listRepository, setListRepository] = useState([])
    const [listRepositoryTree, setListRepositoryTree] = useState([])
    const [currentRepository, setCurrentRepository] = useState({})
    const [currentRepositoryChild, setCurrentRepositoryChild] = useState({})
    const [listChildren, setListChildren] = useState([])
    const [selectedNodeKey, setSelectedNodeKey] = useState(-1);
    const [expandedKeys, setExpandedKeys] = useState({0: true});
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [openModalEditChild, setOpenModalEditChild] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isUpdateChild, setIsUpdateChild] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    useEffect(() => {
        let children = [];
        for (let i = 0; i < listRepository.length; i++) {
            if (selectedNodeKey == listRepository[i].id) {
                setCurrentRepository(listRepository[i])
            }
            if (listRepository[i].parentId == selectedNodeKey) {
                children.push(listRepository[i])
            }
        }
        if(listRepository.length==0){
            setCurrentRepository({})
        }
        else if (selectedNodeKey==-1&&listRepositoryTree.length>0){
            setSelectedNodeKey(listRepositoryTree[0].key)
        }
        setListChildren(children)
    }, [selectedNodeKey, listRepository])
    useEffect(() => {
        if (selectedNodeKeysOrganization != null)
            getRepository({id: selectedNodeKeysOrganization}).then(r => {
                setListRepository(r.data)
                let convert = buildTreeAsset(r.data)
                let sort = sortTreeData(convert)
                // if(currentRepository.id==null){
                //     if(sort.length>0){
                //         setSelectedNodeKey(sort[0].key)
                //     }
                // }
                if(sort.length>0){
                    console.log("sort[0].id",sort)
                    setSelectedNodeKey(sort[0].key)
                }
                setListRepositoryTree(sort)
            })
    }, [selectedNodeKeysOrganization])
    useEffect(() => {

        getRepository({id: selectedNodeKeysOrganization}).then(r => {
            if(currentRepository.id!=null){
                // setSelectedNodeKey
            }
            setListRepository(r.data)
            let convert = buildTreeAsset(r.data)
            let sort = sortTreeData(convert)
            // if(currentRepository.id==null){
            //     if(sort.length>0){
            //         console.log("sort[0].id",sort)
            //         setSelectedNodeKey(sort[0].key)
            //     }
            // }
            // if(sort.length>0){
            //     console.log("sort[0].id",sort)
            //     setSelectedNodeKey(sort[0].key)
            // }
            setListRepositoryTree(sort)
        })
    }, [isRefresh])
    useEffect(()=>{
        getOrganization().then(r => {
            setListOrganization(r.data)
            let inputTree = buildInputTree(buildInputTree(r.data))
            for (let i = 0; i < inputTree.length; i++) {
                if (inputTree[i].parentId == null) {
                    setSelectedNodeKeysOrganization(inputTree[i].id)
                    setExpandedKeysOrganization(
                        {
                            [inputTree[i].id]: true
                        }
                    )
                }
            }
            let convert = buildTreeAsset(buildInputTree(r.data))
            let sort = sortTreeData(convert)
            setListOrganizationTree(sort)
        })
    },[])

    const handleCloseModalEdit = () => {
        setIsUpdate(false)
        setOpenModalEdit(false)
    }
    const handleCloseModalEditChild = () => {
        setIsUpdateChild(false)
        setOpenModalEditChild(false)
    }
    const getOrganization = () => {
        return apiOrganization.getOrganizationByUser()
    }
    const getRepository = (body) => {
        return apiRepository.getRepository(body)
    }
    const deleteRepositoryApi = (body) => {
        return apiRepository.deleteRepository(body)
    }

    const [filterValue, setFilterValue] = useState('');

    const filterOptions = {
        filter: true,
        filterBy: 'label',
        filterPlaceholder: 'Tìm kiếm',
        filterMode: "strict",
        filterValue: filterValue,

    };
    const submitDel = () => {
        deleteRepositoryApi({
            id: idDel
        }).then(r => {
            setIsRefresh(!isRefresh)
            setSelectedNodeKey(-1)
            toast.success("Xóa thành công")
        }).catch(e => {
            toast.error("Vui lòng xóa các phụ thuộc trước")
        })
    }
    const submitDelChild = () => {
        deleteRepositoryApi({
            id: idDelChild
        }).then(r => {
            setIsRefresh(!isRefresh)
            toast.success("Xóa thành công")
        }).catch(e => {
            toast.error("Vui lòng xóa các phụ thuộc trước")
        })
    }
    return (
        <div className={'organization-wrapper'}>
            <ModalConfirmDel submitDelete={submitDel} openModalDel={openModalDelete}
                             handleCloseModalDel={handleCloseModalDel}></ModalConfirmDel>
            <ModalConfirmDel submitDelete={submitDelChild} openModalDel={openModalDeleteChild}
                             handleCloseModalDel={handleCloseModalDelChild}></ModalConfirmDel>

            <ModalEditRepository listOrganizationTree={listOrganizationTree}
                                   listOrganization={listOrganization}
                                 currentRepository={currentRepository} isRefresh={isRefresh}
                                   setIsRefresh={setIsRefresh} listRepositoryTree={listRepositoryTree}
                                   isUpdate={isUpdate} openModalEdit={openModalEdit}
                                 setSelectedNodeKey={setSelectedNodeKey}
                                   handleCloseModalEdit={handleCloseModalEdit}></ModalEditRepository>
            <ModalEditRepositoryChild
                                 currentRepository={currentRepository}
                                 currentRepositoryChild={currentRepositoryChild}
                                 isRefresh={isRefresh}
                                 setIsRefresh={setIsRefresh}
                                 isUpdateChild={isUpdateChild} openModalEditChild={openModalEditChild}
                                 handleCloseModalEditChild={handleCloseModalEditChild}></ModalEditRepositoryChild>
            <div className={'organization-header'}>
                <div className={'organization-header-title'}>
                    Quản lý kho

                </div>

                <div className={'flex'}>

                    {
                        currentUser.roles.includes('create_repository') ?
                            <Button onClick={() => {
                                setOpenModalEdit(true)
                            }} variant="outlined" startIcon={<ControlPointIcon/>}>
                                Thêm kho
                            </Button> : ""
                    }

                </div>
            </div>
            <div className={'organization-content'}>
                <div className={'organization-left'}>
                    <TreeSelect
                        {...filterOptions} filterMode="strict"
                        // filterMode="strict"
                        value={selectedNodeKeysOrganization}
                        onChange={(e) => {
                            setSelectedNodeKeysOrganization(e.value)
                        }}
                        options={listOrganizationTree}
                        expandedKeys={expandedKeysOrganization}
                        onToggle={(e) => setExpandedKeysOrganization(e.value)}
                        style={{width: '250px', zIndex: '1000000 !important', overflow: 'auto'}}
                        className="md:w-20rem w-full"
                        placeholder="Đơn vị"></TreeSelect>
                    <Tree
                        style={{marginTop: '5px'}}
                        expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
                        selectionMode="single" selectionKeys={selectedNodeKey}
                        onSelectionChange={(e) => setSelectedNodeKey(e.value)}
                        value={listRepositoryTree} filter
                        filterMode="strict" filterPlaceholder="Tìm kiếm kho" className="w-full md:w-30rem"/>
                </div>
                <div className={'organization-right'}>
                    <div
                        className={`message-table-empty ${currentRepository.id? 'hidden' : ''}`}>
                        <div>
                            Không có dữ liệu
                        </div>
                    </div>
                    <div className={`info-organization ${currentRepository.id?'':'hidden'}`}>
                        <div className={'organization-header-title'}>
                            {currentRepository.name}
                            {
                                currentUser.roles.includes('update_repository') ?
                                    <Tooltip title={'Cập nhật'} arrow disableInteractive>
                                        <DriveFileRenameOutlineIcon onClick={() => {
                                            setIsUpdate(true)
                                            setOpenModalEdit(true)
                                        }}/>
                                    </Tooltip> : ""
                            }
                            {
                                currentUser.roles.includes('delete_repository') ?
                                    <Tooltip title={'Xóa'} arrow disableInteractive>
                                        <DeleteForeverIcon color={"error"}
                                                           onClick={() => {
                                                               setIdDel(currentRepository.id)
                                                               setOpenModalDelete(true)
                                                               // deleteRepositoryApi({
                                                               //     id: currentRepository.id
                                                               // }).then(r=>{
                                                               //     setIsRefresh(!isRefresh)
                                                               //     setSelectedNodeKey(-1)
                                                               // }).catch(e=>{
                                                               //     toast.error("Vui lòng xóa các phụ thuộc trước")
                                                               // })
                                                           }}/>
                                    </Tooltip> : ""
                            }

                        </div>
                        <div className={'organization-group-info'}>
                        </div>
                    </div>
                    <div className={`children-organization ${currentRepository.id?'':'hidden'}`}>
                        <div className={'repository-detail-wrapper'}>
                            <div className={'repository-detail-info'}>
                                <div className={'label-group-input'}>
                                    Thông tin chi tiết
                                </div>
                                <div className={'repository-detail-info-row'}>
                                    <div className={'repository-detail-info-row-label'}>
                                        Tên:
                                    </div>
                                    <div className={'repository-detail-info-row-content'}>
                                        {currentRepository.name}
                                    </div>
                                </div>
                                <div className={'repository-detail-info-row'}>
                                    <div className={'repository-detail-info-row-label'}>
                                        Địa điểm:
                                    </div>
                                    <div className={'repository-detail-info-row-content'}>
                                        {currentRepository.location}
                                    </div>
                                </div>
                                <div className={'repository-detail-info-row'}>
                                    <div className={'repository-detail-info-row-label'}>
                                        Trạng thái:
                                    </div>
                                    <div className={'repository-detail-info-row-content'}>
                                        {currentRepository.status=='empty'?"Còn trống":"Đã đầy"}
                                    </div>
                                </div>
                                <div className={'repository-detail-info-row'}>
                                    <div className={'repository-detail-info-row-label'}>
                                        Mô tả:
                                    </div>
                                    <div className={'repository-detail-info-row-content'}>
                                        {currentRepository.description}
                                    </div>
                                </div>
                            </div>
                            <div className={'table-content'}>
                                <div className={'label-group-input'} style={{padding:'0 5px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                    <div>Phương tiện lưu trữ</div>
                                    {
                                        currentUser.roles.includes("create_repository")?    <Button onClick={() => {
                                            setOpenModalEditChild(true)
                                        }} variant="outlined" startIcon={<ControlPointIcon/>}>
                                            Thêm phương tiện lưu trữ
                                        </Button>:""
                                    }

                                </div>
                                <TableContainer className={'table-container'}>
                                    <Table stickyHeader className={"table-custom"}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{width: '30px'}} align="center">STT</TableCell>
                                                <TableCell style={{width: '350px'}}>Tên</TableCell>
                                                <TableCell style={{width: '30px'}}>Trạng thái</TableCell>
                                                <TableCell style={{maxWidth: '100px'}}>Địa điểm</TableCell>
                                                <TableCell style={{minWidth: '100px'}}>Mô tả</TableCell>
                                                {
                                                    currentUser.roles.includes('update_repository') || currentUser.roles.includes('delete_repository') ?
                                                        <TableCell className={"action-header"} style={{width: '150px'}}>Thao
                                                            tác</TableCell>
                                                        : ""
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody style={{overflowY: "auto"}}>
                                            {/*<div className={`message-table-empty ${loading ? 'mt-30' : 'hidden'}`}>*/}
                                            {/*    <CircularProgress size={30}></CircularProgress>*/}
                                            {/*</div>*/}
                                            <div
                                                className={`message-table-empty ${listChildren.length === 0 ? 'mt-30' : 'hidden'}`}>Không
                                                có dữ liệu
                                            </div>
                                            {
                                                listChildren.map((item, index) => (
                                                    <>
                                                        <TableRow>
                                                            <TableCell>
                                                                <div>{index + 1}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>{item.name}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>{item.status=='empty'?"Còn trống":"Đã đầy"}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>{item.location}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>{item.description}</div>
                                                            </TableCell>
                                                            {
                                                                currentUser.roles.includes('update_repository') || currentUser.roles.includes('delete_repository') ?
                                                                    <TableCell className={"action"}>
                                                                        <div style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center'
                                                                        }}>
                                                                            {
                                                                                currentUser.roles.includes('update_repository') ?
                                                                                    <Tooltip title={"Cập nhật"} arrow disableInteractive>
                                                                                        <EditIcon
                                                                                            style={{
                                                                                                color: "#1e1e44",
                                                                                                marginRight: "10px"
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                setCurrentRepositoryChild(item)
                                                                                                // navigate(`/role/update?id=${item.id}`)
                                                                                                setIsUpdateChild(true);
                                                                                                setOpenModalEditChild(true);
                                                                                            }}
                                                                                        ></EditIcon>
                                                                                    </Tooltip> : ""
                                                                            }
                                                                            {
                                                                                currentUser.roles.includes('delete_repository') ?
                                                                                    <Tooltip title={"Xóa"} arrow disableInteractive>
                                                                                        <DeleteForeverIcon
                                                                                            onClick={() => {
                                                                                                setIdDelChild(item.id)
                                                                                                setOpenModalDeleteChild(true)
                                                                                            }} color={"error"}>
                                                                                        </DeleteForeverIcon>
                                                                                    </Tooltip> : ""
                                                                            }


                                                                        </div>
                                                                    </TableCell> : ""
                                                            }

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