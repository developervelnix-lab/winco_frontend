<?php
$conn = mysqli_connect('localhost', 'root', '', 'winco');
if (!$conn) die('Conn Failed');
$res = mysqli_query($conn, "SELECT tbl_service_value FROM tblservices WHERE tbl_service_name = 'SITE_ADDRESS'");
if ($row = mysqli_fetch_assoc($res)) {
    echo "Current DB Address: [" . $row['tbl_service_value'] . "]\n";
} else {
    echo "SITE_ADDRESS not found in database!\n";
}
?>
