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

// 拿URL的值
function getQueryParams() {
    var urlParams = new URLSearchParams(window.location.search);
    let params = {};
    urlParams.forEach((value, key) => {
        if (!params[key]) {
            params[key] = [];
        }
        params[key].push(decodeURIComponent(value));
    });
    return params;
}
// 解URL的值
function applyQueryParams(params) {
    if (params.keyword) {
        $("#keyword").val(params.keyword[0]);
    }
    if (params.options) {
        params.options.forEach(option => {
            let checkbox = $(`input[name="options"][value="${option}"]`);
            if (checkbox.length) {
                checkbox.prop("checked", true);
            }
        });
    }
}

$(document).ready(function () {
    console.log("I'm ready !!!");

    var randomKeyword = "";

    let params = getQueryParams();
    applyQueryParams(params);

    var keyword = $("#keyword").val();
    var options = $("input[name='options']:checked");


    if (keyword === "" && options.length === 0) {
        keyword = "";
        getRandomKeyword();
    }

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
        console.log("搜尋頁觸發搜尋");
        var keyword = $("#keyword").val();
        var option = [];

        //搜集被選到的checkBox
        $("input[name='options']:checked").each(function () {
            option.push($(this).val());
        });

        if (keyword != "" || option.length != 0) {
            var params = new URLSearchParams();
            params.append("keyword", keyword);
            option.forEach(option =>
                params.append("options", option));

            //存為URL
            window.history.replaceState(null, null, "/search?" + params.toString())
            console.log("使用者輸入為: " + keyword + ",checkbox: " + option);
            // 在這裡處理你的搜尋邏輯，例如發送 AJAX 請求 
            // 例如： 
            // $.get("/search", { keyword: keyword, options: option }, function(data) {})
            // 更新頁面內容
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