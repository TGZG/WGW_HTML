// 前端安全增强脚本
// 用于预约系统的客户端安全防护

/**
 * 增强的输入验证函数
 */
const SecurityValidator = {
    // 昵称验证：限制长度和字符类型
    validateName: function(name) {
        if (!name) return true; // 昵称是可选的
        
        // 长度检查
        if (name.length > 20) {
            return { valid: false, message: '昵称不能超过20个字符' };
        }
        
        // 字符类型检查：只允许中英文、数字、常见符号
        const namePattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_\.]+$/;
        if (!namePattern.test(name)) {
            return { valid: false, message: '昵称只能包含中英文、数字、空格、连字符、下划线和点' };
        }
        
        // 检查是否包含潜在的恶意内容
        const dangerousPatterns = [
            /<script/i, /<\/script>/i, /javascript:/i, /on\w+=/i,
            /<iframe/i, /<object/i, /<embed/i, /<link/i,
            /eval\(/i, /alert\(/i, /confirm\(/i, /prompt\(/i
        ];
        
        for (let pattern of dangerousPatterns) {
            if (pattern.test(name)) {
                return { valid: false, message: '昵称包含不允许的内容' };
            }
        }
        
        return { valid: true };
    },
    
    // 增强的邮箱验证
    validateEmail: function(email) {
        if (!email) {
            return { valid: false, message: '邮箱地址不能为空' };
        }
        
        // 基础格式检查
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            return { valid: false, message: '请输入有效的邮箱地址' };
        }
        
        // 长度检查
        if (email.length > 100) {
            return { valid: false, message: '邮箱地址过长' };
        }
        
        // 检查常见的一次性邮箱域名
        const disposableEmailDomains = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'mailinator.com', 'yopmail.com'
        ];
        
        const domain = email.split('@')[1];
        if (disposableEmailDomains.includes(domain.toLowerCase())) {
            return { valid: false, message: '请使用常用邮箱地址' };
        }
        
        return { valid: true };
    },
    
    // 增强的手机号验证
    validatePhone: function(phone) {
        if (!phone) {
            return { valid: false, message: '手机号码不能为空' };
        }
        
        // 移除所有非数字字符
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        
        // 中国大陆手机号格式检查
        const phonePattern = /^1[3-9]\d{9}$/;
        if (!phonePattern.test(cleanPhone)) {
            return { valid: false, message: '请输入有效的手机号码' };
        }
        
        return { valid: true, cleanValue: cleanPhone };
    }
};

/**
 * 防重复提交管理器
 */
const SubmissionManager = {
    submitting: false,
    lastSubmissionTime: 0,
    minInterval: 3000, // 最小提交间隔3秒
    
    canSubmit: function() {
        const now = Date.now();
        
        if (this.submitting) {
            return { allowed: false, message: '正在提交中，请稍候...' };
        }
        
        if (now - this.lastSubmissionTime < this.minInterval) {
            const remaining = Math.ceil((this.minInterval - (now - this.lastSubmissionTime)) / 1000);
            return { allowed: false, message: `请等待 ${remaining} 秒后再试` };
        }
        
        return { allowed: true };
    },
    
    startSubmission: function() {
        this.submitting = true;
        this.lastSubmissionTime = Date.now();
    },
    
    endSubmission: function() {
        this.submitting = false;
    }
};

/**
 * 安全的表单提交函数
 */
function secureFormSubmit(formData, endpoint, onSuccess, onError) {
    // 检查是否可以提交
    const submitCheck = SubmissionManager.canSubmit();
    if (!submitCheck.allowed) {
        onError(submitCheck.message);
        return;
    }
    
    // 开始提交
    SubmissionManager.startSubmission();
    
    // 验证所有输入
    const nameValidation = SecurityValidator.validateName(formData.name);
    const emailValidation = SecurityValidator.validateEmail(formData.email);
    const phoneValidation = SecurityValidator.validatePhone(formData.phone);
    
    if (!nameValidation.valid) {
        SubmissionManager.endSubmission();
        onError(nameValidation.message);
        return;
    }
    
    if (!emailValidation.valid) {
        SubmissionManager.endSubmission();
        onError(emailValidation.message);
        return;
    }
    
    if (!phoneValidation.valid) {
        SubmissionManager.endSubmission();
        onError(phoneValidation.message);
        return;
    }
    
    // 清理数据
    const cleanData = {
        name: formData.name ? formData.name.trim() : '',
        email: formData.email.trim().toLowerCase(),
        phone: phoneValidation.cleanValue
    };
    
    // 发送请求
    fetch("./" + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        SubmissionManager.endSubmission();
        
        if (data.success) {
            onSuccess(data);
        } else {
            onError(data.message || '提交失败，请稍后再试');
        }
    })
    .catch(error => {
        SubmissionManager.endSubmission();
        console.error('提交错误:', error);
        
        if (error.message.includes('429')) {
            onError('请求过于频繁，请稍后再试');
        } else {
            onError('网络错误，请检查网络连接后重试');
        }
    });
}

/**
 * 输入框实时验证
 */
function addRealTimeValidation(form) {
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    
    // 昵称实时验证
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            const validation = SecurityValidator.validateName(this.value);
            const errorElement = this.parentNode.querySelector('.error-message');
            
            if (!validation.valid) {
                errorElement.textContent = validation.message;
                errorElement.style.display = 'block';
                this.style.borderColor = '#e74c3c';
            } else {
                errorElement.style.display = 'none';
                this.style.borderColor = '#ddd';
            }
        });
    }
    
    // 邮箱实时验证
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const validation = SecurityValidator.validateEmail(this.value);
            const errorElement = this.parentNode.querySelector('.error-message');
            
            if (!validation.valid) {
                errorElement.textContent = validation.message;
                errorElement.style.display = 'block';
                this.style.borderColor = '#e74c3c';
            } else {
                errorElement.style.display = 'none';
                this.style.borderColor = '#ddd';
            }
        });
    }
    
    // 手机号实时验证
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const validation = SecurityValidator.validatePhone(this.value);
            const errorElement = this.parentNode.querySelector('.error-message');
            
            if (!validation.valid) {
                errorElement.textContent = validation.message;
                errorElement.style.display = 'block';
                this.style.borderColor = '#e74c3c';
            } else {
                errorElement.style.display = 'none';
                this.style.borderColor = '#ddd';
            }
        });
    }
}

// 导出函数供其他脚本使用
window.SecurityValidator = SecurityValidator;
window.SubmissionManager = SubmissionManager;
window.secureFormSubmit = secureFormSubmit;
window.addRealTimeValidation = addRealTimeValidation; 