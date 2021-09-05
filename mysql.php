<?php

function openMySql() {
    $mysqli = new mysqli("localhost", "equulei", "********", "mapa");
    return $mysqli;
}

function closeMySql($mysqli) {
    /* close connection */
    $mysqli->close();
}

?>