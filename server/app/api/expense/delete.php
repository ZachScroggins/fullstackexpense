<?php

header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods');

  include_once '../../../config/Database.php';
  include_once '../../../models/Expense.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  $expense = new Expense($db);

  $data = json_decode(file_get_contents("php://input"));

$expense->expense_id = $data->expense_id;

if ($expense->delete()) {
    echo json_encode(
        array('message' => 'Expense Deleted')
    );
} else {
    echo json_encode(
        array('message' => 'Expense Not Deleted')
    );
}
