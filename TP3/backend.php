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
        case 'state':
            if(isset($_SESSION) && isset($_SESSION["as_admin"])) echo $_SESSION["as_admin"];
            else echo "none";
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

function handleGet($conn) {
    switch ($_GET['query']) {
        case 'reserve':
            $result = $conn->query("call reserve (".$_GET['terrain'].", '".$_GET['day']."', ".$_GET['hour'].", ".$_SESSION["ID"].")") or die($conn->error);

            return $result->fetch_row()[0];
        case 'unreserve':
            $result = $conn->query("call unreserve (".$_GET['terrain'].", '".$_GET['day']."', ".$_GET['hour'].", ".$_SESSION["ID"].")") or die($conn->error);

            return $result->fetch_row()[0];
        case 'logout':
            session_destroy();
            $_SESSION = [];
            echo "SUCCESS";
            exit();
        case 'state':
            if(isset($_SESSION) && isset($_SESSION["as_admin"])) echo $_SESSION["as_admin"];
            else echo "none";
            exit();
    }
}

session_start();

if (!empty($_POST)) {
    $conn = configAndConnect();

    /* https://www.php.net/manual/fr/mysqli.query.php */

    try {
        $ID = handlePost($conn);
    } catch (Exception $e) {
        echo "FAILURE";
        exit();
    }

    //session_start();

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
} elseif(!empty($_GET)) {
    $conn = configAndConnect();

    $value = handleGet($conn);

    echo $value;


}

?>