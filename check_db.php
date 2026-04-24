<?php
define("ACCESS_SECURITY","true");
include 'd:/xampp/htdocs/security/config.php';
$res = mysqli_query($conn, "DESCRIBE tblmatchplayed");
if($res){
    while($row = mysqli_fetch_assoc($res)){
        echo $row['Field'] . " (" . $row['Type'] . ")\n";
    }
} else {
    echo mysqli_error($conn);
}
?>
