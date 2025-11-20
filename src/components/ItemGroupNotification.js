import moment from "moment";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import ItemNotification from "./ItemNotification";

export default function ItemGroupNotification(props) {
    const {item,refresh,close}=props;
    useEffect(()=>{
        console.log("item",item)
    },[])

    const formatDateRelative = (dateString) => {
        const targetDate = new Date(dateString);
        const today = new Date();

        const diffInDays = Math.floor((today - targetDate) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return "Hôm nay";
        } else if (diffInDays === 1) {
            return "1 ngày trước";
        } else if (diffInDays > 1) {
            return `${diffInDays} ngày trước`;
        } else if (diffInDays === -1) {
            return "Ngày mai";
        } else if (diffInDays < -1) {
            return `${Math.abs(diffInDays)} ngày sau`;
        }
    }
    return <div className={`item-group-notification` }>
        <div className={'item-group-notification-header'}>
            <div className={'item-group-notification-header-date'}>{item.date}</div>
            <div className={'item-group-notification-header-datesep'}></div>
            <div className={'item-group-notification-header-date-ago'}>{formatDateRelative(item.date)}</div>
        </div>
        <div className={'item-group-notification-content'}>
            {
                item.items.map((info,index)=>(
                    <ItemNotification close={close} refresh={refresh} item={info}>
                    </ItemNotification>
                ))
            }

        </div>
    </div>

}