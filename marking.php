<?php
$servername = "marking-db.cccnwlhhyhlh.us-east-1.rds.amazonaws.com";
$username = "admin";
$password = "Marking123";
$dbname = "Scribii";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch the text content
$text_content = $_POST['text_input'];

// Split the text into sentences using the enhanced regex
$sentences = preg_split('/(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])\s+(?=")|(?<=\s)\n\s*/', $text_content, -1, PREG_SPLIT_NO_EMPTY);

// Send the text content to the Lambda function through API Gateway
$data = array("text_input" => $text_content);
$data_string = json_encode($data);

$ch = curl_init('https://bz8n1yttnf.execute-api.us-east-1.amazonaws.com/Test/analyze');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string))
);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    die('Error:' . curl_error($ch));
}
curl_close($ch);

// Convert JSON result to an array
$result_array = json_decode($result, true);
$body_content = json_decode($result_array['body'], true);

$sentence_beginnings = $body_content['Sentence Beginngings'][0];
$pos_tags = $body_content['Sentence Beginngings'][1];

$highlighted_text = "<p>";

$color_map = [
    "IN" => "rgb(255, 182, 193)",
    "RB" => "rgb(255, 215, 0)",
    "NNP" => "rgb(173, 216, 230)",
    "WDT" => "rgb(255, 99, 71)",
    "WRB" => "rgb(255, 99, 71)",
    "PRP" => "rgb(152, 251, 152)"
];

foreach ($sentences as $index => $sentence) {
    $beginning = $sentence_beginnings[$index];
    $current_pos = $pos_tags[$index][0];
    if (isset($color_map[$current_pos])) {
        $highlighted_sentence = str_replace($beginning, '<span style="background-color: ' . $color_map[$current_pos] . ';">' . $beginning . '</span>', $sentence);
        $highlighted_text .= $highlighted_sentence . ' ';
    } else {
        $highlighted_text .= $sentence . ' ';
    }
}

$highlighted_text .= "</p>";

// Insert the text content and Lambda function response into the database
$stmt = $conn->prepare("INSERT INTO Marked_Text (Marked_content, Metrics) VALUES (?, ?)");
$stmt->bind_param("ss", $text_content, $highlighted_text);

if (!$stmt->execute()) {
    die("Error: " . $stmt->error);
}

$stmt->close();
$conn->close();

// Redirect to annotation.html
header("Location: annotation.html");
exit;
?>
