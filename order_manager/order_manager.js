// 清除輸入框
function clearInputs() {
    document.getElementById('memberEmail').value = '';
    document.getElementById('orderList').innerHTML = '';
    document.getElementById('detailContent').innerHTML = '';
}

// 查詢會員專案
async function searchMember() {
    const memberEmail = document.getElementById('memberEmail').value;
    document.getElementById('detailContent').innerHTML = '';
    if (!memberEmail) {
        alert('請輸入會員信箱');
        return;
    }

    try {
        // 1. 呼叫 API 取得會員資料
        const memberResponse = await fetch(`http://localhost:8080/api/members/getMemberByEmail/${memberEmail}`);
        if (!memberResponse.ok) throw new Error('無法取得會員資料');
        const memberData = await memberResponse.json();
        const memberId = memberData.memberid;
        const memeberName = memberData.name;

        // 2. 呼叫 API 取得會員專案關係
        const memberOrdersResponse = await fetch(`http://localhost:8080/api/memberOrders/getAllMemberOrdersByMemberId/${memberId}`);
        if (!memberOrdersResponse.ok) throw new Error('無法取得會員專案關係');
        const memberOrders = await memberOrdersResponse.json();

        // 3. 呼叫 API 取得專案列表
        const ordersResponse = await fetch(`http://localhost:8080/api/memberOrders/getOrdersByMemberId/${memberId}`);
        if (!ordersResponse.ok) throw new Error('無法取得專案列表');
        const orders = await ordersResponse.json();

        // 4. 將專案關係與專案列表整合
        const orderMap = new Map();
        memberOrders.forEach(memberOrder => {
            orderMap.set(memberOrder.order.orderid, {
                owned: memberOrder.owned,
                wanted: memberOrder.wanted,
            });
        });

        // 5. 渲染專案列表
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = `<h3 style="padding: 20px;">${memeberName}的相關專案</h3>`;
        orders.forEach(order => {
            const orderInfo = orderMap.get(order.orderid) || { owned: false, wanted: false };
            const ownedTag = orderInfo.owned ? '<span class="tag pink">擁有</span>' : '';
            const wantedTag = orderInfo.wanted ? '<span class="tag yellow">想要</span>' : '';
            const deadline = new Date(order.deadline);
            const today = new Date();
            const progressTag =
                deadline < today
                    ? '<span class="tag blue">已完成</span>'
                    : '<span class="tag green">進行中</span>';

            const orderItem = document.createElement('div');
            orderItem.className = 'orderItem';
            orderItem.innerHTML = `
                <button class="listButton" style="float: left; margin-right: 10px;  width: 20%;" onclick="confirmDelete(${order.orderid})">刪除</button>
                <div style="float: left; margin-right: 10px;  width: 30%;">
                    ${ownedTag}
                    ${wantedTag}
                    ${progressTag}
                </div>
                <span onclick="showOrderDetail(${order.orderid})" style="float: left; margin-right: 10px; cursor: pointer; width: 50%;">${order.name}</span>
            `;
            orderList.appendChild(orderItem);
        });
    } catch (error) {
        alert(error.message);
    }
}


// 顯示專案詳細資訊
async function showOrderDetail(orderId) {
    try {
        const response = await fetch(`http://localhost:8080/api/orders/getOrderById/${orderId}`);
        if (!response.ok) throw new Error('無法取得專案詳細資料');
        const order = await response.json();

        const detailContent = document.getElementById('detailContent');
        detailContent.innerHTML = `
            <div class="detailField">
                <h3>專案名稱：<input type="text" value="${order.name}" id="orderName" /></h3>
            </div>
            <div class="detailField">
                <h5>截止日期：<input type="date" value="${order.deadline}" id="orderDeadline" /></h5>
            </div>
            <div class="detailField">
                <h5>簡介：<textarea id="orderIntro">${order.intro}</textarea></h5>
            </div>
            <div class="detailField">
                <h5>詳情：<textarea id="orderDetail">${order.detail}</textarea></h5>
            </div>
            <div class="detailField">
                <h5>地點：<input type="text" value="${order.location}" id="orderLocation" /></h5>
            </div>
            <div class="detailField">
                <h5>排名：<input type="number" value="${order.rank}" id="orderRank" /></h5>
            </div>
            <div class="detailField">
                <h5>人數：<input type="number" value="${order.people}" id="orderPeople" /></h5>
            </div>
            <div class="detailFooter">
                <button class="listButton" onclick="saveOrder(${orderId})">儲存</button>
                <button class="listButton" onclick="cancelEdit()">取消</button>
            </div>
        `;
    } catch (error) {
        alert(error.message);
    }
}


// 儲存專案修改
async function saveOrder(orderId) {
    try {
        const updatedOrder = {
            name: document.getElementById('orderName').value,
            deadline: document.getElementById('orderDeadline').value,
            intro: document.getElementById('orderIntro').value,
            detail: document.getElementById('orderDetail').value,
            location: document.getElementById('orderLocation').value,
            rank: document.getElementById('orderRank').value,
            people: document.getElementById('orderPeople').value
        };

        const response = await fetch(`http://localhost:8080/api/orders/updateOrder/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOrder)
        });

        if (!response.ok) throw new Error('更新失敗');
        alert('專案已成功更新');
        searchMember();
    } catch (error) {
        alert(error.message);
    }
}

// 取消編輯
function cancelEdit() {
    document.getElementById('detailContent').innerHTML = '';
}

// 確認刪除專案
function confirmDelete(orderId) {
    openDialog(orderId);
}

// 刪除專案
async function deleteOrder(orderId) {
    try {
        const memberEmail = document.getElementById('memberEmail').value;

        // 1. 呼叫 API 取得會員資料
        const memberResponse = await fetch(`http://localhost:8080/api/members/getMemberByEmail/${memberEmail}`);
        if (!memberResponse.ok) throw new Error('無法取得會員資料');
        const memberData = await memberResponse.json();
        const memberId = memberData.memberid;

        // 2. 呼叫 API 取得專案關係
        const memberOrdersResponse = await fetch(`http://localhost:8080/api/memberOrders/getAllMemberOrdersByMemberId/${memberId}`);
        if (!memberOrdersResponse.ok) throw new Error('無法取得會員專案關係');
        const memberOrders = await memberOrdersResponse.json();

        // 3. 確認專案關係並執行相應刪除操作
        const orderRelation = memberOrders.find(order => order.order.orderid === orderId);

        if (orderRelation?.owned) {
            // 擁有，執行兩個刪除 API
            const ownedDeleteResponse = await fetch(`http://localhost:8080/api/memberOrders/deleteOwnedOrder/${memberId}/${orderId}`, {
                method: 'DELETE',
            });
            if (!ownedDeleteResponse.ok) throw new Error('刪除擁有專案失敗');
            // 4. 刪除專案本體
            const orderDeleteResponse = await fetch(`http://localhost:8080/api/orders/deleteOrder/${orderId}`, {
                method: 'DELETE',
            });
            if (!orderDeleteResponse.ok) throw new Error('刪除專案失敗');
        }

        if (orderRelation?.wanted) {
            // 想要，執行移除 API
            const wantedDeleteResponse = await fetch(`http://localhost:8080/api/memberOrders/removeWantedOrder/${memberId}/${orderId}`, {
                method: 'DELETE',
            });
            if (!wantedDeleteResponse.ok) throw new Error('移除想要專案失敗');
        }
        
        alert('專案已成功刪除');
        searchMember();
    } catch (error) {
        alert(error.message);
    }
}

const dialog = document.querySelector('dialog');
function openDialog(orderId) {
    const confirmButton = dialog.querySelector('.listButton.confirm');
    confirmButton.setAttribute('onclick', `deleteOrder(${orderId})`);
    dialog.showModal();
}
function closeDialog() {
    dialog.close();
}
