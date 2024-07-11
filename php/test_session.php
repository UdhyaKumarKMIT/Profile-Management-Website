<?php
// Correct path to the Autoloader.php file
require 'vendor/autoload.php';

Predis\Autoloader::register();

try {
    // Create a new Predis client
    $client = new Predis\Client([
        'scheme' => 'tcp', // Corrected the scheme to 'tcp'
        'host' => '127.0.0.1',
        'port' => 6379
    ]);

    // Set and get PHP version in Redis
    $client->set('php_version', phpversion());
    $value = $client->get('php_version');
    echo "PHP Version is :: " . $value;
} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}
?>
