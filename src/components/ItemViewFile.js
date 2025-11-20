import React, {useEffect, useState} from "react";
import {Button, Divider, Switch} from "@mui/material";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import apiTableConfig from "../api/tableConfig";
import {getDefaultConfigTable} from "../constants/common";
import {Icon} from "@fluentui/react/lib/Icon";
import {getFileTypeIconProps} from "@uifabric/file-type-icons";
import {bytesToKb} from "../constants/utils";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
export default function ItemViewFile(props) {
    const {item,onclick} = props;
    useEffect(() => {
        console.log("item", item)
    }, [item])
    return (
        <div className={'item-file-upload'} onClick={()=>{onclick(item.id)}} style={{cursor:'pointer'}}>
            <div className={'item-file-upload-icon'}>
                <Icon {...getFileTypeIconProps({extension: item?.name.split(".")[item?.name.split(".").length-1] || "", size: 20})} />
            </div>

            <div className={'item-file-upload-info'}>
                <div className={'item-file-upload-info-name'}>
                    {item?.name||''}
                </div>
                <div className={'item-file-upload-info-size'}>
                    {bytesToKb(item?.size||0)}KB
                </div>
            </div>

        </div>
    );
}