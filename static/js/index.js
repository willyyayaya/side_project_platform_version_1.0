 // 隨機關鍵字
 function getRandomKeyword() {
    fetch('/randomKeyword')
        .then(response => response.text())
        .then(keyword => {
            randomKeyword = keyword;
            var searchInput = $("#keyword");
            searchInput.val(keyword);
            searchInput.addClass("randomKeyword")
        })
        .catch(error => console.error('抓取關鍵字錯誤:', error));
}

function clearPlaceholder() {
    var searchInput = $("#keyword");
    if (searchInput.val() === randomKeyword) {
        searchInput.val("");
        searchInput.removeClass("randomKeyword");
    }
}

$(document).ready(function () {
    console.log("I'm ready !!!");

    var randomKeyword = "";

    getRandomKeyword();

    //鍵盤監聽事件
    $(document).on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $("#searchButton").click();
        }
    })

    $("#keyword").on('focus', function () {
        clearPlaceholder();
    });

    //當搜尋鈕被點擊時處理請求及更新URL
    $("#searchButton").on('click', function () {
        console.log("首頁觸發搜尋");
        var keyword = $("#keyword").val();
        var option = [];

        //搜集被選到的checkBox
        $("input[name='options']:checked").each(function () {
            option.push($(this).val());
        });
        // console.log(option.length);

        if (keyword != "" || option.length != 0) {
            var params = new URLSearchParams();
            params.append("keyword", keyword);
            option.forEach(option =>
                params.append("options", option));

            //存為URL
            window.location.href = "/search?" + params.toString();
            console.log("使用者輸入為: " + keyword + ",checkbox: " + option);
        }

        //交給後端存入關鍵字
        if (keyword != "") {
            $.post("/saveKeyword", { userKeyword: keyword }, function (response) {
                console.log("關鍵字已儲存");
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("請求失敗: " + textStatus + ", " + errorThrown);
            });
        }
    });
    //針對新增在頁面上的關鍵字加入點擊功能
    $(".keywordBtn").on('click', function () {
        console.log($(this).text());
        $("#keyword").val($(this).text().trim());
        $("#searchButton").click();
    })
});