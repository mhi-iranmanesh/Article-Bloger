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



});