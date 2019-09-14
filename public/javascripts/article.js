
$(document).ready(function () {
    //Get Information Admin----------------------------------------------------------------------------------------------------------------------------------------------

    $.ajax({
        type: "GET",
        url: "/api/general/articleMostViewed",
        success: function (response) {
            console.log(response);

            for (let i = 0; i < response.article.length; i++) {
                let mainArticle = document.createElement('div');
                let img = document.createElement('img');
                $(img).attr('src', `/images/avatarArticle/${response.article[i].picPath}`);
                $(img).addClass('col-12');
                $(img).addClass('p-0');

                mainArticle.appendChild(img);

                let titleBox = document.createElement('div');
                $(titleBox).addClass('col-11');

                let title = document.createElement('a');
                $(title).attr("href", `/api/general/article/${response.article[i]._id}`);
                $(title).addClass("titrMostVisit");
                titleBox.appendChild(title)

                let textTitle = document.createTextNode(response.article[i].title);

                title.appendChild(textTitle);

                mainArticle.appendChild(titleBox);
                $(mainArticle).addClass("mainArticle");

                document.getElementById("listMostVisit").appendChild(mainArticle)

            }
        }
    });


    // let userName = document.getElementById("userNameWriter").innerHTML;

    // $.ajax({
    //     type: "get",
    //     data: { userName },
    //     url: "../articlesWriter",
    //     success: function (response) {
    //         console.log(response);
    //     }
    // });


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

                        showMsgBox("success", "دیدگاه با موفقیت حذف شد.")
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

    $("#textComment").keydown(function (e) { 
        
        if (document.getElementById("textComment").value == "") {
            document.getElementById("btnSendComment").disabled = true;
        } else {
            document.getElementById("btnSendComment").disabled = false;
        }
    });    

    /*.................................................................................................................
................................................MSG HANDEL.....................................................
..................................................................................................................*/

    function showMsgBox(typeMsg, textMsg) {

        let divMain = document.createElement('div');
        $(divMain).addClass("alert");
        $(divMain).addClass("fade");
        $(divMain).addClass("show");
        $(divMain).addClass("showMsg");
        $(divMain).addClass("msgBox");

        if (typeMsg == "success") {

            $(divMain).addClass("msgSuccess");

        } else if (typeMsg == "warning") {

            $(divMain).addClass("msgWarning");

        } else if (typeMsg == "danger") {

            $(divMain).addClass("msgDanger");

        }

        let btnClose = document.createElement('button');
        $(btnClose).attr("type", "button");
        $(btnClose).attr("class", "close");
        $(btnClose).attr("data-dismiss", "alert");
        $(btnClose).attr("aria-label", "Close");
        $(btnClose).css("padding", "0px 10px");

        let iconClose = document.createElement('i');
        $(iconClose).addClass('far fa-times-circle');

        btnClose.appendChild(iconClose);

        divMain.appendChild(btnClose);

        let tagTextBox = document.createElement('div')
        let textMessage = document.createTextNode(textMsg);

        tagTextBox.appendChild(textMessage)
        $(tagTextBox).attr("dir", "rtl");

        divMain.appendChild(tagTextBox);

        document.body.appendChild(divMain)
    }


});