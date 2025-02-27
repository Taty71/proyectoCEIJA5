<?php
//Importo funcion de conexion a la base de datos
require_once 'funciones/ConexionDB.php';

//Retorna una lista de todos os alumnos registrados bajo ningun criterio
function listarEstudiantes()
{
    //Creo una conexion a la base de datos
    $ConexionDB= conectarDB();

    if ($ConexionDB)
    {
        //Creo un array vacio
        $Datos = array();

        //Estructuro la consulta SQL
        $SQL_Select =  "SELECT *
                        FROM usuario";

        //Guardo el resultado de la consulta
        $result =  mysqli_query($ConexionDB, $SQL_Select);

        //Corroboro que la consulta se realizo bien
        if($result != false){

            //Guardo el resultado de la consulta en una variable
            $data = mysqli_fetch_assoc($result);

            //Corroboro que la variable tiene datos
            if (!empty($data))
            {
                //Corroboro que el ususario se encuentre activo
                               
            }
            else
            {
                //Datos no encontrados
                $Datos['mensajeError'] = "Datos vacios."; 
            }
        }
        else
        {
            //Consulta fallida
            $Datos['mensajeError'] = "Fallo de consulta. Intente nuevamente en unos minutos."; 
        }               
    }
    else
    {
        //Conexion fallida
        $Datos['mensajeError'] = "Fallo de conexion. Intente nuevamente en unos minutos."; 
    }

    //Cierro la conexion
    mysqli_close($ConexionDB);

    return $Datos;
}

//TO DO

?>