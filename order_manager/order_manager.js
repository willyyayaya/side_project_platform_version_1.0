// 假資料集
const fakeData = [
    {
        account: "001",
        name: "鄭全賢",
        lists: [
            { listName: "購物清單", items: ["筆記本", "鉛筆", "橡皮擦"] },
            { listName: "興趣清單", items: ["籃球", "吉他"] }
        ]
    },
    {
        account: "002",
        name: "李洪靄",
        lists: [
            { listName: "工作事項", items: ["完成報告", "參加會議"] },
            { listName: "旅遊計畫", items: ["東京", "京都"] }
        ]
    },
    {
        account: "003",
        name: "陳南翊",
        lists: [
            { listName: "興趣清單", items: ["籃球", "吉他"] },
            { listName: "旅遊計畫", items: ["東京", "京都"] }
        ]
    },
    {
        account: "004",
        name: "游婉瑞",
        lists: [
            { listName: "工作事項", items: ["完成報告", "參加會議"] },
            { listName: "購物清單", items: ["筆記本", "鉛筆", "橡皮擦"] }
        ]
    }
];

// 初始化
// document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("search-button").addEventListener("click", searchUser);
//     document.getElementById("clear-button").addEventListener("click", clearInputs);
// });

// 查詢會員
async function searchUser() {
    const emailInput = document.getElementById("memberEmail").value.trim();
    const userListElement = document.getElementById("userList");
    const detailContentElement = document.getElementById("detailContent");

    // 清空之前的結果
    userListElement.innerHTML = "";
    detailContentElement.innerHTML = "";

    if (!emailInput) {
        alert("請輸入會員的 Email！");
        return;
    }

    try {
        // Step 1: 根據 Email 獲取會員 ID
        const memberResponse = await fetch(`http://localhost:8080/api/members/getMemberByEmail?email=${emailInput}`);
        if (!memberResponse.ok) {
            throw new Error("查無此會員，請確認 Email 是否正確！");
        }

        const memberData = await memberResponse.json();
        const memberId = memberData.memberid;

        // Step 2: 根據會員 ID 獲取專案清單
        const ordersResponse = await fetch(`http://localhost:8080/api/memberOrders/getOrdersByMemberId/${memberId}`);
        if (!ordersResponse.ok) {
            throw new Error("無法獲取會員的專案資料！");
        }

        const ordersData = await ordersResponse.json();

        // Step 3: 顯示專案清單
        if (ordersData.length === 0) {
            userListElement.innerHTML = `<p>此會員尚未參與任何專案。</p>`;
        } else {
            userListElement.innerHTML = "<h3>會員的專案清單：</h3>";
            const orderList = document.createElement("ul");

            ordersData.forEach(order => {
                const listItem = document.createElement("li");
                listItem.textContent = `${order.orderid}: ${order.ordername}`;
                listItem.style.cursor = "pointer";
                listItem.addEventListener("click", () => loadOrderDetail(order.orderid));
                orderList.appendChild(listItem);
            });

            userListElement.appendChild(orderList);
        }
    } catch (error) {
        alert(error.message);
    }
}

async function loadOrderDetail(orderId) {
    const detailContentElement = document.getElementById("detailContent");
    detailContentElement.innerHTML = "";

    try {
        // Step 4: 根據專案 ID 獲取專案詳細內容
        const orderResponse = await fetch(`http://localhost:8080/api/orders/getOrderById/${orderId}`);
        if (!orderResponse.ok) {
            throw new Error("無法獲取專案的詳細資料！");
        }

        const orderData = await orderResponse.json();

        // Step 5: 顯示專案詳細內容
        detailContentElement.innerHTML = `
            <h3>專案詳細內容</h3>
            <p><strong>專案名稱：</strong>${orderData.name}</p>
            <p><strong>專案期限：</strong>${orderData.deadline}</p>
            <p><strong>專案內容：</strong>${orderData.detail}</p>
            <p><strong>專案圖片：</strong>${orderData.picurl}</p>
            <p><strong>專案影片：</strong>${orderData.videourl}</p>
            <p><strong>專案評價：</strong>${orderData.rank}</p>
            <p><strong>專案所需人數：</strong>${orderData.people}</p>
        `;
    } catch (error) {
        alert(error.message);
    }
}

function clearInputs() {
    document.getElementById("memberEmail").value = "";
    document.getElementById("userList").innerHTML = "";
    document.getElementById("detailContent").innerHTML = "";
}

// 顯示會員的名單
function displayOrders(user) {
    const userList = document.getElementById("userList");
    userList.innerHTML = ""; // 清空舊的資料

    // 顯示使用者的名字
    const userName = document.createElement("h3");
    userName.textContent = `使用者名稱: ${user.name}`;
    userName.className = "userName"; // 可選，添加自訂樣式
    userList.appendChild(userName);

    // 顯示使用者的名單
    // user.lists.forEach(list => {
    //     const button = document.createElement("button");
    //     button.textContent = list.listName;
    //     button.className = "listButton"; // 自訂樣式
    //     button.addEventListener("click", () => displayDetails(list));
    //     userList.appendChild(button);
    // });
}

// 顯示名單的詳細內容
function displayDetails(list) {
    const detailContent = document.getElementById("detailContent");
    detailContent.textContent = ""; // 清空舊的內容

    const ul = document.createElement("ul");
    list.items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });

    detailContent.appendChild(ul);
}

// 清除輸入與顯示
// function clearInputs() {
//     document.getElementById("memberAccount").value = "";
//     document.getElementById("memberName").value = "";
//     document.getElementById("userList").innerHTML = ""; // 清空名單
//     document.getElementById("detailContent").textContent = ""; // 清空詳細內容
// }
