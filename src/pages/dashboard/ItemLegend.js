import React from "react";


export default function ItemLegend(props) {
    const {item,onclick} = props;


    return (
        <div className={'item-legend'} onClick={()=>{onclick(item.id,item.name)}}>
            {
                item.optimal? <></>: <div className={'item-legend-value'} style={{color:item.color}}>
                    {item.value}
                </div>
            }

            <div className={'item-legend-label'} style={{color:item.color}}>
                {item.label}
            </div>
        </div>
    );
}