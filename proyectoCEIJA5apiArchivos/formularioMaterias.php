<?php

// Asumimos que ya se ha registrado el plan y modulo, y se tiene la información de planAnio y modulo
$planAnio = $_POST['planAnio'];
$modulo = $_POST['modulo']; // Por ejemplo, 1 para módulo 1, 2 para módulo 2, etc.

// Llamamos a la función para obtener las materias
$materias = getMateriasPorPlanModulo($planAnio, $modulo);

// Mostramos las materias en un formulario
if (!empty($materias)) {
    echo "<h3>Materias disponibles:</h3>";
    echo "<form method='POST' action='procesar_inscripcion.php'>";
    foreach ($materias as $materia) {
        echo "<div>";
        echo "<input type='checkbox' name='materias[]' value='" . $materia['idMateria'] . "'>";
        echo "<label>" . $materia['nombreMateria'] . " (" . $materia['nombreArea'] . ")</label>";
        echo "</div>";
    }
    echo "<input type='submit' value='Inscribir'>";
    echo "</form>";
} else {
    echo "No hay materias disponibles para este plan y módulo.";
}
?>