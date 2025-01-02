$(document).ready(function () {
    var ratingValue = 0;

    // 當滑鼠移動到星星時
    $('.fa-star').hover(function () {
        var index = $(this).data('index');
        // 更新顯示的評分數字
        $('#rating-value').text(index);

        // 根據當前星星的索引，改變星星的顏色
        $('.fa-star').each(function (i) {
            if (i < index) {
                $(this).addClass('checked');
            } else {
                $(this).removeClass('checked');
            }
        });
    });

    // 當用戶點擊星星時
    $('.fa-star').click(function () {
        ratingValue = $(this).data('index');
        $('#rating-value').text(ratingValue);

        // 更新選中的星星顏色
        $('.fa-star').each(function (i) {
            if (i < ratingValue) {
                $(this).addClass('checked');
            } else {
                $(this).removeClass('checked');
            }
        });
    });

    // 當滑鼠離開星星時，恢復顯示當前選中的評分
    $('.fa-star').mouseleave(function () {
        $('#rating-value').text(ratingValue); // 顯示當前的選中評分
        $('.fa-star').each(function (i) {
            if (i < ratingValue) {
                $(this).addClass('checked');
            } else {
                $(this).removeClass('checked');
            }
        });
    });

    // 當模態框顯示時，重置評分
    $('#MyModal').on('show.bs.modal', function () {
        ratingValue = 0;
        $('#rating-value').text(ratingValue);
        $('.fa-star').removeClass('checked');
        $("#message-text").val("");
    });
    //送出
    evaluateGo.onclick = function () {
        var rating = $('#rating-value').text();
        var reviewText = $('#message-text').val();

        if (rating == 0) {
            alert("請填下分數和評價");
        } else {
            console.log("評分: " + rating + ", 評價: " + reviewText);
        }

    };
});