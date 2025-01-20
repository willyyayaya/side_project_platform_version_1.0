$(document).ready(async function () {
    var urlParams = new URLSearchParams(window.location.search);
    var orderId = urlParams.get('orderId'); // 取得 orderId 參數

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
                // [{ 'font': [] }], // 字體
                [{ 'align': [] }], // 文字方向
                ['clean'] // 清除文字格是
            ]
        },
        placeholder: '請在此輸入內容...'
    });
    const editor = quill.root;
    editor.style.fontSize = '24px';
    //地區
    $("#region").append('<option value="taipei">台北市</option>');
    $("#region").append('<option value="newTaipei">新北市</option>');
    $("#region").append('<option value="taoyuan">桃園市</option>');
    $("#region").append('<option value="taichung">台中市</option>');
    $("#region").append('<option value="tainan">台南市</option>');
    $("#region").append('<option value="kaohsiung">高雄市</option>');
    $("#region").append('<option value="keelung">基隆市</option>');
    $("#region").append('<option value="hsinchuCity">新竹市</option>');
    $("#region").append('<option value="chiayiCity">嘉義市</option>');
    $("#region").append('<option value="yilan">宜蘭縣</option>');
    $("#region").append('<option value="hsinchuCounty">新竹縣</option>');
    $("#region").append('<option value="miaoli">苗栗縣</option>');
    $("#region").append('<option value="changhua">彰化縣</option>');
    $("#region").append('<option value="nantou">南投縣</option>');
    $("#region").append('<option value="yunlin">雲林縣</option>');
    $("#region").append('<option value="chiayiCounty">嘉義縣</option>');
    $("#region").append('<option value="pingtung">屏東縣</option>');
    $("#region").append('<option value="hualien">花蓮縣</option>');
    $("#region").append('<option value="taitung">台東縣</option>');
    $("#region").append('<option value="penghu">澎湖縣</option>');
    $("#region").append('<option value="kinmen">金門縣</option>');
    $("#region").append('<option value="lienchiang">連江縣</option>');

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
    let orderUrl = `http://localhost:8080/api/orders/getOrderById/${orderId}`;
    let responseOrder = await fetch(orderUrl);
    let responseOrderToJSON = await responseOrder.json();
    console.log(responseOrderToJSON);

    $('#projectTitle').val(responseOrderToJSON.name)
    $('#simpleInfo').val(responseOrderToJSON.intro)
    quill.root.innerHTML = responseOrderToJSON.detail;

console.log(responseOrderToJSON.category);

    switch (responseOrderToJSON.category) {
        case 'web':
            $('option[value="web"]').prop('selected', true);
            break;
        case 'game':
            $('option[value="game"]').prop('selected', true);
            break;
        case 'app':
            $('option[value="app"]').prop('selected', true);
            break;
    }

    if (responseOrderToJSON.budget == '另議') {
        $('input[value="另議"]').prop('checked', true);
    } else {
        $('input[value="自訂"]').prop('checked', true);
        $('#casutamu').val(responseOrderToJSON.budget);
    }
    if (responseOrderToJSON.location == 'remote') {
        $('input[value="remote"]').prop('checked', true);
    } else {
        $('input[value="region"]').prop('checked', true);
        // $(`option[value="${responseOrderToJSON.location}"]`).prop('selected', true);
        $("#region option").each(function () {
            if ($(this).val() === responseOrderToJSON.location) {
                $(this).prop('selected', true);
            }
        });
    }

    $('#people').val(responseOrderToJSON.people);
    $('#deadline').val(responseOrderToJSON.deadline);
    console.log(responseOrderToJSON.picurl);
    var imgUrl = responseOrderToJSON.picurl;
    $("#preview").attr("src", imgUrl);


    //預設技能:
    let defultUrl = `http://localhost:8080/api/tags/getTag/${orderId}`;
    let responseDefult = await fetch(defultUrl);
    let responseDefultToJSON = await responseDefult.json();

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
    } else if ($('input[value="remote"]').prop('checked')) {
        $("select[name='region']").css("display", "none");
    }

    $('input[name="workplace"]').change(function () {
        if ($('input[value="region"]').prop('checked')) {
            $('select[name="region"]').css("display", "inline-block");
        } else if ($('input[value="remote"]').prop('checked')) {
            $("select[name='region']").css("display", "none");
        }
    })

    insert.onclick = function () {
        let empty = '請填寫';
        if ($("#projectTitle").val() === "") {
            empty += ' 專案標題';
        }
        if ($('#simpleInfo').val() === "") {
            empty += ' 簡介';
        }
        if ($("#category").val() === "") {
            empty += ' 類型';
        }
        if ($('input[name="budget"]:checked').length === 0) {
            empty += ' 預算';
        } else {
            if ($('input[name="budget"]:checked').val() === "自訂" && $('#casutamu').val() === "") {
                empty += ' 預算金額';
            }
        }
        if ($('input[name="workplace"]:checked').length === 0) {
            empty += ' 工作地點';
        } else {
            if ($('input[name="workplace"]:checked').val() === "region" && $('#region').val() === "") {
                empty += ' 工作地區';
            }
        }
        if ($("input[name='needSkill']:checked").length === 0) {
            empty += ' 至少一項技能';
        }
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
        } else if ($('input[name="workplace"]:checked').val() == "remote") {
            console.log($('input[value="remote"]').val());
            var rigion = $('input[value="remote"]').val();
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
        let orderUrl = `http://localhost:8080/api/orders/updateOrder/${orderId}`;
        fetch(orderUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: $("#projectTitle").val(),
                intro: $('#simpleInfo').val(),
                category: $("#category").val(),
                budget: money,
                location: rigion,
                tagIds: selectedSkills,
                people: $('#people').val(),
                deadline: $('#deadline').val(),
                detail: htmlContent,
                picurl: $('img').prop("src"),
                // upload: new Date().toISOString().split('T')[0],
                newdate: new Date().toISOString().split('T')[0],
            })
        }).then(response => response.json()
        ).then(data => {
            const redirectUrl = `http://127.0.0.1:5500/大專/order_main/order_main.html?orderId=${orderId}`;
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
            };
            reader.readAsDataURL(file);
        }
    });
});






