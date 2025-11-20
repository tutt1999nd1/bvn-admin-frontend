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
export default function ItemBar(props) {
    const {list,title,color} = props

    const [data, setData] = useState({

        datasets: [
            {
                label: 'Số lượng',
                display: false,
                data: list, backgroundColor:color?'#ff73379c':'rgba(53, 162, 235, 0.5)',
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
        barPercentage: 0.3,
    };



    useEffect(() => {
        let listLabel = []
        let listValue = []
        for (let i=0; i<list.length; i++) {
            listLabel.push("T"+list[i].name)
            listValue.push(list[i].value)
        }
        let data1 = [...data.datasets]
        data1[0].data = listValue
        setData({...data, labels: listLabel, datasets: data1})
    }, [props])
    return (
        <div className={'item-dashboard-pie-chart'}>
            <div className={'item-dashboard-header'}>
                <div className={'item-dashboard-tittle'}>
                    {
                        title
                    }
                </div>
            </div>

            <div className={'item-dashboard-body'} style={{ overflowY: 'auto', maxHeight: '300px' }}>
                <Bar options={options} data={data} height={250}></Bar>
            </div>
        </div>
    )
}