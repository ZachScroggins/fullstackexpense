<?php

class Employee
{
    // db
    private $conn;
    private $table = 'employees';

    public $employee_id;
    public $employee_name;

    public function __construct($db)
    {
        $this->conn = $db;
    }
}
