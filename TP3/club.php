<?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        echo 'alu';
        var_dump($_POST);
        header('Location: ', true, 303);
        exit();

    } else {
        var_dump($_GET);
        header('Content-Type: text/html; charset=utf-8');
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

                    pour ajax et les communcations php-js-html: https://stackoverflow.com/questions/20637944/how-to-call-a-php-file-from-html-or-javascript
                -->
                <form>
                    <div>Pseudonyme: </div><input class="input-text" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Mot de passe: </div><input class="input-text" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <input id="login-user" class="input-submit grid-full" type="submit" value="Se connecter" required>
                </form>
                <div class="horizontal-divider grid-full"></div>
                <form>
                    <div>Pseudonyme: </div><input class="input-text" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Mot de passe: </div><input class="input-text" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Nom: </div><input class="input-text" type="text" placeholder="Nom" pattern="[a-z]{1,30}" title="Nom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                    <div>Prénom: </div><input class="input-text" type="text" placeholder="Prénom" pattern="^((?!([0-9]+)).)*$" title="Prénom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                    <input id="create-user" class="input-submit grid-full" type="submit" value="Créer ce compte" required>
                </form>
            </div>
            <div id="fromAjax"></div>
        </div>
    </body>

</html>