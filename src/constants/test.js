function calculateTotalAmounts(data) {
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

// Ví dụ về cấu trúc dữ liệu
const data = [
    {
        id: 1,
        amount: 10,
        children: [
            {
                id: 2,
                amount: 5,
                children: [
                    {
                        id: 4,
                        amount: 3,
                    },
                    {
                        id: 5,
                        amount: 2,
                    },
                ],
            },
            {
                id: 3,
                amount: 7,
            },
        ],
    },
];

// Tính toán và trả về dữ liệu đã được bổ sung với trường 'totalAmount'
const newData = calculateTotalAmounts(data);
console.log(newData);