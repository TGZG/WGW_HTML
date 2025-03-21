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



function getUserCount(url,className) {
    
    var userCount_singleMachine = 0;
    fetch('userCount_singleMachine.php',{
        method:'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body:url
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
getUserCount('单机.txt','.reservation-counter');
getUserCount('DLC.txt','.DLC');
getUserCount('online.txt','.Online');