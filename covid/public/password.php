<?php
$password = '123'; // CHANGE PASSWORD HERE

if ($_GET['password'] == $password) {
    echo 'ok';
} else {
    echo 'wrong';
}
