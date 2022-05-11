function checkInputFn(email, phone) {
    let oemail = document.getElementById('email').value;
    let ophone = document.getElementById('phone').value;
    if (oemail) validFn('email', email);
    if (ophone) validFn('phone', phone);
}
getInfoFn();

function getInfoFn() {
    let urlparm = window.location.href;
    if (window.location.href.split('?')[1]) {
        urlparm = window.location.href.split('?')[1];
        if (urlparm.split('&')[0].split('=')[0] == "refresh_token")
            if (urlparm.split('&')[0].split('=')[1] != "")
                localStorage.setItem('refresh_token', urlparm.split('&')[0].split('=')[1]);
    }

    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    fetch("/member/user/info", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200);
        else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return getInfoFn();
        } else {
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            });
        }
        return response.text();
    }).then(function(data) {
        data = JSON.parse(data);
        document.getElementById('loader').classList.remove('is-active');
        if (data.code) {
            if (!data.result.picture) {
                let oimg;
                if (data.result.gender === "男") oimg = random(1, 3);
                else if (data.result.gender === "女") oimg = random(4, 6);
                else oimg = random(1, 6);
                document.getElementById('img').src = "https://www.w3schools.com/bootstrap4/img_avatar" + oimg + ".png";
            } else document.getElementById('img').src = data.result.picture;
            if (data.result.role) localStorage.setItem('role', JSON.stringify(data.result.role));
            if (data.result.name) document.getElementById('name').innerText = data.result.name;
            if (data.result.email) document.getElementById('email').value = data.result.email;
            if (data.result.phone) document.getElementById('phone').value = data.result.phone;
            if (data.result.gender) document.getElementById('gender').options[0].innerText = data.result.gender;
            if (data.result.birthday) document.getElementById('birthday').value = data.result.birthday;
            if (data.result.create) document.getElementById('create').innerText = "創建時間：" + data.result.create;
            if (data.result.update) document.getElementById('update').innerText = "上次更新：" + data.result.update;
            checkInputFn(data.result.verityCode, false);
        } else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        }).then(() => {
            if (data.result === "請重新登入") {
                localStorage.removeItem('acesstoken');
                localStorage.removeItem('refresh_token');
                window.location.href = '/admin/login';
            }
        });
        //console.log(data);
    })
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};