$(document).ready(function () {

    $(".error").hide();

    $("#login-player").click(function () {
        loginUser($("#login-uname").val(), $("#login-pwd").val(), false);
            return false;
    });

    $("#login-player").submit(function () {
        e.preventDefault();
        return false;
    });

    $("#login-admin").click(function () {
        loginUser($("#login-uname").val(), $("#login-pwd").val(), true);
        return false;
    });

    $("#login-admin").submit(function () {
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

    $("#player-view").hide();

    $("#admin-view").hide();

    $("#player-search").click(function () {
        
    });
});

function loginUser(pseudo, pass, is_admin) {
    $.post('club.php', {query: "login", uname: pseudo, pwd: pass, admin: is_admin}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login(is_admin);
    });
}

function createUser(name, fname, pass, pseudo) {
    $.post('club.php', {query: "create", uname: pseudo, pwd: pass, nom: name, prenom: fname}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login(false);
    });
}

function login(is_admin) {
    $('#login-dialog').hide();
    $("nav > a").show();

    if(is_admin) $("#admin-view").show();
    else $("#player-view").show();
}

function logout() {
    $("nav > a").hide();
    window.location.reload(true);
}

function playerQuery(dat, terrai, heur) {

    if(dat === null) {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);

        dat=""+tomorrow.getFullYear()+"-"+(1+tomorrow.getMonth())+"-"+tomorrow.getDay();
    }

    if(terrai === null) {
        terrai = "all";
    }

    if(heur === null) {
        heur = "all";
    }

    $.get('club.php', {query: "playerQuery", date: dat, terrain: terrai, heure: heur}, function (result) {
        $("#player-display").html(result);
    })
}