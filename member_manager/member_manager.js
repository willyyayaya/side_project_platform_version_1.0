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
function searchUser() {
    const accountInput = document.getElementById("memberAccount").value.trim();
    const nameInput = document.getElementById("memberName").value.trim();

    // 搜尋會員
    const user = fakeData.find(
        u => u.account === accountInput || u.name === nameInput
    );

    if (user) {
        displayCategories(user);
    } else {
        alert("未找到會員資料");
    }
}

// 顯示會員的名單
function displayCategories(user) {
    const userList = document.getElementById("userList");
    userList.innerHTML = ""; // 清空舊的資料

    user.lists.forEach(list => {
        const button = document.createElement("button");
        button.textContent = list.listName;
        button.className = "listButton"; // 新增自訂的 CSS 類名
        button.addEventListener("click", () => displayDetails(list));
        userList.appendChild(button);
    });
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
function clearInputs() {
    document.getElementById("memberAccount").value = "";
    document.getElementById("memberName").value = "";
    document.getElementById("userList").innerHTML = ""; // 清空名單
    document.getElementById("detailContent").textContent = ""; // 清空詳細內容
}
