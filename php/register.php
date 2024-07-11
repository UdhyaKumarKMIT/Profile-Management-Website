<?php
require 'vendor/autoload.php'; // Include Composer's autoloader for MongoDB

// MySQL connection details
$servername = "localhost";
$db_username = "root";
$db_password = "";
$dbname = "guvi";

// Create MySQL connection
$conn = new mysqli($servername, $db_username, $db_password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create MongoDB connection
$client = new MongoDB\Client("mongodb://localhost:27017");
$collection = $client->guvi->user_profile;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $username = $_POST['username'];
    $dob = $_POST['DOB'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $re_password = $_POST['re_password'];

    // Validate data
    if ($password !== $re_password) {
        echo "Passwords do not match";
        exit();
    }

    // Check if username already exists in MySQL
    $sql = "SELECT * FROM users WHERE username = ?";
    $prepared = $conn->prepare($sql);
    $prepared->bind_param('s', $username);
    $prepared->execute();
    $result = $prepared->get_result();

    if ($result->num_rows > 0) {
        echo "Username already exists";
        $prepared->close();
        $conn->close();
        exit();
    }

    // Check if email already exists in MySQL
    $sql = "SELECT * FROM users WHERE email = ?";
    $prepared = $conn->prepare($sql);
    $prepared->bind_param('s', $email);
    $prepared->execute();
    $result = $prepared->get_result();

    if ($result->num_rows > 0) {
        echo "Email already registered";
        $prepared->close();
        $conn->close();
        exit();
    }

    // Insert into MySQL
    $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $prepared = $conn->prepare($sql);
    $hashed_password = password_hash($password, PASSWORD_BCRYPT); // Hash the password
    $prepared->bind_param('sss', $username, $email, $hashed_password);

    if ($prepared->execute()) {
        // Insert into MongoDB
        $profileData = [
            'firstname' => $firstname,
            'lastname' => $lastname,
            'dob' => $dob,
            'phone' => $phone,
            'email' => $email
        ];
        $insertOneResult = $collection->insertOne($profileData);

        if ($insertOneResult->getInsertedCount() == 1) {
            echo "Registration successful";
        } else {
            echo "Failed to store profile in MongoDB";
        }
    } else {
        echo "Registration failed";
    }

    $prepared->close();
}

$conn->close();
?>
