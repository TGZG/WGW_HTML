<?php
header('Content-Type: application/json');

$file = 'DLC.txt';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 检查用户是否存在的函数
function checkUserExists($email, $phone, $file) {
    if (!file_exists($file)) {
        return false;
    }
    
    $users = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($users as $user) {
        $userData = explode('|', $user);
        if (count($userData) >= 3) {
            $userEmail = $userData[2];
            $userPhone = $userData[1];
            
            if ($userEmail === $email || $userPhone === $phone) {
                return true;
            }
        }
    }
    return false;
}

// Check if email and phone exist first
if (isset($data['email']) && isset($data['phone']) && !isset($data['name'])) {
    try {
        if (!$data) {
            throw new Exception("无效的JSON数据");
        }
        
        $email = $data['email'];
        $phone = $data['phone'];
        
        $exists = checkUserExists($email, $phone, $file);
        echo json_encode(['exists' => $exists]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else if (isset($data['name']) && isset($data['email']) && isset($data['phone'])) {
    try {
        if (!$data) {
            throw new Exception("无效的JSON数据");
        }
        
        $name = $data['name'] ?: '';
        $phone = $data['phone'];
        $email = $data['email'];
        
        // 检查用户是否已存在
        if (checkUserExists($email, $phone, $file)) {
            echo json_encode([
                'success' => false,
                'message' => '用户已存在'
            ]);
            exit;
        }
        
        $userData = "$name|$phone|$email|" . date('Y-m-d H:i:s') . "\n";
        
        if (file_put_contents($file, $userData, FILE_APPEND | LOCK_EX)) {
            echo json_encode([
                'success' => true,
                'message' => '用户信息已成功保存'
            ]);
        } else {
            throw new Exception("保存用户信息失败");
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '无效的请求格式'
    ]);
}
?>
