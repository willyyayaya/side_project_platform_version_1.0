// 清除輸入框
function clearInputs() {
    document.getElementById('memberEmail').value = '';
    document.getElementById('orderList').innerHTML = '';
    document.getElementById('detailContent').innerHTML = '';
}

// 查詢會員專案
async function searchUser() {
    const memberEmail = document.getElementById('memberEmail').value;
    if (!memberEmail) {
        alert('請輸入會員信箱');
        return;
    }

    try {
        // 呼叫 API 取得會員資料
        const memberResponse = await fetch(`http://localhost:8080/api/members/getMemberByEmail/${memberEmail}`);
        if (!memberResponse.ok) throw new Error('無法取得會員資料');
        const memberData = await memberResponse.json();
        
        const memberId = memberData.memberid;

        // 呼叫 API 取得會員專案
        const ordersResponse = await fetch(`http://localhost:8080/api/memberOrders/getOrdersByMemberId/${memberId}`);
        if (!ordersResponse.ok) throw new Error('無法取得專案列表');
        const orders = await ordersResponse.json();

        // 清空專案列表並渲染新的列表
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '';
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'orderItem';
            orderItem.innerHTML = `
                <button class="deleteButton" onclick="confirmDelete(${order.orderid})">刪除</button>
                <span onclick="showOrderDetail(${order.orderid})">${order.name}</span>
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
            <h3>${order.name}</h3>
            <p>${order.deadline}</p>
            <p>${order.detail}</p>
            <p>${order.location}</p>
            <p>${order.rank}</p>
            <p>${order.picurl}</p>
            <p>${order.people}</p>
        `;
    } catch (error) {
        alert(error.message);
    }
}

// 確認刪除專案
function confirmDelete(orderId) {
    if (confirm('是否確定刪除此專案？')) {
        deleteOrder(orderId);
    }
}

// 刪除專案
async function deleteOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:8080/api/orders/deleteOrder/${orderId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('刪除失敗');
        alert('專案已成功刪除');
        // 重新查詢專案列表
        searchUser();
    } catch (error) {
        alert(error.message);
    }
}
