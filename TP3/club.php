<?php

function configAndConnect() {
    /* https://www.cloudways.com/blog/connect-mysql-with-php/    */

    $dbhost = "localhost";
    $dbuser = "gautchar";
    $dbpass = "mdp1234";
    $db = "gautchar_IFT3225TP3";

    $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);

    return $conn;
}

function close($conn) {
    $conn -> close();
}

if (!empty($_POST)) {
    $conn = configAndConnect();

    /* https://www.php.net/manual/fr/mysqli.query.php */

    switch ($_POST['query']) {
        case 'login':
            //print_r($_POST);
            $result = $conn->query("SELECT login ('".$_POST['uname']."', '".$_POST['pwd']."') AS ID") or die($conn->error);

            $ID = $result->fetch_assoc()["ID"];

            if($ID==="" || $ID===NULL || $result->num_rows === 0) echo "FAILURE";
            else {
                session_start();

                $_SESSION["ID"] = $ID;

                $result = $conn->query("SELECT is_player(".$ID.") AS IS_IT");

                $_SESSION["player"] = $result->fetch_assoc()["IS_IT"];

                $player_button = "";
                if($_SESSION["player"] == 1) $player_button = '<a class="input-submit" href=player.php>Réservations</a>';

                $result = $conn->query("SELECT is_admin(".$ID.") AS IS_IT");

                $_SESSION["admin"] = $result->fetch_assoc()["IS_IT"];

                $admin_button = "";
                if($_SESSION["admin"] == 1) $admin_button = '<a class="input-submit" href=admin.php>Page d\'administration</a>';

                echo "<div>".$player_button.$admin_button."</div>";
            }
    }

    exit();
}

?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="UTF-8">
        <title>Club de sport</title>
        <link rel="stylesheet" type="text/css" href="css_club.css"/>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="script.js"></script>
        <script src="user_script.js"></script>

        <style id="style">

        </style>
    </head>
    <body>
        <div id="login-wrap">
            <div id="login-dialog">
                <!-- https://www.regextester.com/15 pour les pattern anti-nombres
                    pour admin: https://stackoverflow.com/questions/16206322/how-to-get-js-variable-to-retain-value-after-page-refresh
aaaaagagaaaa
                    pour ajax et les communcations php-js-html: https://stackoverflow.com/questions/20637944/how-to-call-a-php-file-from-html-or-javascript
                -->
                <form>
                    <div>Pseudonyme: </div><input class="input-text" id="login-uname" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Mot de passe: </div><input class="input-text" id="login-pwd" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <input class="input-submit grid-full" type="submit" id="login-user" value="Se connecter" required>
                </form>
                <div class="horizontal-divider grid-full"></div>
                <form id="create-user">
                    <div>Pseudonyme: </div><input class="input-text" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Mot de passe: </div><input class="input-text" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Nom: </div><input class="input-text" type="text" placeholder="Nom" pattern="[a-z]{1,30}" title="Nom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                    <div>Prénom: </div><input class="input-text" type="text" placeholder="Prénom" pattern="^((?!([0-9]+)).)*$" title="Prénom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                    <input class="input-submit grid-full" type="submit" value="Créer ce compte" required>
                </form>
                <div class="horizontal-divider grid-full error"></div>
                <span class="error-span error">Erreur de connection</span>
            </div>
            <div id="fromAjax"></div>
        </div>
    </body>

</html>