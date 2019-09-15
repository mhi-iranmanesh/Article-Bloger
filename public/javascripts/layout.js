$(document).ready(function () {

    


    /*.................................................................................................................
    ................................................GET INFO..................................................................
    ..................................................................................................................*/


    $.ajax({
        type: "GET",
        url: "/api/general/getInfo",
        success: function (response) {

            console.log(response);

            $("#ShowInfo").css('display', 'none');
            $("#formLogin").removeClass();
            $("#formLogin").css('display', 'none');

            if (response.success) {

                $("#ShowInfo").css('display', 'flex');

                document.getElementById("lblName").innerHTML =
                    response.user.firstName + " " + response.user.lastName;
                document.getElementById("fullName").innerHTML =
                    response.user.firstName + " " + response.user.lastName;

            } else {

                $("#formLogin").css('display', 'block')

            }
        }
    });

    /*.................................................................................................................
    ................................................SHOW PANEL LOGIN.....................................................
    ..................................................................................................................*/



    window.addEventListener('click', function (e) {
        if (document.getElementById('clickPnl').contains(e.target)) {

            $(".panelLogin").css('display', 'block');

        } else {

            $(".panelLogin").css('display', 'none');

        }

    });

    /*.................................................................................................................
      ................................................VALIDATION FORM REGISTER.....................................................
      ..................................................................................................................*/
    (function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    })();


    $("#clickTest").click(function (e) {
        showMsgBox('danger', "sldkjflskjflkj")
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

        let iconClose = document.createElement('i');
        $(iconClose).addClass('far fa-times-circle');

        btnClose.appendChild(iconClose);

        divMain.appendChild(btnClose);

        let textMessage = document.createTextNode(textMsg);

        divMain.appendChild(textMessage);

        document.body.appendChild(divMain)
    }

});