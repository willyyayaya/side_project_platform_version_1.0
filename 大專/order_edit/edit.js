$(document).ready(function () {
    //文字編輯器    
    tinymce.init({
        selector: 'textarea',
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


    //地點選單(抓資料庫內容)
    $("#region").append('<option>1</option>');
    $("#region").append('<option>2</option>');
    $("#region").append('<option>3</option>');
    //需求技能(抓資料庫內容)
    $("#skill").append('<input type="checkbox" name="needSkill" value="1">');
    $("input[value='1']").after('<span>' + $('input[value="1"]').val() + '</span>');
    $("#skill").append('<input type="checkbox" name="needSkill" value="2">');
    $("input[value='2']").after('<span>' + $('input[value="2"]').val() + '</span>');
    $("#skill").append('<input type="checkbox" name="needSkill" value="3">');
    $("input[value='3']").after('<span>' + $('input[value="3"]').val() + '</span>');

    
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
        console.log($("#category").val());
        console.log($("#projectTitle").val());
        console.log($("input[name='budget']:checked").val());

        if ($('input[name="workplace"]:checked').val() == "region") {
            console.log($('#region').val());
        } else if ($('input[name="workplace"]:checked').val() == "remote") {
            console.log($('input[value="remote"]').val());
        }

        var selectedSkills = [];
        $("input[name='needSkill']:checked").each(function () {
            selectedSkills.push($(this).val());
        });
        console.log(selectedSkills);

        console.log($("input[name='team']:checked").val());
        console.log($('#deadline').val());

        console.log($('img').prop("src"));


        var activeEditorContent = tinymce.activeEditor;
        if (activeEditorContent) {
            console.log(activeEditorContent.getContent());  // 輸出編輯器內容
        } else {
            console.error('沒有找到當前活動的 TinyMCE 編輯器');
        }



    }

    // 顯示縮圖用
    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
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






