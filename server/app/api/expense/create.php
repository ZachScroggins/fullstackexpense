<?php

header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods');

  $method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header("HTTP/1.1 200 OK");
    die();
}

  include_once '../../../config/Database.php';
  include_once '../../../models/Expense.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  $expense = new Expense($db);

  $data = json_decode(file_get_contents("php://input"));

$expense->description = $data->description;
$expense->amount = $data->amount;
$expense->employee_id = $data->employee_id;

if ($expense->create()) {
    echo json_encode(
        array('message' => 'Expense Created')
    );
} else {
    echo json_encode(
        array('message' => 'Expense Not Created')
    );
}
