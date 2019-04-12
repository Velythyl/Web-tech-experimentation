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


    $("nav > a").hide();

    $("nav > a").click(function () {
        $.post('backend.php', {query: "logout"}, function(result) {
            if(result === "FAILURE") $(".error").show();
            else logout();
        });
    });

    $("#goto-player-view").click(function () {
        $.get('backend.php', {query: "gotoPlayerView"}, function(result) {
            if(result === "FAILURE") $(".error").show();
            else logout();
        });
    });

    $("#goto-admin-view").click(function () {
        $.get('backend.php', {query: "gotoAdminView"}, function(result) {

        });
    });

    $("#query-view").hide();

    $("#admin-view").hide();

    $("#player-search").click(function () {
        playerQuery();
    });
    
    $.post('backend.php', {query: "state"}, function(result) {
        if(result!=="none") {
            login(result);
        }
    });
    
    $(".line > div").click(function () {
        selected = $(this).attr("id");
    });

    $("#reserver").click(function () {
        let arr = selected.split(":");
        const terrai = arr[0];
        const jour = arr[1];
        const heure = arr[2];

        $.get('backend.php', {query: "reserve", terrain: terrai, day: jour, hour: heure}, function(result) {
            if(result === "FAILURE") alert("Reservation failure");
            else reload();
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
            if(result === "FAILURE") alert("Annulation failure");
            else reload();
        });

        e.preventDefault();
        return false;
    })
});

function loginUser(pseudo, pass, is_admin) {
    $.post('backend.php', {query: "login", uname: pseudo, pwd: pass, admin: is_admin}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login(is_admin);
    });
}

function createUser(name, fname, pass, pseudo) {
    $.post('backend.php', {query: "create", uname: pseudo, pwd: pass, nom: name, prenom: fname}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login(false);
    });
}

function login(is_admin) {
    var log = false
    if(is_admin instanceof String) {
        log = (is_admin === "true");
    }

    $('#login-dialog').hide();
    $("nav > a").show();

    if(log) {
        $("#admin-view").show();
    } else {
        $("#query-view").show();
    }

    //reload();
}

function reload() {
    window.location.reload(true);
}

function logout() {
    $("nav > a").hide();
    reload();
}

function playerQuery() {
    var dat = $('#query-view > form > [name="date"]').val();
    var terrai = $('#query-view > form > [name="terrain"]').val();
    var heur = $('#query-view > form > [name="heure"]').val();

    if(dat === null || dat==="") {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);

        dat=""+tomorrow.getFullYear()+"-"+(1+tomorrow.getMonth())+"-"+tomorrow.getDay();
    }

    if(terrai === null || terrai==="") {
        terrai = "all";
    }

    if(heur === null || heur==="") {
        heur = "all";
    }

    $.get('backend.php', {query: "playerQuery", date: dat, terrain: terrai, heure: heur}, function (result) {
        $("#query-display").html(result);
    })
}