$(document).ready(function () {
    $(".error").hide();

    $("#login-user").click(function () {
        loginUser($("#login-uname").val(), $("#login-pwd").val());
            return false;
    });

    $("#login-user").submit(function () {
        e.preventDefault();
        return false;
    });

    $("form").submit(function(){
        return false;
    });
});

function loginUser(pseudo, pass) {
    $.post('club.php', {query: "login", uname: pseudo, pwd: pass}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else $('#login-dialog').html(result);
    });
}