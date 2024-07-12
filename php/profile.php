<?php
session_start();
             
require 'vendor/autoload.php'; // Include MongoDB client library

use MongoDB\Client as MongoClient;

// MongoDB connection
$mongoClient = new MongoClient("mongodb://localhost:27017");

$db = $mongoClient->guvi;
$collection = $db->user_profile;



require 'vendor/autoload.php'; // Autoload Predis library
$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => '127.0.0.1',
    'port'   => 6379,
]);

  $sid=$_POST['sid'];
  
    if ($redis->exists($sid)) {
        $user_data = $redis->hgetall($sid);
        $email = $user_data['email'];
        $user = $user_data['username'];

    }  


if (isset($_POST['formaction']))
{
    $formaction=$_POST['formaction'];

    if($formaction === 'update_details'){

    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $phone = $_POST['phone'];
    $dob = $_POST['dob'];
    $address = $_POST['address'];

    // Update the user's profile details
    $result = $collection->updateOne(
        ['email' => $email],
        ['$set' => [
            'firstname' => $firstname,
            'lastname' => $lastname,
            'phone' => $phone,
            'dob' => $dob,
            'address' => $address
        ]]
    );

    if ($result->getModifiedCount() === 1) {
       
$user = $collection->findOne(['email' => $email]);
        echo json_encode([
            'status' => 'success',
            'data' => $user,
            'message' => 'Profile updated successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Profile update failed'
        ]);
    }
    exit();

    }elseif ($formaction === 'add_project') {
        // Handle updating project details
        $projectId = $_POST['projectId']; // Assuming you pass the project ID via AJAX
        $projectTitle = $_POST['projectTitle'];
        $projectGithub = $_POST['projectGithub'];
        $projectDescription = $_POST['projectDescription'];
        
        $result = $collection->updateOne(
            ['email' => $email],
            ['$push' => [
                'projects' => [
                    'id' => $projectId,
                    'title' => $projectTitle,
                    'github' => $projectGithub,
                    'description' => $projectDescription
                ]
            ]]
        );

        if ($result->getModifiedCount() === 1) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Project updated successfully'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Project update failed'
            ]);
        }
        exit();
    }elseif ($formaction === 'delete_project') {
        $projectId = $_POST['projectId'];
        $projectTitle = $_POST['projectTitle'];
        
        // Delete the project from the array in MongoDB
        $result = $collection->updateOne(
            [
                'email' => $email,
                'projects' => [
                    '$elemMatch' => [
                        'id' => $projectId,
                        'title' => $projectTitle
                    ]
                ]
            ],
            ['$pull' => ['projects' => ['id' => $projectId, 'title' => $projectTitle]]]
        );
    
        if ($result->getModifiedCount() === 1) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Project deleted successfully'
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Project deletion failed'
            ]);
        }
        exit();
    }else{
    $value = $_POST['value'];

    if ($formaction === 'Updaterole') {
        $field = 'role';
    } elseif ($formaction === 'Updateinstitute') {
        $field = 'institute';
    } elseif ($formaction === 'Updatewebsite'){
        $field = 'website';
    } elseif ($formaction === 'Updategithub'){
        $field = 'github';
    } elseif ($formaction === 'Updateinstagram'){
        $field = 'instagram';
    }    

    $updateResult = $collection->updateOne(
        ['email' => $email],
        ['$set' => [$field => $value]]
    );

    if ($updateResult->getModifiedCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => ucfirst($field) . ' updated successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'No document updated'
        ]);
    }
    exit();
} 
}

$user = $collection->findOne(['email' => $email]);

if ($user) {
    echo json_encode([
        'status' => 'success',
        'data' => $user
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'User not found'
    ]);
}
?>
