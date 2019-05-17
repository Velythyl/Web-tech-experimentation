<?php

/* pas de <?php if (isset($_GET['source'])) die(highlight_file(__FILE__, 1)); ?> car on ne veut pas afficher la source */

/*
 * Retourne une connection vers mysql
 */
function configAndConnect() {
    /* https://www.cloudways.com/blog/connect-mysql-with-php/    */

    $dbhost = "mysql.iro.umontreal.ca:3306";
    $dbuser = "gautchar";
    $dbpass = "mdp1234";
    $db = "gautchar_IFT3225TP3";

    $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);

    return $conn;
}

/*
 * ferme la connection vers mysql
 */
function close($conn) {
    $conn -> close();
}

?>