<?php

/* pas de <?php if (isset($_GET['source'])) die(highlight_file(__FILE__, 1)); ?> car on ne veut pas afficher la source */

include "db.php";

session_start();

$isAdmin = "false"; //sucre sémantique pour plus tard
if(isset($_SESSION['as_admin'])) $isAdmin = $_SESSION['as_admin'];

function getTomorrow() {
    $datetime = new DateTime('tomorrow', new DateTimeZone('America/Toronto'));
    $day = $datetime->format('Y-m-d');
    return $day;
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
        <script src="script.js"></script>

        <style id="style">

        </style>
    </head>
    <body>
        <nav id="log-out"><a class="input-submit" href=player.php>Logout</a></nav>
        <div id="login-wrap">
            <div id="login-dialog" class="centered pretty">
                <!-- https://www.regextester.com/15 pour les pattern anti-nombres
                    pour admin: https://stackoverflow.com/questions/16206322/how-to-get-js-variable-to-retain-value-after-page-refresh
    aaaaagagaaaa
                    pour ajax et les communcations php-js-html: https://stackoverflow.com/questions/20637944/how-to-call-a-php-file-from-html-or-javascript
                -->
                <form>
                    <div>Unsername: </div><input class="input-text" id="login-uname" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Password: </div><input class="input-text" id="login-pwd" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <input class="input-submit" type="submit" id="login-player" value="Player" required>
                    <input class="input-submit" type="submit" id="login-admin" value="Admin" required>
                </form>
                <div class="horizontal-divider grid-full"></div>
                <form>
                    <div>Username: </div><input id="create-uname" class="input-text" type="text" placeholder="Pseudonyme" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Password: </div><input id="create-pwd" class="input-text" type="password" placeholder="Mot de passe" pattern=".{1,255}" title="Doit contenir moins de 255 caractères" required>
                    <div>Name: </div><input id="create-name" class="input-text" type="text" placeholder="Nom" pattern="[a-z]{1,30}" title="Nom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                    <div>First name: </div><input id="create-fname" class="input-text" type="text" placeholder="Prénom" pattern="^((?!([0-9]+)).)*$" title="Prénom ne doit contenir que des lettres et mesurer moins de 30 charactères" required>
                    <input class="input-submit grid-full" type="submit" id="create-user" value="Create account" required>
                </form>
                <div class="horizontal-divider grid-full error"></div>
                <span class="error-span error">Connexion error</span>
            </div>
        </div>
        <div id="hidey"></div>
        <div id="view-wrap" class="">
            <div class="pretty view">
                <form id="terrain-form" action="club.php" method="get" style="grid-template-columns: repeat(<?php /* on ajuste la grosseur de la grille */  if($isAdmin==="true") echo '4';
                                                                                                                    else echo '3'?>, 1fr)">

                    <!-- chacun des select et input se fait changer sa valeur par defaut selon le GET en ce moment -->
                    <label for="date">Date</label>
                    <label for="terrain">Field</label>
                    <label for="heureLo"><?php /*on ajuste selon si on est un admin ou pas */ if($isAdmin === "true") echo "From";
                                                else echo "Hour"; ?></label>
                    <?php /* si on est un admin on a besoin d'un label de plus */ if($isAdmin === "true") echo '<label for="heureHi">To</label>'; ?>
                    <input type="date"
                           <?php
                           /* si la date n'est pas set, on prend celle de demain */
                           if(isset($_GET['date'])) {

                               $day = $_GET['date'];
                               if($day === '') $day = getTomorrow();

                               echo 'value="'.$day.'"';

                           } else echo getTomorrow();

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
                        <?php /* si on a une des deux heures à "all" on met les deux à "all" */
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
                    <?php /* si on a une des deux heures à "all" on met les deux à "all". Aussi, ce select n'est que
                            pour les admin*/
                    if($isAdmin === "true") {
                        $ech = '<select name="heureHi">';
                        if(isset($_GET) && isset($_GET['heureHi'])) {
                            $temp = '<option value="'.$_GET['heureHi'].'" selected>'.$_GET['heureHi'].'</option>';
                            if($_GET['heureLo']==='all') $temp = '<option value="'.$_GET['heureLo'].'" selected>'.$_GET['heureLo'].'</option>';
                            $ech = $ech.$temp;
                        }
                        $ech = $ech.'<option value="all">all</option>
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
                    <input class="input-submit grid-full" type="submit" id="player-search" value="Query" required>
                </form>

                    <?php
                    /*
                     * Crée la grille
                     */
                    if(isset($_GET)) {
                        if(!isset($_SESSION["as_admin"])) echo "Querying...";   //message d'erreur temporaire
                        elseif(isset($_GET["date"])) {

                            $conn = configAndConnect();

                            $DATE = $_GET["date"];
                            if($DATE==="") $DATE=getTomorrow(); //prend demain si pas fait

                            /*
                             * On s'assure que si une des heures est "all", on cherche pour "all" peu importe
                             */
                            $heureLo = $_GET["heureLo"];

                            if(isset($_GET["heureHi"]) && $isAdmin==="true") $heureHi = $_GET["heureHi"];
                            else $heureHi = $heureLo;
                            if($heureLo==="all" || $heureHi==="all") {
                                $heureLo = 6;
                                $heureHi = 20;
                            }

                            //fait la requete
                            $result = $conn->query("CALL all_on_day('".$DATE."', ".$heureLo.", ".$heureHi.", '".$_GET["terrain"]."', '".($isAdmin === 'false'? $_SESSION["ID"] : 'admin')."')") or die($conn->error);

                            close($conn);

                            /*
                             * header est titre de la grille
                             */
                            $header = "<div class='grid-full'>On $DATE</div><div>#T</div>";
                            for($counter = $heureLo; $counter <= $heureHi; $counter++) {
                                $header = $header."<div>$counter</div>";
                            }

                            $grid = "";
                            $line = "";
                            $oldF = "";
                            while ($row = $result->fetch_row()){    //pour chaque row de la réponse

                                $f = $row[0];                       //on prend l'identifiant de terrain

                                if($f != $oldF) {                   //si c'est la première fois qu'on le voit
                                    $grid = $grid.$line;            //on sauve la ligne précédente et on en fait une nouvelle
                                    $line = "<div>$f</div><div class='selectable $row[2]' tabindex='1' id='$row[0]:$DATE:$row[1]'>$row[2]</div>";
                                                                    //sinon, on met un nouvel élément de disponibilité
                                } else $line = $line."<div class='selectable $row[2]' tabindex='1' id='$row[0]:$DATE:$row[1]'>$row[2]</div>";

                                $oldF = $f;                         //on se rappelle de la ligne précédente
                            }

                            $nbCol = 2 + ($heureHi-$heureLo);       //nb de colonnes est heureHi - heureLo, mais inclusif + le #t

                            $center = "";
                            if($isAdmin === "false") $center = " center";
                            //on ajuste le css-grid dépendemment du input...
                            echo '<div class="display'.$center.'" style="display: grid; grid-template-columns: repeat('.$nbCol.', 1fr); grid-auto-rows: 1fr; align-items: stretch;">'.$header.$grid.$line."</div>";
                        }
                    }
                    ?>

                <?php
                /*
                 * Si on est pas un admin on peut réserver et annuler
                 */
                if($isAdmin === "false") {
                    echo    '<div class="button-holder">
                                <input id="reserver" type="button" class="input-submit" value="Book"/>
                                <input id="enlever" type="button" class="input-submit" value="Cancel booking"/>
                            </div>';
                }
                ?>
                <?php
                if($isAdmin === "false") echo '<div class="pretty" id="res-error"></div>';;
                ?>
            </div>

            <?php
            /*
             * Si on est un admin, on fait la liste des joueurs
             */
            if($isAdmin === "true") {
                $ech = '<div class="pretty view">
                <div class="player-display">
                    <div><div class="grid-full accent">Player list</div></div>
                    <div><div class="top">Username</div><div class="middle top">Name</div><div class="top">Last name</div></div>';

                $conn = configAndConnect();

                $result = $conn->query("CALL all_users()") or die($conn->error);

                close($conn);

                while ($row = $result->fetch_row()){    //pour chaque row de réponse, on ajoute un élément dans la liste
                    $ech = $ech."<div class='user-row' tabindex='1'><div>$row[0]</div><div class='middle'>$row[1]</div><div>$row[2]</div></div>";
                }

                $ech = $ech.'</div></div>';

                echo $ech;
            }
            ?>

            <?php
            /*
             * Si on est un joueur, on fait la liste des réservations
             */
            if($isAdmin === "false") {
                $ech = '<div class="pretty view">
                <div class="player-display">
                    <div><div class="grid-full accent">Booking list</div></div>
                    <div><div class="top">Date</div><div class="middle top">Hour</div><div class="top">Field</div></div>';

                $conn = configAndConnect();

                $result = $conn->query("CALL all_reserves(".$_SESSION['ID'].")") or die($conn->error);

                close($conn);

                while ($row = $result->fetch_row()){    //pour chaque row de réponse on ajoute un élément à la liste
                    $ech = $ech."<div class='user-row' tabindex='1'><div>$row[0]</div><div class='middle'>$row[1]</div><div>$row[2]</div></div>";
                }

                $ech = $ech.'</div></div>';

                echo $ech;
            }
            ?>
        </div>

    </body>

</html>

<?php

close($conn);

?>