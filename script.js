var selected;
var asAd;

$(document).ready(function () {

    $(".error").hide();

    /*
    Appelle la fonction de login d'usager avec les bons paramètres
     */

    $("#login").submit(function (e) {
        e.preventDefault();
        loginUser($("#login-uname").val(), $("#login-pwd").val(), asAd);
        return false;
    });

    $("#sub-player").unbind('click').click(function () {
        asAd = false;
    });

    $("#sub-admin").unbind('click').click(function () {
        asAd = true;
    });

    /*
    Appelle la fonction de création d'usager avec les bons paramètres

    Ceci est fait avec unbind et click puisqu'il y a un bug JS qui fait que le event arrive deux fois...
     */
    $("#create-user").submit(function (e) {
        e.preventDefault();
        createUser($("#create-name").val(), $("#create-fname").val(), $("#create-pwd").val(), $("#create-uname").val());
        return false;
    });

    /*
    Logout: avec du error handling, mais ça ne devrait pas être utile
     */
    $("nav > a").unbind('click').click(function () {
        $.post('backend.php', {query: "logout"}, function(result) {
            if(result === "FAILURE") $(".error").show();
            else reload();
        });
    });

    /*
    Demande l'état du serveur pour savoir s'il y a eu une connection. Si non, on met le div de login par-dessus tous les
    autres
     */
    $.post('backend.php', {query: "state"}, function(result) {
        if(result==="none") $("#login-wrap").css('z-index', 3000);
    });

    $("#res-error").hide();

    /*
    Les deux prochaines fonctions prennent le ID de l'élément sélectionné de la grille de forme #T:DATE:Heure et
    l'utilisent pour opérer sur la réservation donc le ID est la clé primaire
     */
    $("#reserver").unbind('click').click(function () {
        let arr = selected.split(":");
        const terrai = arr[0];
        const jour = arr[1];
        const heure = arr[2];

        $.get('backend.php', {query: "reserve", terrain: terrai, day: jour, hour: heure}, function(result) {
            if(result.replace("\n", "") === "SUCCESS") reload();
            else {
                $("#res-error").html("Error: you can only book ONE field for tomorrow, or the field is already booked");
                $("#res-error").show();
            }
        });

        //e.preventDefault();
        return false;
    });

    $("#enlever").unbind('click').click(function () {
        let arr = selected.split(":");
        const terrai = arr[0];
        const jour = arr[1];
        const heure = arr[2];

        $.get('backend.php', {query: "unreserve", terrain: terrai, day: jour, hour: heure}, function(result) {
            reload();
        });

        //e.preventDefault();
        return false;
    });

    /*
    Permet la sélection d'items de grilles ou de listes
     */
    $(".user-row > div").unbind('click').click(function () {
        $(".user-row > div").removeClass("accent");
        $(this).addClass("accent");
        $(this).siblings().addClass("accent");
    });

    $(".selectable").unbind('click').click(function () {
        $(".selectable").removeClass("accent");
        $(this).addClass("accent");
        selected = $(this).attr("id");
    })
});

function loginUser(pseudo, pass, is_admin) {
    $.post('backend.php', {query: "login", uname: pseudo, pwd: pass, admin: is_admin}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login();
    });
}

function createUser(name, fname, pass, pseudo) {
    $.post('backend.php', {query: "create", uname: pseudo, pwd: pass, nom: name, prenom: fname, admin: "false"}, function(result) {
        if(result === "FAILURE") $(".error").show();
        else login();
    });
}

/*
Lorsqu'on login on n'a qu'à rappeler la page club.php
 */
function login() {
    //on appelle club.php avec une recherche de tous les terrains, toutes les heures, demain
    window.location.href = 'club.php?date=&terrain=all&heureLo=all&heureHi=all';
}

/*
Recharge la page
 */
function reload() {
    window.location.reload(true);
}
