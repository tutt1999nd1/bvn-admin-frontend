import React, {useEffect, useState} from "react";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {Divider} from "@mui/material";
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, Chart} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import ItemLegend from "./ItemLegend";
import {currencyFormatter, getListColor} from "../constants/utils";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export default function ItemPie(props) {
    const {title,list,type,optimal} = props;
    const [sum,setSum] = useState(0);
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng',
                sum: 0,
                data: [0],
                hoverOffset: 4,
                backgroundColor:[],

            },
        ],

    })
    useEffect(()=>{

    },[data])
    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, options) {
            const {ctx, data} = chart;
            ctx.save();
            ctx.font = 'bold 20px Arial'
            ctx.textAlign = 'center';
            ctx.textBaseline = "middle";
            ctx.fillStyle = '#2566e9';
            ctx.fillText(data.datasets[0].sum, chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y)
        }
    }
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'right',
                labels: {
                    // boxWidth: 36,
                    // padding: 20,
                    font: {
                        size: 13
                    },
                },
            },
            // colors: {
            //     forceOverride: true,
            // }
        }
    };
    useEffect(() => {
        // console.log('list',list)
        if(list.length>0){
            let total = 0;
            let labels = []
            let datas = [];
            for (let i = 0; i < list.length;i++){
                labels.push(`${list[i].name||list[i].label}: ${currencyFormatter(list[i].value)} (${((list[i].value/sum) * 100).toFixed(2)}%)`)
                datas.push(list[i].value);
                total = total + list[i].value
            }
            setSum(total)
            let datasets = [...data.datasets]
            datasets[0].data = datas;
            datasets[0].sum = sum;
            datasets[0].backgroundColor = getListColor(datas.length);
            setData({...data, labels: labels, datasets: datasets})
        }
        else {
            setData({
                labels: [],
                datasets: [
                    {
                        label: 'Số lượng',
                        sum: 0,
                        data: [0],
                        hoverOffset: 4,
                        backgroundColor:[],

                    },
                ],

            })

        }



    }, [list,sum])

    return (

    <div className={`wrapper-pie item-dashboard-body ${type=='ict'?'ict':''}`}>
        {/*{*/}
        {/*    list.length===0?<div style={{height:'240px',display:'flex',alignItems:'center'}}>Không có liệu</div>:''*/}
        {/*}*/}

        {/*<div*/}
        {/*    style={{top:"45%"}}*/}
        {/*    className={`message-table-empty ${list.length== 0 ? 'mt-30' : 'hidden'}`}>Không*/}
        {/*    có dữ liệu*/}
        {/*</div>*/}
        <div>
            {/*<div>{list.length}</div>*/}

            <Doughnut plugins={optimal?[]:[textCenter]} height="200" width="200" options={options} data={data}/>
            {/*<Doughnut plugins={list.length>0?[textCenter]:[]} height="200" width="200" options={options} data={data}/>*/}
        </div>
        <div className={'custom-legend'} style={{height:'240px'}}>
            {data.labels.map((e,index)=>(
                <ItemLegend item={{
                    optimal:optimal,
                    label:e,
                    color:data.datasets[0].backgroundColor[index],
                    value:data.datasets[0].data[index]
                }}></ItemLegend>
            ))}
        </div>

    </div>
    );
}