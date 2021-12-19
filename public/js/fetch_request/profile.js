let headersList = {
    "Accept": "*/*",
    "token": localStorage.acesstoken,
    "Content-Type": "application/x-www-form-urlencoded"
}
fetch("/member/user/info", {
    method: "GET",
    headers: headersList
}).then(function(response) {
    if (response.status === 200);
    else {
        console.log('error: ' + response);
        Swal.fire({
            icon: 'error',
            title: '發生錯誤',
            text: response.status
        })
    }
    return response.text();
}).then(function(data) {
    data = JSON.parse(data);
    if (data.code) {
        document.getElementById('img').src = "https://www.w3schools.com/bootstrap4/img_avatar" + random(1, 6) + ".png";
        document.getElementById('name').innerText = data.result.name;
        document.getElementById('email').innerHTML = data.result.email + ((data.result.verify) ? ' (已驗證)' : ' <a href="/templates/verify">驗證信箱</a>');
        document.getElementById('create').innerText = "創建時間：" + data.result.create;
        document.getElementById('update').innerText = "上次更新：" + data.result.update;
        document.getElementById('loader').classList.remove('is-active');
    } else Swal.fire({
        icon: 'error',
        title: data.status,
        text: data.result
    }).then(() => {
        if (data.result === "請重新登入") {
            localStorage.removeItem('acesstoken');
            window.location.href = '/templates/login';
        }
    });
    console.log(data);
})

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
};