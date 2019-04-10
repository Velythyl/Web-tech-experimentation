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

function handlePost($conn) {
    switch ($_POST['query']) {
        case 'login':
            $result = $conn->query("SELECT login ('".$_POST['uname']."', '".$_POST['pwd']."') AS ID") or die($conn->error);

            $ID = $result->fetch_assoc()["ID"];

            if($ID==="" || $ID===NULL || $result->num_rows === 0) throw new Exception("pas conect");

            return $ID;
        case 'create':
            //TODO verifier que ca existe dans la base en SQL
            $result = $conn->query("SELECT create_user ('".$_POST['nom']."', '".$_POST['prenom']."', '".$_POST['pwd']."', '".$_POST['uname']."') AS ID") or die($conn->error);

            if($result == false) throw new Exception("pas conect");

            $ID = $result->fetch_assoc()["ID"];

            if($ID==="" || $ID===NULL || $result->num_rows === 0) throw new Exception("pas conect");

            return $ID;
        case 'logout':
            session_destroy();
            $_SESSION = [];
            echo "SUCCESS";
            exit();
    }
}

function navgationLinks() {
    $player_button = "";
    if($_SESSION["player"] == 1) $player_button = '<a id="goto-player-view" class="input-submit">Page du joueur</a>';

    $admin_button = "";
    if($_SESSION["admin"] == 1) $admin_button = '<a id="goto-admin-view" class="input-submit">Page de l\'admin</a>';

    echo "<div>".$player_button.$admin_button."</div>";
}

if(isset($_SESSION['ID'])) {
    if(!empty($_GET)) {


    } //else navgationLinks();
} else if (!empty($_POST)) {
    $conn = configAndConnect();

    /* https://www.php.net/manual/fr/mysqli.query.php */

    try {
        $ID = handlePost($conn);
    } catch (Exception $e) {
        echo "FAILURE";
        exit();
    }

    session_start();

    $_SESSION["ID"] = $ID;

    $result = $conn->query("SELECT is_player(".$ID.") AS IS_IT");

    $_SESSION["player"] = $result->fetch_assoc()["IS_IT"];

    $result = $conn->query("SELECT is_admin(".$ID.") AS IS_IT");

    $_SESSION["admin"] = $result->fetch_assoc()["IS_IT"];

    if(isset($_POST["admin"])) {
        $_SESSION["as_admin"] = $_POST["admin"];

        if(($_SESSION["as_admin"]=="true" && $_SESSION["admin"]==0) || (!$_SESSION["as_admin"]=="false" && $_SESSION["player"]==0)) {
            echo "FAILURE";
            exit();
        }
    } else {
        $_SESSION["as_admin"] = false;
    }

    //navgationLinks();

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
        <nav id="log-out"><a class="input-submit" href=player.php>Se déconnecter</a></nav>
        <div id="login-dialog" class="centered pretty">
            <!-- https://www.regextester.com/15 pour les pattern anti-nombres
                pour admin: https://stackoverflow.com/questions/16206322/how-to-get-js-variable-to-retain-value-after-page-refresh
aaaaagagaaaa
                pour ajax et les communcations php-js-html: https://stackoverflow.com/questions/20637944/how-to-call-a-php-file-from-html-or-javascript
            -->
            <form>
                <div>Pseudonyme: </div><input class="input-text" id="login-uname" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                <div>Mot de passe: </div><input class="input-text" id="login-pwd" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                <input class="input-submit" type="submit" id="login-player" value="Joueur" required>
                <input class="input-submit" type="submit" id="login-admin" value="Admin" required>
            </form>
            <div class="horizontal-divider grid-full"></div>
            <form>
                <div>Pseudonyme: </div><input id="create-uname" class="input-text" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                <div>Mot de passe: </div><input id="create-pwd" class="input-text" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                <div>Nom: </div><input id="create-name" class="input-text" type="text" placeholder="Nom" pattern="[a-z]{1,30}" title="Nom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                <div>Prénom: </div><input id="create-fname" class="input-text" type="text" placeholder="Prénom" pattern="^((?!([0-9]+)).)*$" title="Prénom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                <input class="input-submit grid-full" type="submit" id="create-user" value="Créer ce compte" required>
            </form>
            <div class="horizontal-divider grid-full error"></div>
            <span class="error-span error">Erreur de connection</span>
        </div>
        <div id="view-wrap">
            <div id="player-view" class="centered pretty under">
                <form>
                    <input type="date" name="date"/>
                    <select name="terrain">
                        <option value="null">all</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <select name="heure">
                        <option value="null">all</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                    </select>
                    <input class="input-submit" type="submit" id="player-search" value="Chercher" required>
                </form>
                <div id="player-display">
                    <?php


                    ?>
                </div>
                <div class="button-holder">
                    <input type="button" class="input-submit" value="Réserver cette  heure"/>
                    <input type="button" class="input-submit" value="Enlever cette réservation"/>
                </div>
            </div>
            <div id="admin-view" class="centered pretty under">

            </div>
        </div>

    </body>

</html>