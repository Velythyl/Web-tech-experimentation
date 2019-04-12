<?php
session_start();

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
            <div id="query-view" class="centered pretty under">
                <form action="club.php" method="get">
                    <input type="text" name="query" value="playerSearch" style="display: none"/>
                    <input type="date"
                           <?php
                           if(isset($_GET) && isset($_GET['date'])) echo 'value="'.$_GET['date'].'"';
                           else {
                               $datetime = new DateTime('tomorrow');
                               echo $datetime->format('Y-m-d');
                           }
                           ?>
                    name="date"/>
                    <select name="terrain">
                        <?php
                        if(isset($_GET) && isset($_GET['terrain'])) echo '<option value="'.$_GET['terrain'].'" selected>'.$_GET['terrain'].'</option>';
                        ?>
                        <option value="all">all</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <select name="heureLo">
                        <?php
                        if(isset($_GET) && isset($_GET['heureLo'])) {
                            if(isset($_GET['heureHi']) && $_GET['heureHi']==='all') echo '<option value="'.$_GET['heureHi'].'" selected>'.$_GET['heureHi'].'</option>';
                            else echo '<option value="'.$_GET['heureLo'].'" selected>'.$_GET['heureLo'].'</option>';
                        }
                        ?>
                        <option value="all">all</option>
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
                    <?php
                    if(isset($_SESSION['as_admin']) && $_SESSION['as_admin']==='true') {
                        $ech = '<select name="heureHi">';
                        if(isset($_GET) && isset($_GET['heureHi'])) {
                            $temp = '<option value="'.$_GET['heureHi'].'" selected>'.$_GET['heureHi'].'</option>';
                            if($_GET['heureLo']==='all') $temp = '<option value="'.$_GET['heureLo'].'" selected>'.$_GET['heureLo'].'</option>';
                        }
                        $ech = $ech.$temp.'<option value="all">all</option>
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
                    </select>';

                        echo $ech;
                    }
                    ?>
                    <input class="input-submit" type="submit" id="player-search" value="Chercher" required>
                </form>
                <div id="query-display">
                    <?php
                    if(isset($_GET)) {
                        if(!isset($_SESSION["as_admin"])) echo "UNCONNECTED";
                        //elseif ($_SESSION["as_admin"]==="true") echo "ERREUR";
                        elseif(isset($_GET["query"]) && $_GET["query"]==="playerSearch") {
                            //echo "test";

                            $conn = configAndConnect();

                            $DATE = $_GET["date"];
                            if($DATE==="") $DATE=date("Y-m-d"); //https://www.w3schools.com/php/php_date.asp

                            $heureLo = $_GET["heureLo"];

                            if(isset($_GET["heureHi"]) && $_SESSION['as_admin']) $heureHi = $_GET["heureHi"];
                            else $heureHi = $heureLo;
                            if($heureLo==="all" || $heureHi==="all") {
                                $heureLo = 6;
                                $heureHi = 20;
                            }

                            $result = $conn->query("CALL all_on_day('".$DATE."', ".$heureLo.", ".$heureHi.", '".$_GET["terrain"]."', '".$_SESSION["ID"]."')") or die($conn->error);

                            $header = '<div class="line"><div>#T</div>';
                            for($counter = $heureLo; $counter <= $heureHi; $counter++) {
                                $header = $header."<div>$counter</div>";
                            }

                            $grid = "";
                            $line = "";
                            $oldF = "";
                            while ($row = $result->fetch_row()){

                                $f = $row[0];

                                if($f != $oldF) {
                                    $grid = $grid.$line."</div>";
                                    $line = '<div class="line" '."><div>$f</div><div tabindex='1' id='$row[0]:$DATE:$row[1]'>$row[2]</div>";

                                } else $line = $line."<div tabindex='1' id='$row[0]:$DATE:$row[1]'>$row[2]</div>";

                                $oldF = $f;
                            }

                            echo $header.$grid.$line."</div>";
                        }
                    }
                    ?>
                </div>
                <?php
                if(isset($_SESSION['as_admin']) && $_SESSION['as_admin'] === "false") {
                    echo    '<div class="button-holder">
                                <input id="reserver" type="button" class="input-submit" value="Réserver cette  heure"/>
                                <input id="enlever" type="button" class="input-submit" value="Enlever cette réservation"/>
                            </div>';
                }
                ?>

            </div>
            <div id="admin-view" class="centered pretty under">

            </div>
        </div>

    </body>

</html>