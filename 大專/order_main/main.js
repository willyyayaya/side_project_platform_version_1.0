$(document).ready(async function () {

    let urlParams = new URLSearchParams(window.location.search);
    let orderId = urlParams.get('orderid'); // 取得 orderId 參數

    console.log(orderId);

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
    head.innerText = '建議人數 : ' + responseOrderToJSON.people;
    deadline.innerText = '申請截止日 : ' + responseOrderToJSON.deadline;
    //需要技能
    let skillsUrl = `http://localhost:8080/api/tags/getTagNames`;
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
    rank.innerText = '評價:' + (responseRankToJSON).toFixed(2) + '分';


    //內容
    detail.innerHTML = responseOrderToJSON.detail;

    //收藏按鈕
    collect.onclick = function () {
        let ownedUrl = 'http://localhost:8080/api/memberOrders/addWantedOrder';
        fetch(ownedUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                memberId: responseMemberToJSON[0].memberid,
                orderId: orderId,
                owned: 0,
                wanted: 1
            })
        })

        // .then(response => {
        //     if (response.ok) {
        //         // 如果請求成功，更新按鈕文字
        //         $('#collect').text = '已收藏';
        //     } else {
        //         // 如果有錯誤，顯示錯誤提示
        //         alert("錯誤: 無法標記為感興趣");
        //     }
        // })
        // .catch(error => {
        //     console.error("發生錯誤:", error);
        //     alert("發生錯誤，請稍後再試");
        // });
    };



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


    //顯示申請人數
    let applypeopleUrl = `http://localhost:8080/api/memberOrders/collected/people/${orderId}`;
    let responsePreople = await fetch(applypeopleUrl);
    let responsePeopleToJSON = await responsePreople.json();
    console.log(responsePeopleToJSON);
    let ap = '目前申請人數:' + responsePeopleToJSON + '人';
    $('#applyPeople').text(ap);



    //申請按鈕
    apply.onclick = function () {
        let applyUrl = 'http://localhost:8080/api/memberOrders/collected';
        fetch(applyUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                memberId: responseMemberToJSON[0].memberid,
                orderId: orderId,
                "collected": 1
            })
        })
    }
});