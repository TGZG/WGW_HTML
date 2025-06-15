<?php
header('Content-Type: application/json');

// 引入安全函数库
require_once 'security_functions.php';

$file = '../Data/单机.txt';

// 获取客户端IP
$clientIP = getClientIP();

// 记录请求开始
logSecurityEvent('request_start', [
    'endpoint' => '单机预约',
    'ip' => $clientIP,
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
]);

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

try {
    // 1. 频率限制检查
    $rateCheck = checkRateLimit($clientIP, 3, 300); // 5分钟内最多3次
    if (!$rateCheck['allowed']) {
        logSecurityEvent('rate_limit_exceeded', [
            'ip' => $clientIP,
            'remaining_time' => $rateCheck['remaining_time']
        ]);
        
        echo json_encode([
            'success' => false,
            'message' => $rateCheck['message']
        ]);
        exit;
    }

    // 2. 获取和验证输入数据
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        throw new Exception("无效的JSON数据");
    }

    // Check if email and phone exist first
    if (isset($data['email']) && isset($data['phone']) && !isset($data['name'])) {
        $email = sanitizeInput($data['email'], 'email');
        $phone = sanitizeInput($data['phone'], 'phone');
        
        if ($email === false || $phone === false) {
            throw new Exception("数据格式无效");
        }
        
        $exists = checkUserExists($email, $phone, $file);
        echo json_encode(['exists' => $exists]);
        
    } else if (isset($data['name']) && isset($data['email']) && isset($data['phone'])) {
        // 3. 数据清理和验证
        $name = sanitizeInput($data['name'] ?: '', 'name');
        $email = sanitizeInput($data['email'], 'email');
        $phone = sanitizeInput($data['phone'], 'phone');

        // 验证结果检查
        if ($email === false) {
            logSecurityEvent('invalid_email', ['ip' => $clientIP, 'email' => $data['email']]);
            throw new Exception("邮箱格式无效");
        }

        if ($phone === false) {
            logSecurityEvent('invalid_phone', ['ip' => $clientIP, 'phone' => $data['phone']]);
            throw new Exception("手机号格式无效");
        }

        // 4. 文件锁定保护（防止并发竞争）
        $lockFile = '../Data/danji.lock';
        $lockHandle = fopen($lockFile, 'w');
        
        if (!flock($lockHandle, LOCK_EX)) {
            logSecurityEvent('file_lock_failed', ['ip' => $clientIP]);
            throw new Exception("系统繁忙，请稍后重试");
        }

        try {
            // 5. 检查用户是否已存在
            if (checkUserExists($email, $phone, $file)) {
                logSecurityEvent('duplicate_user', [
                    'ip' => $clientIP,
                    'email' => $email,
                    'phone' => $phone
                ]);
                
                echo json_encode([
                    'success' => false,
                    'message' => '该用户已预约过，请勿重复预约'
                ]);
                exit;
            }

            // 6. 保存用户数据
            $userData = "$name|$phone|$email|" . date('Y-m-d H:i:s') . "|$clientIP\n";
            
            if (file_put_contents($file, $userData, FILE_APPEND | LOCK_EX)) {
                logSecurityEvent('registration_success', [
                    'ip' => $clientIP,
                    'email' => $email,
                    'phone' => $phone
                ]);
                
                echo json_encode([
                    'success' => true,
                    'message' => '用户信息已成功保存'
                ]);
            } else {
                throw new Exception("保存用户信息失败");
            }

        } finally {
            // 7. 释放文件锁
            flock($lockHandle, LOCK_UN);
            fclose($lockHandle);
        }
    } else {
        throw new Exception("无效的请求格式");
    }

} catch (Exception $e) {
    logSecurityEvent('error', [
        'ip' => $clientIP,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
