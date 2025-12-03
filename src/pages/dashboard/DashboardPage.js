import {Button, Divider, Grid, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
// import ItemDashBoardCurrent from "./ItemDashBoardCurrent";
// import ItemDashBoardSumRow from "./ItemDashBoardSumRow";
// import apiDashboard from "../../api/dashboard";
// import ModalListProject from "./ModalListProject";
// import ItemDashBoardPie from "./ItemDashBoardPie";
// import ItemDashBoardBar from "./ItemDashBoardBar";
// import ModalListProjectReport from "./ModalListProjectReport";
import dayjs from "dayjs";
import apiSchedule from "../../api/schedule";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ItemDashBoardCurrent from "./ItemDashBoardCurrent";
import ModalListProject from "./ModalListProject";
import ItemDashBoardPie from "./ItemDashBoardPie";
import ItemDashBoardBar from "./ItemDashBoardBar";

export default function DashboardPage() {
    const [idDetail, setIdDetail] = useState(null)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [openModalProjectList, setOpenModalProjectList] = useState(false)
    const [openModalProjectListReport, setOpenModalProjectListReport] = useState(false)
    const [timeSearch, setTimeSearch] = useState({
        start: (new dayjs()).startOf('week').add(1, "day"),
        end: (new dayjs()).endOf('week').add(1, "day"),
    })
    const [isCurrentMonth, setIsCurrentMonth] = useState(false)
    const [isCurrentWeek, setIsCurrentWeek] = useState(true)
    const [isCurrentYear, setIsCurrentYear] = useState(true)


    const currentUser = useSelector(state => state.currentUser)
    const [listSchedule, setListSchedule] = useState([]);
    const [listScheduleReferralSource, setListScheduleReferralSource] = useState([]);
    const [listScheduleNotary, setListScheduleNotary] = useState([]);
    const [listProjectUpdate, setListProjectUpdate] = useState([]);
    const [listStatus, setListStatus] = useState([{title: "Chưa có draff", amount: 10}, {
        title: "Đã hoàn thành",
        amount: 9
    }]);
    const [total, setTotal] = useState({
        feesNotary:0,
        feesTransportation:0,
        feesCopy:0,
        feesCollection:0
    })
    const [listProjectModel, setListProjectModel] = useState([])
    const [listNewProject, setListNewProject] = useState([])
    const [listProjectStatus, setListProjectStatus] = useState([])
    const [typeListProject, setTypeListProject] = useState({id: null, name: '', type: ''})
    useEffect(() => {
        console.log("currentUser.roles.includes(role) ===false", currentUser.roles.includes("manage_project"))
    }, [currentUser.roles])
    useEffect(() => {
        let count = 0;
        let feesNotary=0;
        let feesTransportation=0;
        let feesCopy=0;
        let feesCollection=0;
        let scheduleReferralSource = []
        let scheduleNotary = []
        let projectStatus = []
        count = listSchedule.length;
        console.log("listSchedule",listSchedule)
        for (let i = 0; i < listSchedule.length; i++) {
            let schedule = listSchedule[i];
            if(schedule.scheduleStatus!=null){
                if(schedule.scheduleStatus.code=="done"){
                    feesNotary = feesNotary + schedule.feesNotary
                    feesTransportation = feesTransportation + schedule.feesTransportation
                    feesCopy = feesCopy + schedule.feesCopy
                    feesCollection = feesCollection + schedule.feesCollection
                }
            }

            let key = schedule.referralSource?.id||-1;
            if(schedule.scheduleStatus!=null){
                if(schedule.scheduleStatus.code=='done') {
                    if (scheduleReferralSource.filter(e => e.key === key).length === 0) {
                        scheduleReferralSource.push({
                            key: key,
                            name: schedule.referralSource?.name|| "Khác",
                            code: schedule.referralSource?.code|| null,
                            amount: 1
                        })
                    } else
                        for (let j = 0; j < scheduleReferralSource.length; j++) {
                            if (scheduleReferralSource[j].key === key) {
                                scheduleReferralSource[j].amount = scheduleReferralSource[j].amount + 1;
                            }
                        }
                    scheduleReferralSource = scheduleReferralSource.sort((a, b) => {
                            if (a.code === null) return 1;
                            if (b.code === null) return -1;
                            return a.code - b.code;
                        }
                    )
                    setListScheduleReferralSource(scheduleReferralSource)
                }

            }



            let keyNotary = schedule.notary?.id||-1;
                if(schedule.scheduleStatus!=null){
                    console.log("schedule.scheduleStatus!=null")
                    if(schedule.scheduleStatus.code=='done'){
                        console.log("schedule.scheduleStatus=='done'")
                        if (scheduleNotary.filter(e => e.key === keyNotary).length === 0) {
                            scheduleNotary.push({
                                key: keyNotary,
                                name: schedule.notary?.fullName|| "Khác",
                                code: schedule.notary?.username|| null,
                                amount: schedule.feesNotary + schedule.feesCopy
                            })
                        } else
                            for (let j = 0; j < scheduleNotary.length; j++) {
                                if (scheduleNotary[j].key === keyNotary) {
                                    scheduleNotary[j].amount = scheduleNotary[j].amount + schedule.feesNotary + schedule.feesCopy;
                                }
                            }
                        scheduleNotary = scheduleNotary.sort((a, b) => {
                                if (a.code === null) return 1;
                                if (b.code === null) return -1;
                                return a.code - b.code;
                            }
                        )
                        setListScheduleNotary(scheduleNotary)
                    }
                }


            //
            // let keyStatus = project.projectStatus?.id || -1;
            // if (projectStatus.filter(e => e.key === keyStatus).length === 0) {
            //     projectStatus.push({
            //         key: keyStatus,
            //         name: project.projectStatus?.name || "Khác",
            //         code: project.projectStatus?.code || null,
            //         amount: 1
            //     })
            // } else
            //     for (let j = 0; j < projectStatus.length; j++) {
            //         if (projectStatus[j].key === keyStatus) {
            //             projectStatus[j].amount = projectStatus[j].amount + 1;
            //         }
            //     }
            // projectStatus = projectStatus.sort((a, b) => {
            //     if (a.code === null) return 1;
            //     if (b.code === null) return -1;
            //     return a.code - b.code;
            // })
            // setListProjectStatus(projectStatus)

        }


        setTotal({
            feesCopy: feesCopy,
            feesTransportation: feesTransportation,
            feesNotary: feesNotary,
            feesCollection: feesCollection
        })
    }, [listSchedule])


    useEffect(() => {
        getSchedule({
            paging: false,
            // pageSize: 10,
            startDate: timeSearch.start,
            endDate: timeSearch.end,
            // pageIndex: 1,
        }).then(r => {
            console.log('r')
            setListSchedule(r.data?.responses || [])
        }).catch(e => {
            console.log(e)
        })
    }, [timeSearch])

    const getSchedule = (body) => {
        return apiSchedule.search(body);
    }
    const onclickProjectStatus = (key, label) => {
        setTypeListProject({id: key, name: label, type: 'referralSource'})
        setOpenModalProjectList(true);
    }
    const onclickProjectModel = (key, label) => {
        setTypeListProject({id: key, name: label, type: 'notary'})
        setOpenModalProjectList(true);
    }
    const onclickSum = (key, label) => {
        setTypeListProject({id: key, name: label, type: 'sum'})
        setOpenModalProjectList(true);
    }
    const handleCloseModalDetail = () => {
        setOpenModalDetail(false)
    }
    const handleCloseModalProjectList = () => {
        setOpenModalProjectList(false)
    }
    const handleCloseModalProjectListReport = () => {
        setOpenModalProjectListReport(false)
    }
    return (
        <div className={'main-content'} style={
            {
                background: "#eeeff1",
                padding: '0 5px',
                // lineHeight: "1.5",
                // letterSpacing: "0.00938em"
            }}>
            <ModalListProject openModal={openModalProjectList} type={typeListProject}
                              handleCloseModal={handleCloseModalProjectList}
                              setOpenModalDetail={setOpenModalDetail}
                              setIdDetail={setIdDetail}
                              timeSearch={timeSearch}
            >


            </ModalListProject>
            {/*<ModalListProjectReport openModal={openModalProjectListReport} type={typeListProject}*/}
            {/*                        handleCloseModal={handleCloseModalProjectListReport}*/}
            {/*                        setOpenModalDetail={setOpenModalDetail}*/}
            {/*                        setIdDetail={setIdDetail}*/}
            {/*>*/}


            {/*</ModalListProjectReport>*/}
            <div className={'organization-select'}>
                <div style={{display:'flex'}}>
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
            </div>
            <div className={'wrapper-dashboard dashboard-ec'} style={
                {
                    // background: "#eeeff1",
                    // padding: '5px',
                    lineHeight: "1.5",
                    letterSpacing: "0.00938em"
                }}>
                <Grid container spacing={1}>
                    <Grid container md={12} item spacing={1}>
                        <Grid item xs={12} container spacing={1}>
                            <Grid item xs={12}>
                                <div className={'item-dashboard-wellcome'}>
                                    <div style={{marginRight: '10px'}}>
                                        <img style={{width: '200px'}}
                                             src={require('../../assets/img/logo-white.png')}/>
                                    </div>
                                    <div>
                                        <div className={'item-dashboard-tittle'}>Xin
                                            chào {currentUser.userInfo.fullName},
                                        </div>
                                        <div className={'item-dashboard-span'}>Bạn đang xem dữ liệu tổng quan
                                        </div>
                                    </div>

                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className={'item-dashboard new-employee item-dashboard-select'}
                                     onClick={() => {
                                         onclickSum()
                                     }}>
                                    <ItemDashBoardCurrent item={{
                                        title: "Phí công chứng",
                                        amount: total.feesNotary
                                    }}></ItemDashBoardCurrent>

                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className={'item-dashboard probationary-employee item-dashboard-select'}
                                     onClick={() => {
                                         onclickSum()
                                     }}>
                                    <ItemDashBoardCurrent
                                        item={{title: "Phí sao y", amount: total.feesCopy}}></ItemDashBoardCurrent>
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className={'item-dashboard leave-work item-dashboard-select'} onClick={() => {
                                    onclickSum()
                                }}>
                                    <ItemDashBoardCurrent item={{
                                        title: "Phí di chuyển",
                                        amount: total.feesTransportation
                                    }}></ItemDashBoardCurrent>

                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className={'item-dashboard feesCollection item-dashboard-select'} onClick={() => {
                                    setOpenModalProjectListReport(true)
                                }}>
                                    <ItemDashBoardCurrent item={{
                                        title: "Phí thu hộ",
                                        amount: total.feesCollection
                                    }}></ItemDashBoardCurrent>

                                </div>
                            </Grid>
                            {/*<Grid item xs={4}>*/}
                            {/*    <div className={'item-dashboard probationary-employee'}>*/}
                            {/*        <ItemDashBoardCurrent item={dossierLoanByTime} title={'Mượn hồ sơ'} ></ItemDashBoardCurrent>*/}
                            {/*    </div>*/}
                            {/*</Grid>*/}
                            {/*<Grid item xs={4}>*/}
                            {/*    <div className={'item-dashboard leave-work'}>*/}
                            {/*        <ItemDashBoardCurrent item={lateDossierLoan} type={"disablePre"} title={'Hồ sơ quá hạn trả'} ></ItemDashBoardCurrent>*/}
                            {/*    </div>*/}
                            {/*</Grid>*/}
                        </Grid>
                        {/*<Grid item xs={3}>*/}
                        {/*    /!*<ItemDashBoardSum total={total.count} list={listProjectModel}/>*!/*/}
                        {/*    <div className={'item-dashboard-sum'} style={{height: '100%'}}>*/}
                        {/*        <div className={'item-dashboard-sum-header'}>*/}
                        {/*            <div className={'item-dashboard-tittle'}>*/}
                        {/*                Tổng dự án*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <div className={'item-dashboard-sum-total'}>*/}
                        {/*            {total.count}*/}
                        {/*            <Divider></Divider>*/}
                        {/*        </div>*/}
                        {/*        <div className={'item-dashboard-sum-detail'}>*/}
                        {/*            /!*{*!/*/}
                        {/*            /!*    listProjectModel?.map((e, index) => (*!/*/}
                        {/*            /!*        <ItemDashBoardSumRow*!/*/}

                        {/*            /!*            onclick={() => {*!/*/}
                        {/*            /!*                setTypeListProject({id: e.key, name: e.name, type: 'projectModel'})*!/*/}
                        {/*            /!*                setOpenModalProjectList(true);*!/*/}
                        {/*            /!*            }}*!/*/}
                        {/*            /!*            item={{*!/*/}
                        {/*            /!*                title: e.name,*!/*/}
                        {/*            /!*                value: e.amount,*!/*/}
                        {/*            /!*                color: '#ff7337'*!/*/}
                        {/*            /!*            }}></ItemDashBoardSumRow>*!/*/}
                        {/*            /!*    ))*!/*/}
                        {/*            /!*}*!/*/}


                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</Grid>*/}

                    </Grid>

                    <Grid item container md={12} spacing={1}>
                        <Grid md={6} item>
                            <div style={{overflowY: 'auto'}}>
                                    <ItemDashBoardPie list={listScheduleReferralSource} onclick={onclickProjectStatus}
                                                      title={'Nguồn việc'}/>
                            </div>
                        </Grid>
                        <Grid md={6} item>
                            <div style={{overflowY: 'auto'}}>
                                <ItemDashBoardBar onclick={onclickProjectModel} list={listScheduleNotary}/>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}