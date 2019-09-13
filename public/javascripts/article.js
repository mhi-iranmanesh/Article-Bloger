$(document).ready(function () {
    //Get Information Admin----------------------------------------------------------------------------------------------------------------------------------------------


    $('#btn_deleteArticle').click(function (e) {
        let data = { _id: window.location.pathname.slice(21, window.location.pathname.length) }

        $(".cnlTasktContainer").css("right", "20px");
        $(".cnlTasktContainer").css("bottom", "25px");
        $(".cnlTasktContainer").fadeIn();

        let timer = 0;
        timer = setInterval(() => {
            let ti = $(".cnlTaskTimeScrol").width();
            ti += 1;
            if ($(".cnlTasktContainer").width() <= ti) {

                clearInterval(timer);
                $(".cnlTasktContainer").fadeOut();
                $(".cnlTaskTimeScrol").width(`0px`);


                $.ajax({
                    type: "DELETE",
                    data,
                    url: "/api/general/articleDelete",
                    success: function (response) {
                        window.location.replace('/api/allArticle/1')
                    }
                });

            } else {

                $(".cnlTaskTimeScrol").width(`${ti}px`);

            }
        }, 50);

        $("#closeTask").click(function (e) {
            clearInterval(timer);
            $(".cnlTasktContainer").fadeOut();
            $(".cnlTaskTimeScrol").width(`0px`);
        });
    });

    $('#btn_deleteArticleByAdmin').click(function (e) {
        let data = { _id: window.location.pathname.slice(21, window.location.pathname.length) }
        $(".cnlTasktContainer").css("right", "20px");
        $(".cnlTasktContainer").css("bottom", "25px");
        $(".cnlTasktContainer").fadeIn();

        let timer = 0;
        timer = setInterval(() => {
            let ti = $(".cnlTaskTimeScrol").width();
            ti += 1;
            if ($(".cnlTasktContainer").width() <= ti) {
                clearInterval(timer);
                $(".cnlTasktContainer").fadeOut();
                $(".cnlTaskTimeScrol").width(`0px`);

                $.ajax({
                    type: "DELETE",
                    data,
                    url: "/api/admin/deleteArticleUser",
                    success: function (response) {
                        window.location.replace('/api/allArticle/1')
                    }
                });

            } else {

                $(".cnlTaskTimeScrol").width(`${ti}px`);

            }
        }, 50);

        $("#closeTask").click(function (e) {
            clearInterval(timer);
            $(".cnlTasktContainer").fadeOut();
            $(".cnlTaskTimeScrol").width(`0px`);
        });



    });



    $('#btn_editArticle').click(function (e) {

        $("#formUpdate").css('display', 'block');
        $("#articleShow").css('display', 'none');

        $("#title").val(document.getElementById("articleTitle").innerHTML)
        $("#textArticle").val(document.getElementById("textSummary").innerHTML)

    });


    $("#boxPost .btnDeletePost").click(function (e) {

        $(".cnlTasktContainer").css("right", "20px");
        $(".cnlTasktContainer").css("bottom", "25px");
        $(".cnlTasktContainer").fadeIn();

        let timer = 0;
        timer = setInterval(() => {
            let ti = $(".cnlTaskTimeScrol").width();
            ti += 1;
            if ($(".cnlTasktContainer").width() <= ti) {

                clearInterval(timer);
                $(".cnlTasktContainer").fadeOut();
                $(".cnlTaskTimeScrol").width(`0px`);


                let url = "/api/admin/deleteComment" + e.target.parentNode.id;
                $.ajax({
                    type: "GET",
                    url,
                    success: function (response) {

                        // $("#countComment").val((Number($("#countComment").val())) - 1 );
                        $(`#${e.target.parentNode.id}`).parent().parent().removeClass("d-flex");
                        $(`#${e.target.parentNode.id}`).parent().parent().removeClass("row");
                        $(`#${e.target.parentNode.id}`).parent().parent().removeClass("justify-content-end");
                        $(`#${e.target.parentNode.id}`).parent().parent().css("display", "none", "important");
                    }
                });



            } else {

                $(".cnlTaskTimeScrol").width(`${ti}px`);

            }
        }, 50);

        $("#closeTask").click(function (e) {
            clearInterval(timer);
            $(".cnlTasktContainer").fadeOut();
            $(".cnlTaskTimeScrol").width(`0px`);
        });



    });



});