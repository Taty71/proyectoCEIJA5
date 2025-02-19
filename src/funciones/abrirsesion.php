<?php
session_start();
if(empty($_SESSION['USER_Nombre']))
{
  header('Location: funciones/cerrarsesion.php');
}
?>