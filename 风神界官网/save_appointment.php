<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 获取 JSON 格式的 POST 数据
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $data = $date . '|' . $name . '|' . $email . PHP_EOL;
    file_put_contents('单机预约.txt', $data, FILE_APPEND);
    
    header('Location: index.html');
    exit();
}
?>