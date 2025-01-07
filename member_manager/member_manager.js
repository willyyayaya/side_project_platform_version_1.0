// 清除輸入框並重新載入會員列表
function clearInputs() {
    document.getElementById('memberEmail').value = '';
    document.getElementById('detailContent').innerHTML = '';
    loadAllMembers(); // 呼叫載入所有會員的函式
}

// 載入所有會員
async function loadAllMembers() {
    document.getElementById('detailContent').innerHTML = '';
    try {
        const response = await fetch('http://localhost:8080/api/members/getAllMembers');
        if (!response.ok) throw new Error('無法取得會員列表');
        const members = await response.json();

        const memberList = document.getElementById('memberList');
        memberList.innerHTML = '';
        members.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.className = 'memberItem';
            memberItem.innerHTML = `
                <button class="listButton" style="float: left; margin-right: 10px;" onclick="confirmDelete(${member.memberid})">刪除</button>
                <span onclick="showMemberDetail('${member.email}')" style="float: left; margin-right: 10px; cursor: pointer;">${member.name}</span>
            `;
            memberList.appendChild(memberItem);
        });
    } catch (error) {
        alert(error.message);
    }
}

// 查詢特定會員
async function searchMember() {
    const memberEmail = document.getElementById('memberEmail').value;
    if (!memberEmail) {
        alert('請輸入會員信箱');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/members/getMemberByEmail/${memberEmail}`);
        if (!response.ok) throw new Error('無法取得會員資料');
        const member = await response.json();

        const memberList = document.getElementById('memberList');
        memberList.innerHTML = ''; // 清空列表
        const memberItem = document.createElement('div');
        memberItem.className = 'memberItem';
        memberItem.innerHTML = `
            <button class="listButton" style="float: left; margin-right: 10px;" onclick="confirmDelete(${member.memberid})">刪除</button>
                <span onclick="showMemberDetail('${member.email}')" style="float: left; margin-right: 10px; cursor: pointer;">${member.name}</span>
        `;
        memberList.appendChild(memberItem);
    } catch (error) {
        alert(error.message);
    }
}

// 顯示會員詳細資訊
async function showMemberDetail(email) {
    try {
        // 通過 email 獲取會員詳細資料
        const response = await fetch(`http://localhost:8080/api/members/getMemberByEmail/${email}`);
        if (!response.ok) throw new Error('無法取得會員詳細資料');
        const member = await response.json();

        // 更新顯示詳細內容
        const detailContent = document.getElementById('detailContent');
        detailContent.innerHTML = `
            <div class="detailField">
                <h3>會員名稱：<input type="text" value="${member.name}" id="memberName" /></h3>
            </div>
            <div class="detailField">
                <h6>帳號：<input type="text" value="${member.account}" id="memberAccount" /></h6>
            </div>
            <div class="detailField">
                <h6>信箱：<input type="text" value="${member.email}" id="memberEmailNew" /></h6>
            </div>
            <div class="detailField">
                <h6>生日：<input type="date" value="${member.birthday}" id="memberBirthday" /></h6>
            </div>
            <div class="detailField">
                <h6>電話：<input type="text" value="${member.tel}" id="memberTel" /></h6>
            </div>
            <div class="detailFooter">
                <button class="listButton" onclick="saveMember('${member.memberid}')">儲存</button>
                <button class="listButton" onclick="cancelEdit()">取消</button>
            </div>
        `;
    } catch (error) {
        alert(error.message);
    }
}

// 儲存會員修改
async function saveMember(memberId) {
    try {
        const updatedMember = {
            name: document.getElementById('memberName').value,
            account: document.getElementById('memberAccount').value,
            email: document.getElementById('memberEmailNew').value,
            birthday: document.getElementById('memberBirthday').value,
            tel: document.getElementById('memberTel').value
        };

        // 通過 memberId 更新會員資料
        const response = await fetch(`http://localhost:8080/api/members/updateMember/${memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMember)
        });

        if (!response.ok) throw new Error('更新失敗');
        alert('會員已成功更新');
        loadAllMembers(); // 更新後重新載入會員列表
    } catch (error) {
        alert(error.message);
    }
}

// 取消編輯
function cancelEdit() {
    document.getElementById('detailContent').innerHTML = '';
}

// 確認刪除會員
function confirmDelete(memberId) {
    openDialog(memberId);
}

// 刪除會員
async function deleteMember(memberId) {
    try {
        const response = await fetch(`http://localhost:8080/api/members/deleteMember/${memberId}`, { 
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('刪除會員失敗');
        alert('會員已成功刪除');
        loadAllMembers(); // 刪除後重新載入會員列表
    } catch (error) {
        alert(error.message);
    }
}

const dialog = document.querySelector('dialog');
function openDialog(memberId) {
    const confirmButton = dialog.querySelector('.listButton.confirm');
    confirmButton.setAttribute('onclick', `deleteMember(${memberId})`);
    dialog.showModal();
}
function closeDialog() {
    dialog.close();
}

// 初始化頁面
window.onload = () => {
    loadAllMembers(); // 頁面載入時載入所有會員
};
