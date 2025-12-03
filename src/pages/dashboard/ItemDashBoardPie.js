import React, {useEffect, useState} from "react";
import {ArcElement, Chart as ChartJS, Colors, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import {getListColor} from "../../constants/utils";
import ItemLegend from "./ItemLegend";


ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export default function ItemDashBoardPie(props) {
    const {title, list,onclick} = props;
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng',
                sum: 0,
                data: [0],
                hoverOffset: 4,
                backgroundColor: [],

            },
        ],
    })
    const textCenter = {
        id: 'textCenter',
        beforeDatasetsDraw(chart, args, options) {
            const {ctx, data} = chart;
            ctx.save();
            ctx.font = 'bold 20px Arial'
            ctx.textAlign = 'center';
            ctx.textBaseline = "middle";
            ctx.fillStyle = '#2566e9';
            ctx.fillText(data.datasets[0].sum, chart.getDatasetMeta(0).data[0]?.x, chart.getDatasetMeta(0).data[0]?.y)
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
    };
    useEffect(() => {
        let convert = convertToPie(list)
        let datasets = [...data.datasets]
        datasets[0].data = convert.data;
        datasets[0].sum = convert.sum;
        datasets[0].backgroundColor = getListColor(convert.data.length);

        setData({...data, labels: convert.labels, datasets: datasets,ids:convert.ids,names:convert.names})


    }, [props])
    const convertToPie = (data) => {
        let labels = [];
        let ids = [];
        let names = [];
        let listData = [];
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i].amount
        }
        for (let i = 0; i < data.length; i++) {
            ids.push(data[i].key)
            names.push(data[i].name)
            listData.push(data[i].amount)
            labels.push(`${data[i].name}: ${data[i].amount} (${((data[i].amount / sum)*100).toFixed(2)}%)`)
        }
        return {labels: labels, data: listData, sum: sum,ids,names}
    }

    return (
        <div className={'item-dashboard-pie-chart'}>
            <div className={'item-dashboard-header'}>
                <div className={'item-dashboard-tittle'}>{title}</div>
            </div>
            <div className={' wrapper-pie item-dashboard-body a'}>
                <div>
                    <Doughnut plugins={[textCenter]} height="200" width="300" options={options} data={data}/>
                </div>
                <div className={'custom-legend'}>
                    {data.labels.map((e, index) => (
                        <ItemLegend
                            onclick={onclick}
                            item={{
                            label: e,
                            name:data.names[index],
                            id:data.ids[index],
                            color: data.datasets[0].backgroundColor[index],
                            value: data.datasets[0].data[index]
                        }}></ItemLegend>
                    ))}
                </div>
            </div>
        </div>
    );
}