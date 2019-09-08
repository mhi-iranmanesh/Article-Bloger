$(document).ready(function () {
    //Get Information Admin----------------------------------------------------------------------------------------------------------------------------------------------


    $('#btn_deleteArticle').click(function (e) {
        e.preventDefault();
        let data = { _id: window.location.pathname.slice(21, window.location.pathname.length) }
        $.ajax({
            type: "DELETE",
            data,
            url: "/api/general/articleDelete",
            success: function (response) {

                // if (response.success) {
                    window.location.replace('/api/allArticle/1')
                // }
                console.log(response)

                // if (response.user.userName == document.getElementById('userNameWriter').innerHTML) {
                //     $("#btn_deleteArticle").css('display', 'block');
                // }

            }
        });
    });

    $('#btn_deleteArticleByAdmin').click(function (e) {
        e.preventDefault();
        let data = { _id: window.location.pathname.slice(21, window.location.pathname.length) }

        $.ajax({
            type: "DELETE",
            data,
            url: "/api/admin/deleteArticleUser",
            success: function (response) {

                // if (response.success) {
                    window.location.replace('/api/allArticle/1')
                // }

                // if (response.user.userName == document.getElementById('userNameWriter').innerHTML) {
                //     $("#btn_deleteArticle").css('display', 'block');
                // }

            }
        });
    });



    $('#btn_editArticle').click(function (e) {

        $("#formUpdate").css('display', 'block');
        $("#articleShow").css('display', 'none');

        $("#title").val(document.getElementById("articleTitle").innerHTML)
        $("#textArticle").val(document.getElementById("textSummary").innerHTML)

    });


});