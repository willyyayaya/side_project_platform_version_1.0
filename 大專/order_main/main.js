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
    skill.innerText = '需要技能 : ' + responseSkillToJSON ;



    //會員資料
    //顯示發案者頭像和名字
    let ordermemberUrl = `http://localhost:8080/api/memberOrders/getMembersByOrderId/113`;
    let responseOrdermember = await fetch(ordermemberUrl);
    let responseOrdermemberToJSON = await responseOrdermember.json();
    console.log(responseOrdermemberToJSON);
    imgBorder.innerHTML = `<img class="img-fluid object-fit-contain" src="${responseOrdermemberToJSON[0].picurl}">`;
    memberName.innerText = `${responseOrdermemberToJSON[0].name}`;

    //內容
    detail.innerHTML = responseOrderToJSON.detail;






});