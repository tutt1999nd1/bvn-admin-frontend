import React, {useEffect} from "react";
import {Icon} from "@fluentui/react/lib/Icon";
import {getFileTypeIconProps} from "@uifabric/file-type-icons";
import {bytesToKb} from "../constants/utils";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
export default function ItemFileUpload(props) {
    const {item,deleteFile,deleteFileServer,type} = props;
    useEffect(() => {
        console.log("item", item)
    }, [item])
    return (
        <div className={'item-file-upload'}>
            <div className={'item-file-upload-delete-icon'}>
                {
                    type!="attachment"?<CloseIcon
                        style={{cursor: "pointer"}}
                        color={"error"}
                        onClick={() => {
                            if(type=="server"){
                                deleteFileServer(item.id,item.name)
                            }else
                                deleteFile(item.name)
                            // deleteFileServer(e.id, e.name)
                        }}></CloseIcon>:""
                }

            </div>

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