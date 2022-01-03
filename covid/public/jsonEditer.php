<?php
include 'password.php';
$_GET['password'] === $password ? file_put_contents('./db.json', $_GET['data']) : die();
