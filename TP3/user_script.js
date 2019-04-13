var selected;

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

    $("nav > a").click(function () {
        $.post('backend.php', {query: "logout"}, function(result) {
            if(result === "FAILURE") $(".error").show();
            else logout();
        });
    });
    
    $.post('backend.php', {query: "state"}, function(result) {
        if(result!=="none") {
            showViews();
        } else $("#login-wrap").css('z-index', 3000);
    });
    
    $(".selectable").click(function () {
        selected = $(this).attr("id");
    });

    $("#res-error").hide();

    $("#reserver").click(function () {
        let arr = selected.split(":");
        const terrai = arr[0];
        const jour = arr[1];
        const heure = arr[2];

        $.get('backend.php', {query: "reserve", terrain: terrai, day: jour, hour: heure}, function(result) {
            if(result === "FAILURE") {
                $("#res-error").html("Error: you can only book a field for tomorrow, or the field is already booked");
                $("#res-error").show();
            } else reload();
        });

        e.preventDefault();
        return false;
    });

    $("#enlever").click(function () {
        let arr = selected.split(":");
        const terrai = arr[0];
        const jour = arr[1];
        const heure = arr[2];

        $.get('backend.php', {query: "unreserve", terrain: terrai, day: jour, hour: heure}, function(result) {
            if(result === "FAILURE") {
                $("#res-error").html("Error: you can only cancel one of your own reservations that haven't already been passed");
                $("#res-error").show();
            } else reload();
        });

        e.preventDefault();
        return false;
    });

    $(".user-row > div").click(function () {
        $(".accent").attr("class","");
        $(this).attr("class","accent");
        $(this).siblings().attr("class","accent");
    })
});

function loginUser(pseudo, pass, is_admin) {
    $.post('backend.php', {query: "login", uname: pseudo, pwd: pass, admin: is_admin}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login();
    });
}

function createUser(name, fname, pass, pseudo) {
    $.post('backend.php', {query: "create", uname: pseudo, pwd: pass, nom: name, prenom: fname}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login();
    });
}

function showViews() {

    $('#login-wrap').css('z-index', 1);
}

function login() {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);

    window.location.href = 'club.php?date=&terrain=all&heureLo=all&heureHi=all';

    showViews();
}

function reload() {
    window.location.reload(true);
}

function logout() {
    $("nav > a").hide();
    reload();
}