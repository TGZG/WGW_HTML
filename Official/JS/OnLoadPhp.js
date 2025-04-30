//页面加载完成后初始化所有功能
document.addEventListener("DOMContentLoaded", () => {
    const preorderLinks = document.querySelectorAll('a.preorder-button');
    if (!preorderLinks.length) return;

    preorderLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Create modal overlay
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;';

            // Create form container
            const formContainer = document.createElement('div');
            formContainer.style.cssText = 'background:white;padding:20px;border-radius:8px;width:90%;max-width:400px;';
            modal.appendChild(formContainer);

            // Determine form type based on link class
            // console.log(Array.from(link.classList));
            // console.log(1);
            const formType = link.classList.contains('online') ? '官网联机版预约' :
                link.classList.contains('dlc') ? '大争之世DLC预约' : '单机模式预约';

            const phpEndpoint = link.classList.contains('online') ? 'PHP/index.php' : link.classList.contains('dlc') ? 'PHP/dlc.php' : 'PHP/danji.php';

            // Create form HTML
            formContainer.innerHTML = `
        <form id="preorder-form">
          <h3 style="margin-bottom:20px;color:#4e7cff;">${formType}</h3>
          <div style="margin-bottom:15px;">
            <label for="name" style="color: black;">昵称（选填）:</label>
            <input type="text" id="name" name="name" style="width:100%;padding:8px;margin-top:5px;border:1px solid #ddd;border-radius:4px;">
          </div>
          <div style="margin-bottom:15px;">
            <label for="email" style="color: black;">电子邮箱*:</label>
            <input type="email" id="email" name="email" required style="width:100%;padding:8px;margin-top:5px;border:1px solid #ddd;border-radius:4px;">
            <span class="error-message" style="color:red;font-size:12px;display:none;">请输入有效的邮箱地址</span>
          </div>
          <div style="margin-bottom:15px;">
            <label for="phone" style="color: black;">手机号码*:</label>
            <input type="tel" id="phone" name="phone" required style="width:100%;padding:8px;margin-top:5px;border:1px solid #ddd;border-radius:4px;">
            <span class="error-message" style="color:red;font-size:12px;display:none;">请输入有效的手机号码</span>
          </div>
          <button class="update" type="submit"  style="width:100%;padding:10px;background-color:#4e7cff;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">提交预约</button>
          <button type="button" class="close-modal" style="width:100%;padding:10px;background-color:#ddd;color:#333;border:none;border-radius:4px;cursor:pointer;margin-top:10px;font-weight:bold;">取消</button>
        </form>
      `;

            // 获取所有类名为 'update' 的按钮
            // formContainer.addEventListener('click', function(e) {
            //   if(e.target && e.target.classList.contains('update')) {
            //     e.preventDefault(); // 阻止表单默认提交
            //     // 你的逻辑代码
            //     getUserCount('单机.txt', '.reservation-counter');
            //     getUserCount('DLC.txt', '.DLC');
            //     getUserCount('online.txt', '.Online');

            //     // 注意：location.reload()会立即刷新，可能来不及执行上面的函数
            //     setTimeout(() => location.reload(), 100); // 延迟100ms确保函数执行
            //   }
            // });

            // Add modal to page
            document.body.appendChild(modal);

            // Close button handler
            const closeButton = modal.querySelector('.close-modal');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Form submission handler
            const form = modal.querySelector('#preorder-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const email = formData.get('email');
                const phone = formData.get('phone');

                // Reset error messages
                form.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

                // Validate email and phone
                let isValid = true;

                if (!validateEmail(email)) {
                    const emailError = form.querySelector('#email').nextElementSibling;
                    emailError.style.display = 'block';
                    isValid = false;
                }

                if (!validatePhone(phone)) {
                    const phoneError = form.querySelector('#phone').nextElementSibling;
                    phoneError.style.display = 'block';
                    isValid = false;
                }

                if (!isValid) return;

                // Submit form if validation passes
                fetch("./"+phpEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        phone: formData.get('phone')
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('预约成功！');
                            document.body.removeChild(modal);
                            getUserCount('单机', '.reservation-counter');
                            getUserCount('DLC', '.DLC');
                            getUserCount('online', '.Online');

                        } else {
                            alert(data.message || '该用户已预约过，请勿重复预约');
                        }
                    }).then(() => { location.reload(); })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('提交失败，请稍后再试');
                    });
            });
        });
    });
});
//辅助函数
function validateEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
function validatePhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
}
// 使用fetch发起请求
// function getUserCount(string) {
//     var fileName = 'userCount_singleMachine.php';

//     fetch(fileName, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'text/plain'
//         },
//         body: string
//     }).then(response => response.text())  // 将响应转换为文本
//         .then(data => {
//             // 将返回的字符串转换为整数
//             var userCount_singleMachine = parseInt(data);
//             var reservationCounter = document.querySelector('.reservation-counter');
//             reservationCounter.textContent = '预约人数：' + userCount_singleMachine.toString() + '人';
//             // 在这里可以使用userCount变量
//             // console.log('预约人数：', userCount_singleMachine );
//         })
//         .catch(error => { console.error('获取预约人数时出错：', error); });
// }

//本函数用于获取所有的模式的预约人数，并将其显示在页面上，并不只是获取单机模式的预约人数。因为代码是一坨屎山，所以我也不敢改名字，怕引起bug。

function getUserCount(url, className) {

    var userCount_singleMachine = 0;
    fetch('./PHP/userCount_singleMachine.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: url
    })
        .then(response => response.text())  // 将响应转换为文本
        .then(data => {
            // 将返回的字符串转换为整数
            userCount_singleMachine = parseInt(data);
            var reservationCounter = document.querySelector(className);
            reservationCounter.textContent = '预约人数：' + userCount_singleMachine.toString() + '人';
            // 在这里可以使用userCount变量
            // console.log('预约人数：', userCount_singleMachine );
        })
        .catch(error => {
            console.error('获取预约人数时出错：', error);
        });
}
getUserCount('单机', '.reservation-counter');
getUserCount('DLC', '.DLC');
getUserCount('online', '.Online');