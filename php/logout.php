<?php


session_start(); // Start the session
include 'config.php';

require 'vendor/autoload.php'; // Autoload Predis library
$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => '127.0.0.1',
    'port'   => 6379,
]);

// Assuming you pass the session ID via POST or other means
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sid = $_POST['sid'];

    // Check if the session exists in Redis
    if ($redis->exists($sid)) {
        // Delete the session data from Redis
        $redis->del($sid);

        // Optionally, you can perform additional logout tasks here
        session_unset();     // unset $_SESSION variable for the run-time 
        session_destroy();   // destroy session data in storage

        // Return a JSON response indicating success
        echo json_encode(['status' => 'success', 'message' => 'Logged out successfully']);
    } else {
        // Return a JSON response if session is not found
        echo json_encode(['status' => 'error', 'message' => 'Session not found']);
    }
} else {
    // Return a JSON response for invalid requests
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
