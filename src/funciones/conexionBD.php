<?php
function conectarDB($Host = 'localhost',$User = 'root',$Password = '',$BaseDeDatos = 'ceija5')
{    
    $linkConexion = mysqli_connect($Host, $User, $Password, $BaseDeDatos);
    
    if ($linkConexion)
    {
        return $linkConexion;
    }
    else
    {
        die ('No se puedo conectar con la base de datos.');
    }
}
?>