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

    $("#create-user").submit(function () {
        e.preventDefault();
        return false;
    });

    $("#create-user").click(function () {
        createUser($("#create-name").val(), $("#create-fname").val(), $("#create-pwd").val(), $("#create-uname").val());
        return false;
    });

    $("form").submit(function(){
        return false;
    });

    $("nav > a").hide();

    $("nav > a").click(function () {
        $.post('club.php', {query: "logout"}, function(result) {
            if(result === "FAILURE") $(".error").show();
            else logout();
        });
    });

    $("#goto-player-view").click(function () {
        $.get('club.php', {query: "gotoPlayerView"}, function(result) {
            if(result === "FAILURE") $(".error").show();
            else logout();
        });
    });

    $("#goto-admin-view").click(function () {
        $.get('club.php', {query: "gotoAdminView"}, function(result) {

        });
    });
});

function loginUser(pseudo, pass) {
    $.post('club.php', {query: "login", uname: pseudo, pwd: pass}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login(result);
    });
}

function createUser(name, fname, pass, pseudo) {
    $.post('club.php', {query: "create", uname: pseudo, pwd: pass, nom: name, prenom: fname}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login(result);
    });
}

function login(result) {
    $('#login-dialog').html(result);
    $("nav > a").show();
}

function logout() {
    $("nav > a").hide();
    window.location.reload(true);
}