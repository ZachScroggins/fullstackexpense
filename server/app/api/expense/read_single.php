<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../../config/Database.php';
include_once '../../../models/Expense.php';

$database = new Database();
$db = $database->connect();

$expense = new Expense($db);

$expense->expense_id = isset($_GET['expense_id']) ? $_GET['expense_id'] : die();

$expense->read_single();

$expense_arr = array(
    'id' => $expense->expense_id,
    'description' => $expense->description,
    'amount' => $expense->amount,
    'employee_id' => $expense->employee_id,
    'employee_name' => $expense->employee_name
);

echo json_encode($expense_arr);
