import React, {useEffect, useState} from "react";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {Divider} from "@mui/material";
import {convertToObjectMisa} from "../../constants/utils";
import ItemDashBoardSumRow from "./ItemDashBoardSumRow";

export default function ItemDashBoardSum(props) {
    const {total,list}=props
    return (
        <div className={'item-dashboard-sum'} style={{height:'100%'}}>
            <div className={'item-dashboard-sum-header'}>
                <div className={'item-dashboard-tittle'}>
                    Tổng dự án
                </div>
            </div>
            <div className={'item-dashboard-sum-total'}>
                {total}
                <Divider></Divider>
            </div>
            <div className={'item-dashboard-sum-detail'}>
                {
                    list?.map((e,index)=>(
                        <ItemDashBoardSumRow
                            item={{title: e.name, value: e.amount, color: '#74cb2f'}}></ItemDashBoardSumRow>
                    ))
                }


            </div>
        </div>
    )
}