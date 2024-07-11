<?php
session_start(); // Start the session
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['user'];
    $email =$_POST['user'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ? or email = ?";
    $prepared = $conn->prepare($sql);
    $prepared->bind_param('ss', $username,$email); 
    $prepared->execute();
    $result = $prepared->get_result();

    if ($result->num_rows == 0) {
        echo "Username not registered";
    } else {
        $row = $result->fetch_assoc();
        if (password_verify($password,$row['password'])) {
            $_SESSION['email'] = $row['email']; 
            echo "Login successful";
        } else {
            echo "Incorrect password";
        }
    }
    $prepared->close();
}

$conn->close();
?>
