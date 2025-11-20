export const OPTION_TOAST = {
    position: "top-right",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
}
export const clearToken = () => {
    localStorage.clear();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("accessTokenExp");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExp");
}
export const compareDate = (a, b) => {
    if (a == "Empty" || b == "Empty") {
        return false
    } else
        return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}
export const convertObjectToParameter = (obj) => {
    let result = '?';
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key])
                result += encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]) + "&";
        }
    }
    return result;
}
export const convertToAutoComplete = (arr, name) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].label = arr[i][name];
    }
    arr.sort((a, b) => a[name].localeCompare(b[name]));
    return arr;
}
export const getNameCaddy = (arr, CaddyNo) => {

    let caddy = arr.find(function (obj) {
        return obj.CaddyNo === CaddyNo;
    });
    return caddy ? caddy.CaddyName : '';
}
export const getIdGuestType = (arr, name) => {
    let type = arr.find(function (obj) {
        return obj.label === name;
    });
    return type ? type.id : '';
}
export const convertCustomToAutoComplete = (arr, id, name) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].label = arr[i][name];
        arr[i].id = arr[i][id];
    }
    return arr;
}
export const convertCaddyToAutoComplete = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].label = arr[i]['CaddyName'] + ' - ' + arr[i]['CaddyNo'];
        arr[i].id = arr[i]['CaddyNo'];
    }
    return arr;
}
export const checkDuplicateMember = (arr) => {
    const idSet = new Set();
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (!isNotEmpty(obj.MemberID)) continue;
        if (idSet.has(obj.MemberID)) {
            return true;
        }
        idSet.add(obj.MemberID);
    }
    return false; // Không tìm thấy đối tượng trùng id
}
export const checkDuplicateCaddy = (arr) => {
    const idSet = new Set();
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (!isNotEmpty(obj.CaddyNo)) continue;
        if (idSet.has(obj.CaddyNo)) {
            return true;
        }
        idSet.add(obj.CaddyNo);
    }
    return false; // Không tìm thấy đối tượng trùng id
}

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const convertTeeTimeToAutoComplete = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let date = new Date(arr[i].TeeTime);
        arr[i].label = `${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
    }
    return arr;
}
export const isNotEmpty = (value) => {
    return value !== null && value !== undefined && value !== '';
}
export const getLabelTeeTime = (value) => {
    let date = new Date(value);
    return `${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
}

export const getDefaultConfigTable = (tableName) => {
    if(tableName=='permission'){
        let columns = [
            {index:1,name:"ID",code:"id",visible:false},
            // {index:1,name:"STT",code:"stt",visible:true},
            {index:1,name:"Tên",code:"name",visible:true},
            {index:1,name:"Mã",code:"code",visible:true},
            {index:1,name:"Ghi chú",code:"description",visible:true},

        ]
        return columns;
    }
    else if(tableName=='schedule'){
        let columns = [
            {index:1,name:"ID",code:"id",visible:true},
            // {index:1,name:"STT",code:"stt",visible:true},
            {index:1,name:"Lịch hẹn",code:"name",visible:true},
            {index:1,name:"Khách hàng",code:"customerName",visible:true},
            {index:1,name:"Công chứng viên",code:"notary",visible:true},
            {index:1,name:"Thời gian",code:"date",visible:true},
            {index:1,name:"Địa chỉ",code:"address",visible:true},
            {index:1,name:"Thông tin liên hệ",code:"contact",visible:true},
            {index:1,name:"Phí công chứng",code:"feesNotary",visible:true},
            {index:1,name:"Phí di chuyển",code:"feesTransportation",visible:true},
            {index:1,name:"Phí sao y",code:"feesCopy",visible:true},
            {index:1,name:"Phí thu hộ",code:"feesCollection",visible:true},
            {index:1,name:"Loại việc",code:"documentType",visible:true},
            {index:1,name:"Trạng thái",code:"scheduleStatus",visible:true},
            {index:1,name:"Ghi chú",code:"description",visible:true},
        ]
        return columns;
    }
}
export const getDefaultColumnsTableTransfer = () => {
    let columns = [
        {index:0,name:"Thời gian bàn giao",code:"transferAt",visible:true},
        {index:1,name:"Trạng thái",code:"status",visible:true},
        {index:2,name:"Tên hồ sơ",code:"name",visible:true},
        {index:3,name:"Mã hồ sơ",code:"code",visible:true},
        {index:4,name:"Người bàn giao",code:"transferBy",visible:true},
        {index:5,name:"Người nhận bàn giao",code:"transferTo",visible:true},
        {index:6,name:"Nội dung bàn giao",code:"description",visible:true},
        {index:7,name:"Ý kiến phản hồi",code:"reason",visible:true},
    ]
    return columns;
}
export const getDefaultColumnsTableTransferDocument = () => {
    let columns = [
        {index:0,name:"Thời gian bàn giao",code:"transferAt",visible:true},
        {index:1,name:"Trạng thái",code:"status",visible:true},
        {index:2,name:"Trích yếu nội dung văn bản",code:"name",visible:true},
        {index:3,name:"Mã văn bản",code:"code",visible:true},
        {index:4,name:"Người bàn giao",code:"transferBy",visible:true},
        {index:5,name:"Người nhận bàn giao",code:"transferTo",visible:true},
        {index:6,name:"Nội dung bàn giao",code:"description",visible:true},
        {index:7,name:"Ý kiến phản hồi",code:"reason",visible:true},
    ]
    return columns;
}
export const getDefaultColumnsPublish = () => {
    let columns = [
        {index:1,name:"ID",code:"id",visible:true},
        {index:2,name:"Ngày đến",code:"createdAt",visible:true},
        {index:3,name:"Ngày ban hành",code:"publishDate",visible:true},
        {index:4,name:"Ngày có hiệu lực",code:"startDate",visible:true},
        {index:5,name:"Ngày hết hạn",code:"endDate",visible:true},
        {index:6,name:"Trích yếu nội dung văn bản",code:"name",visible:true},
        {index:7,name:"Độ khẩn",code:"urgency",visible:false},
        {index:8,name:"Hình thức văn bản",code:"formDocument",visible:false},
        {index:9,name:"Người ký",code:"signer",visible:true},
        {index:10,name:"File đính kèm",code:"attachment",visible:true},
        {index:11,name:"Ghi chú",code:"description",visible:true},
        {index:11,name:"Trạng thái",code:"status",visible:true},

    ]
    return columns;
}
export function filterChildren(data) {
    const idSet = new Set(data.map(item => item.id));

    return data.filter(item => {
        if (item.parentId === null || !idSet.has(item.parentId)) {
            return true;
        }
        return false;
    });
}