import React, {useEffect, useState} from "react";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {convertToObjectMisa, currencyFormatter, getEndDayOfMonth, getFirstDayOfMonth} from "../../constants/utils";

export default function ItemDashBoardCurrent(props) {
    const {item} = props
    // const [percent, setPercent] = useState(0)
    //
    //
    // useEffect(() => {
    // }, [item])



    return (
        <div className={'item-dashboard-employee'}>
            <div className={'item-dashboard-employee-header'}>
                <div className={'item-dashboard-tittle'}>
                    {item.title}
                </div>

            </div>
            <div className={'item-dashboard-employee-total'}>
                <div className={'total'}>
                    {currencyFormatter(item.amount)}
                </div>
                <div className={'symbol'}>
                    VNĐ
                </div>



            </div>

        </div>
    )
}