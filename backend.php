<?php

session_start();

/* pas de <?php if (isset($_GET['source'])) die(highlight_file(__FILE__, 1)); ?> car on ne veut pas afficher la source */

include "db.php";

function makeLogin($conn) {
    $result = $conn->query("SELECT ID FROM Individu WHERE login='".$_POST['uname']."' AND mot_de_passe='".$_POST['pwd']."'") or die($conn->error);

    $ID = $result->fetch_row()[0];

    if($ID==="" || $ID===NULL || $result->num_rows === 0 || $ID==="NULL") throw new Exception("pas conect");

    return $ID;
}

/*
 * Traitement des POST. Les vérifications de la validité des opérations est faite par la BD
 */
function handlePost($conn) {
    switch ($_POST['query']) {
        /*
         * Prend le ID du login et le retourne. S'il n'y a pas d'ID à ces identifiants, lance une exception
         */
        case 'login':
            return makeLogin($conn);
        /*
         * Prend le ID de l'usager et le retourne. S'il n'y a pas d'ID à ces identifiants (si on a pas pu créer
         * l'usager), lance une exception
         */
        case 'create':
            $result = $conn->query("INSERT INTO Individu VALUES (NULL, '".$_POST['nom']."', '".$_POST['prenom']."', '".$_POST['pwd']."', '".$_POST['uname']."')");  //crée le joueur

            if($result == false) throw new Exception("pas conect");

            $ID = makeLogin($conn);                         //fait la connection

            $conn->query("INSERT INTO Joueur VALUES ($ID)");    //et ajoute le ID aux joueurs

            return $ID;
        /*
         * Détruit simplement la $_SESSION pour logout
         */
        case 'logout':
            session_destroy();
            $_SESSION = [];
            echo "SUCCESS";
            exit();
        /*
         * La session existe et qu'elle a réussi (donc, si as_admin est set), on sait qu'on est connecté. Sinon,
         * retourne "none"
         */
        case 'state':
            if(isset($_SESSION) && isset($_SESSION["as_admin"])) echo $_SESSION["as_admin"];
            else echo "none";
            exit();
    }
}

/*
 * Traitement des GET AJAX
 */
function handleGet($conn) {
    /*
     * Pour faire une réservation ou une cancellation on prend les paramètres passés en GET et on leur ajoute le ID de
     * la $_SESSION. Le traitement de la validité des opérations est faite par la BD (ex si on annulle une réservation
     * qui ne nous appartient pas, etc)
     */

    $T = $_GET['terrain'];
    $D = $_GET['day'];
    $H = $_GET['hour'];
    $ID = $_SESSION["ID"];

    switch ($_GET['query']) {
        case 'reserve':
            $result = $conn->query("SELECT 1 FROM Reservation WHERE NOT EXISTS(SELECT 1 FROM Reservation WHERE R_date='$D' AND J_ID=$ID) /* Verifie si le joueur a une reservation ce jour-la */
                                    AND NOT EXISTS(SELECT 1 FROM Reservation WHERE T_ID=$T AND R_date='$D' AND heure=$H) /* Verifie si la plage horaire est deja prise */
                                    AND DATEDIFF('$D', CURDATE()) = 1");

            $result = $result->fetch_row()[0];
            if($result==="" || $result===NULL ||$result==="NULL") return "FAILURE";

            $result = $conn->query("INSERT INTO Reservation VALUES($T, '$D', $H, $ID)") or die($conn->error);

            return "SUCCESS";
        case 'unreserve':
            $result = $conn->query("DELETE FROM Reservation WHERE T_ID=$T AND R_date='$D' AND heure=$H AND J_ID=$ID AND (DATEDIFF('$D', CURDATE()) >= 1 OR ('$D'=CURDATE() AND HOUR(CURRENT_TIME()) < $H)) ") or die($conn->error);

            if($result == false) return "FAILURE";
            if($result == true) return "SUCCESS";

            return $result->fetch_row()[0];
    }
}

/*
 * Si on réagit a un post
 */
if (!empty($_POST)) {
    $conn = configAndConnect();

    /* https://www.php.net/manual/fr/mysqli.query.php */

    /*
     * On essaie d'aller chercher le ID.
     */
    try {
        $ID = handlePost($conn);
    } catch (Exception $e) {    //si ça plante, ça veut dire qu'on a pas trouvé de bon ID. On peut donc dire "FAILURE"
        echo "FAILURE";
        exit();
    }

    /*
     * Si on se rend ici, ça veut dire qu'on faisait soit un create user ou un login. On doit donc regarder dans la BD
     * pour voir ce qu'est l'usager (player vs admin)
     */

    $_SESSION["ID"] = $ID;

    $result = $conn->query("SELECT(EXISTS(SELECT 1 FROM Joueur WHERE ".$_SESSION['ID']."=Joueur.ID))");

    $_SESSION["player"] = $result->fetch_row()[0];

    $result = $conn->query("SELECT(EXISTS(SELECT 1 FROM Gestionnaire WHERE ".$_SESSION['ID']."=Gestionnaire.ID))");

    $_SESSION["admin"] = $result->fetch_row()[0];

    if(isset($_POST["admin"])) {
        $_SESSION["as_admin"] = $_POST["admin"];

        if(($_SESSION["as_admin"]=="true" && $_SESSION["admin"]=="0") || (!$_SESSION["as_admin"]=="false" && $_SESSION["player"]=="0")) {
            echo "FAILURE";
            session_destroy();
            exit();
        }
    } else {
        $_SESSION["as_admin"] = false;
    }

    exit();

/*
 * Si on reçoit un GET
 */
} elseif(!empty($_GET)) {
    if($_SESSION['as_admin'] === 'true') {
        echo "FAILURE";
    } else {
        $conn = configAndConnect();

        $value = handleGet($conn);

        echo $value;
    }
}

?>

<?php

close($conn);

?>
