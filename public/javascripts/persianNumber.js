$(document).ready(function () {
    String.prototype.toPersianDigits = function () {
        var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return this.replace(/[0-9]/g, function (w) {
            return id[+w]
        });
    }
    for (let i = 0; i < document.getElementsByClassName("perNum").length; i++) {
        document.getElementsByClassName("perNum")[i].innerHTML = document.getElementsByClassName("perNum")[i].innerHTML.toPersianDigits();        
    }    

    // document.getElementById("creatAt").innerHTML = document.getElementById("creatAt").innerHTML.toPersianDigits();        
    
});