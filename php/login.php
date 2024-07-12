<?php
session_start(); // Start the session
include 'config.php';

require 'vendor/autoload.php'; // Autoload Predis library
$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => '127.0.0.1',
    'port'   => 6379,
]);

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
        echo json_encode(['status' => 'error', 'message' => 'Username not registered']);
    } else {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $sid=session_id();// Use email as the key for Redis
            
            $redis->hset($sid, 'email', $row['email']);
            $redis->hset($sid, 'username', $row['username']);
            
           
            echo json_encode(['status' => 'success', 'sid' => session_id(), 'message' => 'Login successful']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Incorrect password']);
        }
    }
    $prepared->close();
}

$conn->close();
?>
