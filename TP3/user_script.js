$(document).ready(function () {
    $("#login-user").click(function () {
        loginUser("test", "allo");
    });
});

function loginUser(uname, mdp) {
    $.post(                             //call the server
        "http://localhost/club_login.php",                     //At this url
        {
            login: uname,
            password: mdp
        }                               //And send this data to it
    ).done(                             //And when it's done
        function(data)
        {
            $('#fromAjax').html(data);  //Update here with the response
        }
    );
}