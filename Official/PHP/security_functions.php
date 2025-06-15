<?php
// 安全函数库 - 用于预约系统的安全防护

/**
 * 输入数据清理和验证
 */
function sanitizeInput($input, $type = 'text') {
    if (empty($input)) {
        return '';
    }
    
    // 基础清理
    $input = trim($input);
    $input = stripslashes($input);
    
    switch ($type) {
        case 'name':
            // 昵称：移除HTML标签，限制长度，只允许中英文、数字、常见符号
            $input = strip_tags($input);
            $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
            $input = preg_replace('/[^\p{L}\p{N}\s\-_\.]/u', '', $input); // 只保留字母、数字、空格、连字符、下划线、点
            $input = mb_substr($input, 0, 20, 'UTF-8'); // 限制20个字符
            break;
            
        case 'email':
            // 邮箱：使用PHP内置过滤器
            $input = filter_var($input, FILTER_SANITIZE_EMAIL);
            if (!filter_var($input, FILTER_VALIDATE_EMAIL)) {
                return false;
            }
            break;
            
        case 'phone':
            // 手机号：只保留数字
            $input = preg_replace('/[^0-9]/', '', $input);
            if (!preg_match('/^1[3-9]\d{9}$/', $input)) {
                return false;
            }
            break;
            
        default:
            // 默认文本处理
            $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
            break;
    }
    
    return $input;
}

/**
 * 频率限制检查
 */
function checkRateLimit($identifier, $maxAttempts = 3, $timeWindow = 300) {
    $rateLimitFile = '../Data/rate_limit.json';
    $currentTime = time();
    
    // 读取现有的限制记录
    $rateLimits = [];
    if (file_exists($rateLimitFile)) {
        $content = file_get_contents($rateLimitFile);
        $rateLimits = json_decode($content, true) ?: [];
    }
    
    // 清理过期记录
    foreach ($rateLimits as $key => $data) {
        if ($currentTime - $data['first_attempt'] > $timeWindow) {
            unset($rateLimits[$key]);
        }
    }
    
    // 检查当前标识符的尝试次数
    if (isset($rateLimits[$identifier])) {
        $attempts = $rateLimits[$identifier];
        
        if ($attempts['count'] >= $maxAttempts) {
            $remainingTime = $timeWindow - ($currentTime - $attempts['first_attempt']);
            return [
                'allowed' => false,
                'remaining_time' => $remainingTime,
                'message' => "请求过于频繁，请在 {$remainingTime} 秒后重试"
            ];
        }
        
        // 增加尝试次数
        $rateLimits[$identifier]['count']++;
        $rateLimits[$identifier]['last_attempt'] = $currentTime;
    } else {
        // 首次尝试
        $rateLimits[$identifier] = [
            'count' => 1,
            'first_attempt' => $currentTime,
            'last_attempt' => $currentTime
        ];
    }
    
    // 保存更新后的限制记录
    file_put_contents($rateLimitFile, json_encode($rateLimits), LOCK_EX);
    
    return ['allowed' => true];
}

/**
 * 获取客户端IP地址
 */
function getClientIP() {
    $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
    
    foreach ($ipKeys as $key) {
        if (!empty($_SERVER[$key])) {
            $ips = explode(',', $_SERVER[$key]);
            $ip = trim($ips[0]);
            
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * 记录安全日志
 */
function logSecurityEvent($event, $details = []) {
    $logFile = '../Data/security.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = getClientIP();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $logEntry = [
        'timestamp' => $timestamp,
        'ip' => $ip,
        'user_agent' => $userAgent,
        'event' => $event,
        'details' => $details
    ];
    
    $logLine = json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n";
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}

/**
 * 验证请求来源（简单的CSRF防护）
 */
function validateReferer() {
    $allowedHosts = [
        'localhost',
        '127.0.0.1',
        // 添加您的域名
    ];
    
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if (empty($referer)) {
        return false;
    }
    
    $refererHost = parse_url($referer, PHP_URL_HOST);
    return in_array($refererHost, $allowedHosts);
}
?> 