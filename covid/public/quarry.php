<?php
if (!isset($_GET['link']) || $_GET['link'] == '') {
    die();
}
$getAPI = file_get_contents($_GET['link']);
exit($getAPI);
