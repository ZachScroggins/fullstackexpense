<?php

class Expense
{
    // db
    private $conn;
    private $table = 'expenses';

    // expense properties
    public $expense_id;
    public $description;
    public $amount;
    public $employee_id;
    public $employee_name;
    public $created_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // get all expenses
    public function read()
    {
        $query = '
          SELECT w.name as employee_name, e.expense_id, e.description, e.amount, e.employee_id, e.created_at
          FROM ' . $this->table . ' e
          LEFT JOIN
            employees w ON e.employee_id = w.employee_id
          ORDER BY 
            e.created_at DESC
        ';

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        return $stmt;
    }

    public function read_single()
    {
        $query = '
          SELECT w.name as employee_name, e.expense_id, e.description, e.amount, e.employee_id, e.created_at
          FROM ' . $this->table . ' e
          LEFT JOIN
            employees w ON e.employee_id = w.employee_id
          WHERE
            e.expense_id = ?
          LIMIT 0,1
        ';

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $this->expense_id);

        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->expense_id = $row['expense_id'];
        $this->description = $row['description'];
        $this->amount = $row['amount'];
        $this->employee_id = $row['employee_id'];
        $this->employee_name = $row['employee_name'];
    }

    public function create()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET description = :description, amount = :amount, employee_id = :employee_id';

        $stmt = $this->conn->prepare($query);

        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->amount = htmlspecialchars(strip_tags($this->amount));
        $this->employee_id = htmlspecialchars(strip_tags($this->employee_id));

        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':amount', $this->amount);
        $stmt->bindParam(':employee_id', $this->employee_id);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function update()
    {
        $query = 'UPDATE ' . $this->table . '
        SET description = :description, amount = :amount, employee_id = :employee_id 
        WHERE expense_id = :expense_id
';

        $stmt = $this->conn->prepare($query);

        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->amount = htmlspecialchars(strip_tags($this->amount));
        $this->employee_id = htmlspecialchars(strip_tags($this->employee_id));
        $this->expense_id = htmlspecialchars(strip_tags($this->expense_id));

        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':amount', $this->amount);
        $stmt->bindParam(':employee_id', $this->employee_id);
        $stmt->bindParam(':expense_id', $this->expense_id);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE expense_id = :expense_id';


        $stmt = $this->conn->prepare($query);

        $this->expense_id = htmlspecialchars(strip_tags($this->expense_id));

        $stmt->bindParam(':expense_id', $this->expense_id);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}
