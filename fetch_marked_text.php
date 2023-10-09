<?php
$servername = "marking-db.cccnwlhhyhlh.us-east-1.rds.amazonaws.com";
$username = "admin";
$password = "Marking123";
$dbname = "Scribii";

// Create a connection to the MySQL database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch the latest marked text from the Marked_Text table
$query = "SELECT Metrics FROM Marked_Text ORDER BY Marked_Text_id DESC LIMIT 1";
$result = $conn->query($query);

// Check if a result was returned
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row["Metrics"];
} else {
    echo "No marked text found.";
}

// Close the database connection
$conn->close();
?>
