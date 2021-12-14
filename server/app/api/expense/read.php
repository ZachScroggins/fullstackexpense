<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../../config/Database.php';
include_once '../../../models/Expense.php';

$database = new Database();
$db = $database->connect();

$expense = new Expense($db);

$result = $expense->read();

$num = $result->rowCount();

if ($num > 0) {
    $expenses_arr = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $expense_item = array(
            'id' => $expense_id,
            'description' => $description,
            'amount' => $amount,
            'employee_id' => $employee_id,
            'employee_name' => $employee_name
        );

        array_push($expenses_arr, $expense_item);
    }

    echo json_encode($expenses_arr);
} else {
    echo json_encode(
        array('message' => 'expenses not found')
    );
}
