import {Typography} from "@mui/material";

export const convertToObjectMisa = (data) => {
    return JSON.parse(data.data)
}

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const getListColor = (length) => {
    let backgroundColor = [
        '#5788ec',
        '#80e69c',
        '#ff8d8d',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF8C00',
        '#FF5733',
        '#1E90FF',
        '#FF00FF',
        '#FF4500',
        '#32CD32',
        '#FF1493',
        '#00CED1',
        '#FFD700',
        '#8A2BE2',
        '#FF69B4',
        '#00FF7F',
        '#FFA500',
        '#008080',
        '#8B008B',
        '#FF6347',
        '#00FF00',
        '#FF00FF',
        '#FFFF00',
        '#800000',
        '#00FFFF',
        '#FFC0CB',
        '#800080'
    ]
    return backgroundColor.slice(0, length)
}

export function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography>{children}</Typography>
            )}
        </div>
    );
}

export function buildTree(inputList, parentId = null) {
    const tree = [];
    // Lọc ra các đối tượng có parentId tương ứng hoặc parentId=null (node to nhất)
    const filteredObjects = inputList.filter(obj => obj.ParentID === parentId || (parentId === null && obj.ParentID === undefined));

    // Tạo đối tượng cây với mỗi đối tượng trong danh sách
    filteredObjects.forEach(obj => {
        const {OrganizationUnitID, OrganizationUnitName, label, value, IsParent} = obj;
        const node = {
            label: OrganizationUnitName || label,
            key: OrganizationUnitID || value,
            data: OrganizationUnitID || value,

        };

        // Nếu đối tượng có IsParent=true, tiếp tục xây dựng cây với các đối tượng con
        if (IsParent) {
            node.children = buildTree(inputList, OrganizationUnitID);
        }

        tree.push(node);
    });

    return tree;
}

export const currencyFormatter = (value) => {
    const options = {
        significantDigits: 0,
        thousandsSeparator: '.',
        decimalSeparator: ',',
        symbol: ''
    }
    if (typeof value !== 'number' || value <= 0) value = 0.0
    value = value.toFixed(options.significantDigits)

    const [currency, decimal] = value.split('.')
    return `${currency.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        options.thousandsSeparator
    )}`
    // )}${options.decimalSeparator}${decimal} ${options.symbol}`
}
export const getListYear = () => {
    let year = (new Date()).getFullYear();
    let listYear = [];
    for (let i = 2010; i <= year; i++) {
        let item = {
            value: `${i}-01-01/${i}-12-31`,
            name: i
        }
        listYear.push(item);
    }
    return listYear;
}

export function buildTreeAsset(inputList, parentId = null) {
    const tree = [];
    // Lọc ra các đối tượng có parentId tương ứng hoặc parentId=null (node to nhất)
    const filteredObjects = inputList.filter(obj => obj.parentId === parentId || (parentId === null && obj.parentId === undefined));
    // const filteredObjects = inputList.filter(obj => obj.parentId === parentId );
    // Tạo đối tượng cây với mỗi đối tượng trong danh sách
    filteredObjects.forEach(obj => {
        const {id, name, description,amount} = obj;
        const node = {
            label: name,
            key: id,
            data: id,
            description: description,
            amount:amount
        };

        const hasChildren = inputList.some(childObj => childObj.parentId === obj.id);
        if (hasChildren) {
            node.children = buildTreeAsset(inputList, id);
        }

        tree.push(node);
    });

    return tree;
}

export const buildInputTree = (arr) => {
    let result = [...arr]
    for (let i = 0; i < arr.length; i++) {
        let check =false;
        for (let j = 0; j < arr.length; j++) {
            if(arr[i].parentId===arr[j].id){
                check=true;
                break;
            }
        }
        if(!check){
            arr[i].parentId=null
        }
    }
    return result;

}
// export function buildTreeAsset(inputList, parentId = null) {
//     const tree = [];
//     // Lọc ra các đối tượng có parentId tương ứng hoặc parentId=null (node to nhất)
//     // const filteredObjects = inputList.filter(obj => obj.parentId === parentId || (parentId === null && obj.parentId === undefined));
//     const filteredObjects = inputList.filter(obj => obj.parentId === parentId );
//
//     // Tạo đối tượng cây với mỗi đối tượng trong danh sách
//     filteredObjects.forEach(obj => {
//         const {id, name, description} = obj;
//         const node = {
//             label: name,
//             key: id,
//             data: id,
//             description:description
//         };
//
//         const hasChildren = inputList.some(childObj => childObj.parentId === obj.id);
//         if (hasChildren) {
//             node.children = buildTreeAsset(inputList, id);
//         }
//
//         tree.push(node);
//     });
//
//     return tree;
// }

export function compareTreeKeys(tree, key1, key2) {
    function compareTreeKeysChild(node, key2) {
        if (node.key == key2) {
            return true;
        } else {
            if (node.children) {
                for (let childNode of node.children) {
                    if (compareTreeKeysChild(childNode, key2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    if (tree.key == key1) {
        if (tree.children) {
            for (let node of tree.children) {
                if (compareTreeKeysChild(node, key2)) {
                    return true;
                }
            }
        }
    } else {
        if (tree.children) {
            for (let node of tree.children) {
                if (compareTreeKeys(node, key1, key2)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export const filterListKey = (tree, selectedNodeKeys) => {
    let listDel = [];
    let listKey = [];
    for (const id in selectedNodeKeys) {
        if (selectedNodeKeys[id].checked == true) {
            listKey.push(id)
        }
    }
    for (let i = 0; i < listKey.length; i++) {
        if (!listDel.includes(listKey[i])) {
            for (let j = 0; j < listKey.length; j++) {
                if (!listDel.includes(listKey[j])) {
                    if (i != j) {
                        if (compareTreeKeys(tree, listKey[i], listKey[j])) {
                            listDel.push(listKey[j])
                        }
                    }
                }

            }
        }
    }
    let result = '';
    for (let i = 0; i < listKey.length; i++) {
        if (!listDel.includes(listKey[i])) {
            result = result + (result === '' ? '' : ';') + listKey[i];
        }
    }
    return result;
}
export const getFirstDayOfMonth = () => {
    let currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return firstDayOfMonth.toISOString();
}
export const getEndDayOfMonth = () => {
    let currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return lastDayOfMonth.toISOString();
}
// export const sortTreeData = (data) => {
//     if (!data || data.length === 0) {
//         return data;
//     }
//
//     return data.sort((a, b) => a.label.localeCompare(b.label))
//         .map(item => {
//             if (item.children && item.children.length > 0) {
//                 item.children = sortTreeData(item.children);
//             }
//             return item;
//         });
// }
export function sortTreeData(data) {
    if (!data || data.length === 0) {
        return data;
    }

    return data.sort((a, b) => {
        if (a.children && !b.children) {
            return -1; // Mục a có children, mục b không có children => a lên trước b
        } else if (!a.children && b.children) {
            return 1; // Mục b có children, mục a không có children => b lên trước a
        } else {
            return a.label.localeCompare(b.label); // Sắp xếp theo thứ tự bảng chữ cái
        }
    }).map(item => {
        if (item.children && item.children.length > 0) {
            item.children = sortTreeData(item.children);
        }
        return item;
    });
}
export const getTitleFromCodeCategory = (type) => {
    if (type == "GroupDossier") {
        return "Nhóm hồ sơ"
    }
     else if (type == "StorageTime") {
        return "Thời gian bảo quản"

    } else if (type == "Security") {
        return "Độ bảo mật"

    } else if (type == "Branch") {
        return "Ngành"
    }
    else if (type == "Urgency") {
        return "Độ khẩn"
    }
    else if (type == "TypeDocument") {
        return "Loại văn bản"
    }
    else if (type == "FormDocument") {
        return "Hình thức văn bản"
    }
    else if (type == "BookGenre") {
        return "Thể loại"
    }
    else if (type == "Brand") {
        return "Hãng sản xuất"
    }
    else if (type == "TypeCar") {
        return "Loại xe"
    }
    else if (type == "TypeDossier") {
        return "Loại hồ sơ"
    }
    else if (type == "ItemChecklistCar") {
        return "Đầu mục kiểm tra xe"
    }
    else if (type == "TypeExpense") {
        return "Loại chi phí"
    }
    else if (type == "ItemSchedule") {
        return "Đầu mục lịch trình"
    }
    else if (type == "ItemMaintenance") {
        return "Đầu mục bảo dưỡng"
    }
    else if (type == "OrganizationPayment") {
        return "Đơn vị thanh toán"
    }
    else if (type == "OrganizationOwner") {
        return "Đơn vị sở hữu"
    }
    else if (type == "DocumentType") {
        return "Loại việc"
    }
    else if (type == "ScheduleStatus") {
        return "Trạng thái xử lý"
    }
}
export function calculateTotalAmounts(data) {
    function calculateTotalAmount(item) {
        if (!item.children || item.children.length === 0) {
            return item.amount;
        }

        let totalAmount = item.amount;

        for (const child of item.children) {
            totalAmount += calculateTotalAmount(child);
        }

        return totalAmount;
    }

    function addTotalAmountToParents(item) {
        if (!item.children || item.children.length === 0) {
            item.totalAmount = item.amount;
            return;
        }

        item.totalAmount = item.amount;

        for (const child of item.children) {
            addTotalAmountToParents(child);
            item.totalAmount += child.totalAmount;
        }
    }

    const newData = JSON.parse(JSON.stringify(data));

    for (const item of newData) {
        addTotalAmountToParents(item);
    }

    return newData;
}
export const getNameTreeRepository = (arr,id) => {
    const path = [];
    let currentUnit = arr.find((u) => u.id === id);

    while (currentUnit) {
        path.unshift(currentUnit.name);
        currentUnit = arr.find((u) => u.id === currentUnit.parentId);
    }

    return path.join(" : ");
}
export const bytesToKb = (bytes) => {
    return (bytes / 1024).toFixed(2);

}