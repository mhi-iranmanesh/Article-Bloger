let idUsers;
$(document).ready(function () {

    $('#chooseImg').change(() => {
        $('#sendFile').click();
    })

    //Get Information Admin----------------------------------------------------------------------------------------------------------------------------------------------
    $.ajax({
        type: "GET",
        url: "/api/general/getInfo",
        success: function (response) {

            document.getElementById('fullName').innerHTML = `${response.user.firstName}  ${response.user.lastName}`;
            document.getElementById("phone").innerHTML = `${response.user.phone}`;
            document.getElementById("creatAt").innerHTML = `${response.user.dateCreate}`.slice(0, 10);
            document.getElementById("LUpdate").innerHTML = `${response.user.lastUpdate}`.slice(0, 10);
            //uploadImg -----------------------------------------------------------------------------------------------------------

            let pathImg = `/images/avatar/${response.user._id}.jpg`
            $('#avatarImg').attr('src', pathImg);

            $('.containerImg').click((e) => {
                $('#chooseImg').click();
            });

        }
    });

    //Show Form ----------------------------------------------------------------------------------------------------------------------------------------------
    $('#showFormUpdate').click(function (e) {
        $.ajax({
            type: "GET",
            url: "./admin/getInfo",
            success: function (response) {
                handleFormUpdate(response.admin.firstName, response.admin.lastName, response.admin.phone, true)
            }
        });
    });

    //Update Admin----------------------------------------------------------------------------------------------------------------------------------------------

    $('#update').click(function (e) {

        let data = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            phone: $('#phoneUpdate').val(),
            gender: ($('#gender').prop('checked')) ? "male" : "woman"
        }
        console.log(data)
        $.ajax({
            type: "Post",
            url: "/api/general/profileEdit",
            data,
            success: function (response) {
                updateTable()
            }
        });


        $('#update').attr('data-dismiss', 'modal');
    });

    /*----------------------------------------------------------------------------------------------------------------
    ---------------------------=>article <=-----------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------------------------*/

    $('#articleInsertForm').click(function (e) {

        $('#homeProfile').css('display', 'none');
        $('#addArticle').css('display', 'block');

        $('#picPath').val(guidGenerator());

    });


    // $('#articleAdd').click(async function (e) {
        

    //     let data = await {
    //         title: $('#title').val(),
    //         text: $('#textArticle').val(),
    //         picPath: guidGenerator()
    //     }

    //     console.log(data)

    //     $.ajax({
    //         type: "Post",
    //         url: "/api/general/articleAdd",
    //         data,
    //         dataType: "dataType",
    //         success: function (response) {

    //         }
    //     });

    // });


    /*----------------------------------------------------------------------------------------------------------------
    ---------------------------=>Users<=-----------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------------------------*/

    $('.headAdmin').click(function (e) {
        $('.mainAdmin').css('display', 'block');
        $('.mainUsers').css('display', 'none');

    });


    $('.headUsers').click(function (e) {
        $('.mainUsers').css('display', 'block');
        $('.mainAdmin').css('display', 'none');

        //Get All Users----------------------------------------------------------------------------------------------------------------------------------------------

        updateTable();



    });


    //recovery pass----------------------------------------------------------------------------------------------------------------------------------------------

    $('#rcoveryPass').click(function (e) {
        $.ajax({
            type: "put",
            data: { idUsers },
            url: "./admin/recoveryPass",
            success: function (response) {
                console.log(response);
            }
        });
        $('#rcoveryPass').attr('data-dismiss', 'modal');

    });

    //delete user----------------------------------------------------------------------------------------------------------------------------------------------

    $('#deleteUser').click(function (e) {
        $.ajax({
            type: 'delete',
            data: { phone: idUsers },
            url: './admin/delUser',
            success: (response) => {
                updateTable();
            }
        })
        $('#deleteUser').attr('data-dismiss', 'modal');

    });

    //insert user----------------------------------------------------------------------------------------------------------------------------------------------

    $('#insertUserForm').click((e) => {
        $('#password').css('display', 'none');
        $('#confirmPassword').css('display', 'none');
        $('#deleteUser').css('display', 'none');
        $('#rcoveryPass').css('display', 'none');
        $('#insertUser').css('display', 'block');
        $('#update').css('display', 'none')

    });


    $('#insertUser').click(function (e) {
        let data = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            phone: $('#phoneUpdate').val(),
        }

        $.ajax({
            type: "put",
            url: "./admin/addUser",
            data,
            success: function (response) {
                updateTable();

            }
        });
        $('#insertUser').attr('data-dismiss', 'modal');
    });


    //----------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------=> FUNCTION <=----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------------------------

    function handleFormUpdate(fName, lName, phone, pass, pass2) {

        if (pass) {
            $('#password').css('display', 'block');
            $('#confirmPassword').css('display', 'block');
            $('#deleteUser').css('display', 'none');
            $('#rcoveryPass').css('display', 'none');
            $('#insertUser').css('display', 'none');


            idUsers = phone;

            $('#firstName').val(fName)
            $('#lastName').val(lName)
            $('#phoneUpdate').val(phone)

        } else {

            $('#password').css('display', 'none');
            $('#confirmPassword').css('display', 'none');
            $('#deleteUser').css('display', 'block');
            $('#rcoveryPass').css('display', 'block');
            $('#insertUser').css('display', 'none');

            idUsers = phone;

            $('#firstName').val(fName)
            $('#lastName').val(lName)
            $('#phoneUpdate').val(phone)
        }
    };

    function updateTable() {

        $.ajax({

            type: "GET",
            url: "./api/getAllUser",
            success: function (response) {

                $("#tblUsers td").remove();
                $("#tblUsers th").remove();

                let orderArrayHeader = ["نام", "نام خانوادگی", "شماره موبایل", "تاریخ عضویت", "آخرین آپدیت"];
                let thead = document.createElement('thead');

                let table = document.getElementById('tblUsers');

                table.appendChild(thead);

                for (let i = 0; i < orderArrayHeader.length; i++) {
                    thead
                        .appendChild(document.createElement("th"))
                        .appendChild(document.createTextNode(orderArrayHeader[i]));
                }

                let tbody = document.createElement('tbody');

                response.forEach(element => {

                    console.log(element);
                    let row = table.insertRow(1);
                    let cel1 = row.insertCell(0);
                    let cel2 = row.insertCell(1);
                    let cel3 = row.insertCell(2);
                    let cel4 = row.insertCell(3);
                    let cel5 = row.insertCell(4);
                    cel1.innerHTML = element.firstName;
                    cel2.innerHTML = element.lastName;
                    cel3.innerHTML = element.phone;
                    cel4.innerHTML = `${element.createAt}`.slice(0, 10);
                    cel5.innerHTML = `${element.lastUpdate}`.slice(0, 10);
                    // tbody.appendChild(row)

                    let rows = table.getElementsByTagName("tr");
                    for (i = 0; i < rows.length; i++) {
                        let currentRow = table.rows[i];
                        let createClickHandler = function (row) {
                            return function () {
                                // let cell = row.getElementsByTagName("td")[2];
                                // id = cell.innerHTML;
                                handleFormUpdate(
                                    row.getElementsByTagName("td")[0].innerHTML,
                                    row.getElementsByTagName("td")[1].innerHTML,
                                    row.getElementsByTagName("td")[2].innerHTML)
                                $('#showFormUpdateUsers').click();
                            };
                        };
                        currentRow.onclick = createClickHandler(currentRow);
                    }
                    tbody.appendChild(row)
                });

                table.append(tbody)

            }
        });
    }

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }




});