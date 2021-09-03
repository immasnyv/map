<?php

function openMySql() {
    $mysqli = new mysqli("localhost", "masny", "password", "masny");
    return $mysqli;
}

function closeMySql($mysqli) {
    /* close connection */
    $mysqli->close();
}

?>