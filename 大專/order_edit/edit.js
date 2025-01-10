$(document).ready(async function () {
    //文字編輯器    
    var quill = new Quill("#editor", {
        theme: "snow", // 模板
        modules: {
            toolbar: [
                // 工具列列表[註1]
                ['bold', 'italic', 'underline', 'strike'], // 粗體、斜體、底線和刪節線
                ['blockquote', 'code-block'], // 區塊、程式區塊
                [{ 'header': 1 }, { 'header': 2 }], // 標題1、標題2
                [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 清單
                [{ 'indent': '-1' }, { 'indent': '+1' }], // 縮排
                [{ 'direction': 'rtl' }], // 文字方向
                [{ 'size': ['small', false, 'large', 'huge'] }], // 文字大小
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],// 標題
                [{ 'color': [] }, { 'background': [] }], // 顏色
                [{ 'font': [] }], // 字體
                [{ 'align': [] }], // 文字方向
                ['clean'] // 清除文字格是
            ]
        },
        placeholder: '請在此輸入內容...'
    });



    //地點選單
    $("#region").append('<option>1</option>');
    $("#region").append('<option>2</option>');
    $("#region").append('<option>3</option>');
    //需求技能(抓資料庫內容)
    // $("#skill").append('<input type="checkbox" name="needSkill" value="Python">');
    // $("input[value='Python']").after('<span>' + $('input[value="Python"]').val() + '</span>');
    let skillsUrl = `http://localhost:8080/api/tags/getTagNames`;
    let responseSkill = await fetch(skillsUrl);
    let responseSkillToJSON = await responseSkill.json();
    console.log('輸入技能種類' + responseSkillToJSON);
    // 確保 #skill 容器清空，避免重複添加
    $("#skill").empty();
    // 動態生成checkbox和對應的標籤
    var i = 1;
    responseSkillToJSON.forEach(skill => {
        // 動態添加checkbox
        let checkbox = $('<input>', {
            type: 'checkbox',
            name: 'needSkill',
            value: i++
        });
        // 動態添加對應的標籤
        let span = $('<span>').text(skill);
        // 把checkbox和span放進#skill元素中
        $("#skill").append(checkbox).append(span);
    });


    $("select[name='region']").css("display", "none");
    if ($('input[value="region"]').prop('checked')) {
        $('select[name="region"]').css("display", "inline-block");
    } else if ($('input[value="遠端工作"]').prop('checked')) {
        $("select[name='region']").css("display", "none");
    }

    $('input[name="workplace"]').change(function () {
        if ($('input[value="region"]').prop('checked')) {
            $('select[name="region"]').css("display", "inline-block");
        } else if ($('input[value="遠端工作"]').prop('checked')) {
            $("select[name='region']").css("display", "none");
        }
    })


    insert.onclick = function () {
        console.log($('#simpleInfo').val());
        console.log($("#category").val());
        console.log($("#projectTitle").val());
        console.log($("input[name='budget']:checked").val());

        if ($('input[name="workplace"]:checked').val() == "region") {
            console.log($('#region').val());
            var rigion = $('#region').val();
        } else if ($('input[name="workplace"]:checked').val() == "遠端工作") {
            console.log($('input[value="遠端工作"]').val());
            var rigion = $('input[value="遠端工作"]').val();

        }

        var selectedSkills = [];
        $("input[name='needSkill']:checked").each(function () {
            selectedSkills.push($(this).val());
        });
        console.log(selectedSkills);

        console.log($('#people').val());
        console.log($('#deadline').val());

        console.log($('img').prop("src"));

        var htmlContent = quill.root.innerHTML; // 獲取 HTML 內容
        console.log(htmlContent);





        //上傳專案表單
        let orderUrl = 'http://localhost:8080/api/orders/addOrder';
        fetch(orderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: $("#projectTitle").val(),
                intro: $('#simpleInfo').val(),
                deadline: $('#deadline').val(),
                detail: htmlContent,
                picurl: $('img').prop("src"),
                location: rigion,
                people: $('#people').val(),
                tagIds: selectedSkills,
                budget: $("input[name='budget']:checked").val(),
                upload: new Date().toISOString().split('T')[0],
                newdate: new Date().toISOString().split('T')[0],
                category: $("#category").val(),

            })
        }).then(response => response.json()
        ).then(data => {
            console.log(data)
            if (data && data.orderId) {
                const orderId = data.orderId;
                const setMemberOrderUrl = `http://localhost:8080/api/memberOrders/addOwnedOrder`;
                const memberId = document.getElementById('memberId').content;
                fetch(setMemberOrderUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        memberId: memberId,
                        orderId: orderId,
                        owned: 1,
                        wanted: 0,
                        collected: 0
                    })
                });
                // 進行重定向
                const redirectUrl = `http://127.0.0.1:5500/大專/order_main/order_main.html?orderid=${encodeURIComponent(orderId)}`;
                window.location.href = redirectUrl;
            } else {
                console.error('未獲取到 orderId');
                alert("無法獲取訂單ID，請再試一次。");
            }

        }).catch(error => {
            console.error("發生錯誤：", error);
            alert("發生錯誤，請稍後再試。"); // 顯示錯誤提示
        });


    }


    // 顯示縮圖用
    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        console.log(imageInput.files[0]);

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        }
    });


});






