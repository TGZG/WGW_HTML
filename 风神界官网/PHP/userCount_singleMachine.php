<?php
header("Content-Type: text/plain"); // 响应纯文本

$data = file_get_contents('php://input');
// echo "接收到的数据：" . $data;
// Read the content of the file
$content = file_get_contents("../Data/".$data.".txt");

// Count the number of lines (users)
$userCount = substr_count($content, "\n");

// If the file doesn't end with a newline, add 1 to count the last user
if (strlen($content) > 0 && substr($content, -1) !== "\n") {
    $userCount++;
}

// Output the count
echo $userCount;