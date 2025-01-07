$(document).ready(async function () {
    //文字編輯器    
    tinymce.init({
        selector: 'textarea:not(#simpleInfo)',
        plugins: [
            // Core editing features
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until Jan 12, 2025:
            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | align lineheight | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
        ],
        //圖片上傳
        images_upload_url: '/upload',
        automatic_uploads: true,
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),

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
        console.log($('#simpleInfo').val());
        console.log($("#category").val());
        console.log($("#projectTitle").val());
        console.log($("input[name='budget']:checked").val());

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


        var activeEditorContent = tinymce.activeEditor;
        if (activeEditorContent) {
            console.log(activeEditorContent.getContent());  // 輸出編輯器內容
        } else {
            console.error('沒有找到當前活動的 TinyMCE 編輯器');
        }



       

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
                detail: activeEditorContent.getContent(),
                picurl: $('img').prop("src"),
                location: rigion,
                people: $('#people').val(),
                tagIds: selectedSkills,
            })
        }).then(response => {
            if (response.ok) { // 檢查是否成功
                alert("已成功提交評分!"); // 顯示成功提示
            } else {
                alert("資料送出失敗，請再試一次。"); // 顯示失敗提示
            }
        })
            .catch(error => {
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






