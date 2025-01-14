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
                ['image'], // add's image support
                // ['link'],
                // [{ 'font': [] }], // 字體
                [{ 'align': [] }], // 文字方向
                ['clean'] // 清除文字格是
            ]
        },
        placeholder: '請在此輸入內容...'
    });
    //地區
    $("#region").append('<option value="台北市">台北市</option>');
    $("#region").append('<option value="新北市">新北市</option>');
    $("#region").append('<option value="桃園市">桃園市</option>');
    $("#region").append('<option value="台中市">台中市</option>');
    $("#region").append('<option value="台南市">台南市</option>');
    $("#region").append('<option value="高雄市">高雄市</option>');
    $("#region").append('<option value="基隆市">基隆市</option>');
    $("#region").append('<option value="新竹市">新竹市</option>');
    $("#region").append('<option value="嘉義市">嘉義市</option>');
    $("#region").append('<option value="宜蘭縣">宜蘭縣</option>');
    $("#region").append('<option value="新竹縣">新竹縣</option>');
    $("#region").append('<option value="苗栗縣">苗栗縣</option>');
    $("#region").append('<option value="彰化縣">彰化縣</option>');
    $("#region").append('<option value="南投縣">南投縣</option>');
    $("#region").append('<option value="雲林縣">雲林縣</option>');
    $("#region").append('<option value="嘉義縣">嘉義縣</option>');
    $("#region").append('<option value="屏東縣">屏東縣</option>');
    $("#region").append('<option value="花蓮縣">花蓮縣</option>');
    $("#region").append('<option value="台東縣">台東縣</option>');
    $("#region").append('<option value="澎湖縣">澎湖縣</option>');
    $("#region").append('<option value="金門縣">金門縣</option>');
    $("#region").append('<option value="連江縣">連江縣</option>');

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

    //抓預設
    let orderUrl = `http://localhost:8080/api/orders/getOrderById/214`;
    let responseOrder = await fetch(orderUrl);
    let responseOrderToJSON = await responseOrder.json();
    console.log(responseOrderToJSON);

    $('#projectTitle').val(responseOrderToJSON.name)
    $('#simpleInfo').val(responseOrderToJSON.intro)
    quill.root.innerHTML = responseOrderToJSON.detail;
    switch (responseOrderToJSON.category) {
        case '遊戲':
            $('option[value="遊戲"]').prop('selected', true);
            break;
        case '網頁':
            $('option[value="網頁"]').prop('selected', true);
            break;
        case 'APP':
            $('option[value="APP"]').prop('selected', true);
            break;
    }

    if (responseOrderToJSON.budget == '另議') {
        $('input[value="另議"]').prop('checked', true);
    } else {
        $('input[value="自訂"]').prop('checked', true);
        $('#casutamu').val(responseOrderToJSON.budget);
    }
    if (responseOrderToJSON.location == '遠端工作') {
        $('input[value="遠端工作"]').prop('checked', true);
    } else {
        $('input[value="region"]').prop('checked', true);
        $(`option[value="${responseOrderToJSON.location}"]`).prop('selected', true);
    }

    $('#people').val(responseOrderToJSON.people);
    $('#deadline').val(responseOrderToJSON.deadline);

    //預設技能:
    let defultUrl = `http://localhost:8080/api/tags/getTag/214`;
    let responseDefult = await fetch(defultUrl);
    let responseDefultToJSON = await responseDefult.json();
    // console.log(responseDefultToJSON);
    // for(var i = 0 ; i < responseDefultToJSON.length ; i++ ){
    //     $('input').val(responseDefultToJSON).prop('checked',true);
    // }
    $("input[name='needSkill']").each(function (index) {
        if (responseDefultToJSON.includes($(this).next('span').text().trim())) {  // 比較 span 的文字
            $(this).prop('checked', true);  // 設置該 checkbox 為選中
        }
    });




    $("input[id='casutamu']").css("display", "none");
    if ($('input[value="自訂"]').prop('checked')) {
        $('input[id="casutamu"]').css("display", "inline-block");
    } else if ($('input[value="另議"]').prop('checked')) {
        $("input[id='casutamu']").css("display", "none");
    }

    $('input[name="budget"]').change(function () {
        if ($('input[value="自訂"]').prop('checked')) {
            $('input[id="casutamu"]').css("display", "inline-block");
        } else if ($('input[value="另議"]').prop('checked')) {
            $("input[id='casutamu']").css("display", "none");
        }
    })

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
        // 檢查必填欄位並提示
        let empty = '請填寫';

        // 檢查專案標題是否填寫
        if ($("#projectTitle").val() === "") {
            empty += ' 專案標題';
        }
        // 檢查簡單介紹是否填寫
        if ($('#simpleInfo').val() === "") {
            empty += ' 簡介';
        }
        // 檢查類別是否選擇
        if ($("#category").val() === "") {
            empty += ' 類型';
        }
        // 檢查預算是否選擇
        if ($('input[name="budget"]:checked').length === 0) {
            empty += ' 預算';
        } else {
            // 如果預算選擇了 "自訂"，則檢查金額是否填寫
            if ($('input[name="budget"]:checked').val() === "自訂" && $('#casutamu').val() === "") {
                empty += ' 預算金額';
            }
        }
        // 檢查工作地點是否選擇
        if ($('input[name="workplace"]:checked').length === 0) {
            empty += ' 工作地點';
        } else {
            // 如果選擇了 "region"，檢查地區是否填寫
            if ($('input[name="workplace"]:checked').val() === "region" && $('#region').val() === "") {
                empty += ' 工作地區';
            }
        }
        // 檢查是否選擇了技能
        if ($("input[name='needSkill']:checked").length === 0) {
            empty += ' 至少一項技能';
        }
        // 檢查人數和截止日期是否填寫
        if ($('#people').val() === "") {
            empty += ' 人數';
        }
        if ($('#deadline').val() === "") {
            empty += ' 截止日期';
        }
        // // 檢查圖片是否有上傳
        // if ($('img').prop("src") === "") {
        //     empty += '，請上傳圖片';
        // }
        // 如果有任何欄位未填寫，則不繼續執行表單提交
        if (empty != '請填寫') {
            alert(empty);
            if (empty.includes(' 專案標題')) {
                $('#projectTitle').focus();
            } else if (empty.includes(' 簡介')) {
                $('#simpleInfo').focus();
            } else if (empty.includes(' 類型')) {
                $('#category').focus();
            } else if (empty.includes(' 預算')) {
                $('input[name="budget"]:checked').focus();
            } else if (empty.includes(' 預算金額')) {
                $('#casutamu').focus();
            } else if (empty.includes(' 工作地點')) {
                $('input[name="workplace"]:checked').focus();
            } else if (empty.includes(' 工作地區')) {
                $('#region').focus();
            } else if (empty.includes(' 至少一項技能')) {
                $("input[name='needSkill']:checked").focus();
            } else if (empty.includes(' 人數')) {
                $('#people').focus();
            } else if (empty.includes(' 截止日期')) {
                $('#deadline').focus();
            }
            // else if (empty.includes(' 圖片')) {
            //     $('img').focus();
            // }
            return; // 阻止提交表單
        }

        console.log($('#simpleInfo').val());
        console.log($("#category").val());
        console.log($("#projectTitle").val());
        console.log($("input[name='budget']:checked").val());
        if ($('input[name="budget"]:checked').val() == "自訂") {
            console.log($('#casutamu').val());
            var money = $('#casutamu').val();
        } else if ($('input[name="budget"]:checked').val() == "另議") {
            console.log($('input[value="另議"]').val());
            var money = $('input[value="另議"]').val();

        }
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

        //更新專案表單
        let orderUrl = 'http://localhost:8080/api/orders/updateOrder/214';
        fetch(orderUrl, {
            method: 'PUT',
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
                budget: money,
                // upload: new Date().toISOString().split('T')[0],
                newdate: new Date().toISOString().split('T')[0],
                category: $("#category").val(),
            })
        }).then(response => response.json()
        ).then(data => {

            const redirectUrl = `http://127.0.0.1:5500/大專/order_main/order_main.html?orderid=214`;
            window.location.href = redirectUrl;

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






