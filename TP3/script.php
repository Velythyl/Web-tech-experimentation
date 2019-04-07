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