$(document).ready(async function () {

    let urlParams = new URLSearchParams(window.location.search);
    let orderId = urlParams.get('orderId'); // 取得 orderId 參數
    let memberId = 110;
    console.log('memberId:' + memberId);
    console.log('orderId:' + orderId);

    let orderUrl = `http://localhost:8080/api/orders/getOrderById/${orderId}`;
    let responseOrder = await fetch(orderUrl);
    let responseOrderToJSON = await responseOrder.json();

    console.log(responseOrderToJSON);
    category.innerText = responseOrderToJSON.category;
    release.innerText = responseOrderToJSON.upload;
    projectTitle.innerText = responseOrderToJSON.name;
    updateDate.innerText = '最新更新時間:' + responseOrderToJSON.newdate;
    budget.innerText = '預算 : ' + responseOrderToJSON.budget;
    area.innerText = '地點 : ' + responseOrderToJSON.location;
    head.innerText = '建議人數 : ' + responseOrderToJSON.people + '人';
    deadline.innerText = '申請截止日 : ' + responseOrderToJSON.deadline;
    //需要技能
    let skillsUrl = `http://localhost:8080/api/tags/getTag/${orderId}`;
    let responseSkill = await fetch(skillsUrl);
    let responseSkillToJSON = await responseSkill.json();
    console.log(responseSkillToJSON);
    skill.innerText = '需要技能 : ' + responseSkillToJSON;

    //會員資料
    //顯示發案者頭像和名字
    //1.抓取會員資料
    let memberUrl = `http://localhost:8080/api/memberOrders/getMemberIdByOrderId/${orderId}`;
    let responseMember = await fetch(memberUrl);
    let responseMemberToJSON = await responseMember.json();
    console.log(responseMemberToJSON);
    console.log(responseMemberToJSON[0].memberid);
    //2.以會員id去拿個人資料
    imgBorder.innerHTML = `<img class="img-fluid object-fit-contain" src="${responseMemberToJSON[0].picurl}">`;
    memberName.innerText = `${responseMemberToJSON[0].name}`;

    let rankUrl = `http://localhost:8080/api/memberOrders/getRank/${responseMemberToJSON[0].memberid}`;
    let responseRank = await fetch(rankUrl);
    let responseRankToJSON = await responseRank.json();
    console.log(responseRankToJSON);
    if (responseRankToJSON === 0) {
        rank.innerText = '尚未評價過'
    }
    rank.innerText = '評價:' + (responseRankToJSON).toFixed(2) + '分';

    //內容
    detail.innerHTML = responseOrderToJSON.detail;

    //推薦其他專案
    let anotherUrl = 'http://localhost:8080/api/orders/getAllOrders';
    let responseAnother = await fetch(anotherUrl);
    let responseAnotherToJSON = await responseAnother.json();

    for (let i = 0; i < 4; i++) {
        const element = responseAnotherToJSON[i];
        // console.log(element);
        let another1 = $('<div>', {
            id: 'another1',
            class: 'mx-auto rounded-2',
        });

        let anotherTitle = $('<div>', {
            id: 'anotherTitle',
            text: element.name,
        });

        let anotherImg = $('<div>', {
            id: 'anotherImg',
            text: element.intro,
        });
        another1.append(anotherTitle, anotherImg)
        let anotherpro = $('<a>', {
            class: 'd-inline col-md-3',
            href: '',
        });
        anotherpro.append(another1);
        $('#another').append(anotherpro);
    }

    //編輯和申請按鈕
    if (responseSkillToJSON[0].memberid == `${memberId}`) {
        $('#edit').css('display', 'block');
    } else {
        $('#apply').css('display', 'block');
        let memberWantUrl = `http://localhost:8080/api/memberOrders/memberWanted/${orderId}/${memberId}`
        let responseWant = await fetch(memberWantUrl);
        let responseWantToJSON = await responseWant.json();
        console.log(responseWantToJSON);
        if (responseWantToJSON == true) {
            $('#apply').text('已申請');
        };
    }

    if ($('#apply').text() === '已申請') {
        $('#apply').prop('disabled', true);
    }

    edit.onclick = function () {
        window.location.href = `http://127.0.0.1:5500/%E5%A4%A7%E5%B0%88/order_update/order_update.html?orderId=${orderId}`;
    }

    apply.onclick = function () {
        let applyUrl = 'http://localhost:8080/api/memberOrders/addWantedOrder';
        fetch(applyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                memberId: memberId,
                orderId: orderId,
                "wanted": 1,
            })
        })
    }

    //顯示申請人數
    let applypeopleUrl = `http://localhost:8080/api/memberOrders/wanted/people/${orderId}`;
    let responsePreople = await fetch(applypeopleUrl);
    let responsePeopleToJSON = await responsePreople.json();
    console.log(responsePeopleToJSON);
    let applyPeople = '目前申請人數:' + responsePeopleToJSON + '人';
    $('#applyPeople').text(applyPeople);



    //收藏按鈕

    //先看是不是本人發的
    let collectUrl = `http://localhost:8080/api/memberOrders/getMemberIdByOrderId/${orderId}`;
    let responseCollect = await fetch(collectUrl);
    let responseCollectToJSON = await responseCollect.json();
    console.log('收藏者:' + responseCollectToJSON[0].memberid);

    if (responseCollectToJSON[0].memberid == `${memberId}`) {
        collect.style.visibility = "hidden";
    }

    //查會員是否已收藏
    let CollectedUrl = `http://localhost:8080/api/memberOrders/collected/${orderId}/${memberId}`;
    let responseCollected = await fetch(CollectedUrl);
    let responseCollectedToJson = await responseCollected.json();
    console.log('有沒有收藏:' + responseCollectedToJson);
    if (responseCollectedToJson === true) {
        collect.innerText = "已收藏";  // 初始顯示為「已收藏」
    } else {
        collect.innerText = "收藏";  // 初始顯示為「收藏」
    }

    collect.onclick = function () {
        let url;
        let newCollectedStatus;

        // 根據按鈕顯示的文字來判斷操作
        if (collect.innerText === "收藏") {
            // 如果當前顯示為「收藏」，則收藏專案
            url = 'http://localhost:8080/api/memberOrders/collected';
            newCollectedStatus = true;
            collect.innerText = "已收藏";  // 更新按鈕顯示為「已收藏」
        } else {
            // 如果當前顯示為「已收藏」，則取消收藏
            url = 'http://localhost:8080/api/memberOrders/removeMemberCollected';
            newCollectedStatus = false;
            collect.innerText = "收藏";  // 更新按鈕顯示為「收藏」
        }

        // 發送請求至後端來更新收藏狀態
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                memberId: memberId,
                orderId: orderId,
                collected: newCollectedStatus  // 傳送新的收藏狀態
            })
        }).then(response => response.json())
            .then(data => {
                // 成功後處理邏輯，這裡可以顯示通知或進行額外的操作
                console.log("收藏狀態已更新:", data);
            }).catch(error => {
                // 發生錯誤時的處理
                console.error("Error:", error);
            });
    };
});