<?php
header('Content-Type: text/plain; charset=utf-8');
if(isset($_GET['Title'])) {
  $requestedFile = $_GET['Title'];
  $filePath = __DIR__."/../MD/{$requestedFile}.md"; // 文件存储在指定目录

  if(file_exists($filePath)) {
    readfile($filePath);
  } else {
    http_response_code(404);
    echo "# 404\n> 请求的MD文件 {$filePath} 不存在";
  }
} else {
  http_response_code(400);
  echo "# 参数错误\n> 缺少 Title 参数";
}
?>
