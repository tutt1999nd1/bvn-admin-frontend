import moment from "moment";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useNavigate} from "react-router-dom";
import apiNotification from "../api/notification";

export default function ItemNotification(props) {
    const navigate = useNavigate();
    const {handleCloseNotification,refresh, close,item} = props;
    const getAction = (type,action) => {
        if(type=="transfer_dossier"){
            if(action=="accept"){
                return "đã tiếp nhận bàn giao hồ sơ của bạn"
            }else if(action=="reject"){
                return "đã từ chối bàn giao hồ sơ của bạn"
            }
            else if(action=="transfer"){
                return "đã bàn giao hồ sơ cho bạn"
            }
        }
        else if(type=="share_dossier"){
            return "đã chia sẻ hồ sơ cho bạn"
        }
        else if(type=="transfer_document"){
            if(action=="accept"){
                return "đã tiếp nhận bàn giao văn bản của bạn"
            }else if(action=="reject"){
                return "đã từ chối bàn giao văn bản của bạn"
            }
            else if(action=="transfer"){
                return "đã bàn giao văn bản cho bạn"
            }
        }
        else if(type=="share_document"){
            return "đã chia sẻ văn bản cho bạn"
        }
        else if(type=="publish_document"){
            return "đã ban hành một văn bản"
        }
        else if(type=="loan_dossier"){
            if(action=="loan"){
                return "đã yêu cầu mượn hồ sơ của bạn"
            }else if(action=="accept"){
                return "đã duyệt yêu cầu mượn hồ sơ của bạn"
            }
            else if(action=="reject"){
                return "đã từ chối yêu cầu mượn hồ sơ của bạn"
            }
            else if(action=="return"){
                return "đã trả hồ sơ của bạn"
            }
            else if(action=="accept_return"){
                return "đã xác nhận yêu cầu trả hồ sơ của bạn"
            }
        }
        else if(type=="loan_book"){
            if(action=="loan"){
                return "đã yêu cầu mượn sách"
            }
            else if(action=="return"){
                return "đã trả sách"
            }

        }

    }
    const handleClick = (id) => {
        if(!item.isRead){
            readNotificationApi({
                id:id
            }).then(r=>{
                refresh()
            }).catch(e=>{
                console.log(e)
            })
        }
        close();
        if(item.type=="transfer_dossier"){
            if(item.content=="accept"){
                window.location = "/dossier/transfer?typeSearch=transferBy&id="+item.url
            }else if(item.content=="reject"){
                window.location = "/dossier/transfer?typeSearch=transferBy&id="+item.url
            }
            else if(item.content=="transfer"){
                window.location = "/dossier/transfer?id="+item.url
            }
        }
        else if(item.type=="share_dossier"){
            window.location = "/dossier?type=share&id="+item.url
        }
        else if(item.type=="transfer_document"){
            if(item.content=="accept"){
                window.location = "/document?type=transfer&typeSearch=transferBy&id="+item.url
            }else if(item.content=="reject"){
                window.location = "/document?type=transfer&typeSearch=transferBy&id="+item.url
            }
            else if(item.content=="transfer"){
                window.location = "/document?type=transfer&id="+item.url
            }
        }
        else if(item.type=="loan_dossier"){
            if(item.content=="loan"){
                window.location = "/dossier/loan?type=loan&typeSearch=manage&id="+item.url
            }
            else if(item.content=="accept"){
                window.location = "/dossier/loan?type=loan&typeSearch=loan&id="+item.url
            }
            else if(item.content=="reject"){
                window.location = "/dossier/loan?type=loan&typeSearch=loan"
            }
            else if(item.content=="return"){
                window.location = "/dossier/loan?type=loan&typeSearch=manage&id="+item.url
            }
            else if(item.content=="accept_return"){
                window.location = "/dossier/loan?type=loan&typeSearch=loan"
            }
        }
        else if(item.type=="share_document"){
            window.location = "/document?type=share&id="+item.url
        }
        else if(item.type=="loan_book"){
            window.location = "/loan-boss"
        }
        else if(item.type=="publish_document"){
            window.location = "/publish-document?id="+item.url;
        }
    }
    const readNotificationApi = (body) => {
        return apiNotification.readNotification(body)
    }
    return <div className={`item-notification ${!item.isRead ? 'item-notification-unread' : ''}`} onClick={()=>{handleClick(item.id)}}>
        <div className={'item-notification-content'}>
            <div className={'item-notification-content'}>
                    <b className={'item-notification-content-person'}>{item.sendBy}</b>
                {getAction(item.type,item.content)}
            </div>

        </div>
        <div className={'item-notification-time'}>
            {moment(item.time).format('HH:mm DD/MM/YYYY')}
        </div>
    </div>

}