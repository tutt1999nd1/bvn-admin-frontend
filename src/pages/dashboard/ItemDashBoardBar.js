import React, {useEffect, useState} from "react";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export default function ItemDashBoardBar(props) {
    const {item,list,onclick} = props
    const [data,setData]=useState({
        labels:[],
        datasets: [
            {
                label: 'Số lượng',
                display: false,
                data: [
                    0
                ], backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    })
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        onHover: (event, chartElement) => {
            if (chartElement.length) {
                event.native.target.style.cursor = 'pointer'; // Đặt con trỏ chuột kiểu pointer khi hover
            } else {
                event.native.target.style.cursor = 'default'; // Đặt lại con trỏ khi không hover
            }
        },
        onClick: (event, chartElement) => {
            if (chartElement.length) {
                const index = chartElement[0].index; // Lấy chỉ số của phần tử được nhấp
                const label = data.labels[index]; // Lấy nhãn tương ứng
                const value = data.datasets[0].data[index]; // Lấy giá trị tương ứng
                onclick(data.ids[index],data.names[index])
                // Thực hiện hành động bạn muốn ở đây
                // console.log(`Nhấp vào: ${label} với giá trị: ${value}`);
            }
        },
        // barPercentage: 0.2,
        categoryPercentage: 0.3, // Tăng giá trị này để cột gần nhau hơn

    };
    useEffect(()=>{
        let convert = convertToLineChart(list);
        // console.log("convert123",convert)
        let data1 = [...data.datasets]
        data1[0].data = convert.data
        setData({...data,labels: convert.labels,datasets: data1,ids:convert.ids,names:convert.names})
    },[props])
    const convertToLineChart = (data) => {
        if(data.length==0)return {labels:[''],listReceive:[0],listTermination:[0]}
        let labels = [];
        let listReceive = [];
        let ids = [];
        let names = [];
        for (let i=0; i<data.length; i++) {
            ids.push(data[i].key)
            names.push(data[i].name)
            labels.push(data[i].name);
            listReceive.push(data[i].amount||0)
        }
        return {labels:labels,data:listReceive,ids,names}
    }

    useEffect(()=>{

    },[props])
    return (
        <div className={'item-dashboard-pie-chart'}>
            <div className={'item-dashboard-header'}>
                <div className={'item-dashboard-tittle'}>
                    Doanh thu của công chứng viên
                </div>
            </div>

            <div className={'item-dashboard-body'}>
                <Bar options={options} data={data} height={250}></Bar>
            </div>
        </div>
    )
}