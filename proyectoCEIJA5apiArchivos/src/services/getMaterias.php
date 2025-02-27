<?php

function getMaterias($year, $plan, $modulo) {
    $url = "http://localhost/proyectoCEIJA5api/src/components/Materias.php?year=" . urlencode($year) . "&plan=" . urlencode($plan) . "&modulo=" . urlencode($modulo);

    $response = file_get_contents($url);
    if ($response === FALSE) {
        return json_encode(["status" => "error", "message" => "Error retrieving subjects"]);
    }

    return $response;
}

?>