var fname;
var femail;
var fphone;
var fgender;
var fbirthday;

function editFn() {
    document.getElementById('email').disabled = false;
    document.getElementById('phone').disabled = false;
    document.getElementById('gender').disabled = false;
    document.getElementById('birthday').disabled = false;
    document.getElementById('edit').classList.add('d-none');
    document.getElementById('updata').classList.remove('d-none');
    fname = document.getElementById('name').innerText;
    femail = document.getElementById('email').value;
    fphone = document.getElementById('phone').value;
    fgender = document.getElementById('gender').value;
    fbirthday = document.getElementById('birthday').value;
}

function imeditFn() {
    document.getElementById('email').disabled = true;
    document.getElementById('phone').disabled = true;
    document.getElementById('gender').disabled = true;
    document.getElementById('birthday').disabled = true;
    document.getElementById('edit').classList.remove('d-none');
    document.getElementById('updata').classList.add('d-none');
    document.getElementById('name').innerText = fname;
    document.getElementById('email').value = femail;
    document.getElementById('phone').value = fphone;
    document.getElementById('gender').value = fgender;
    document.getElementById('birthday').value = fbirthday;
    document.getElementById('submit').classList.remove('is-invalid');
}

document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    let name = document.getElementById('name').innerText;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let gender = document.getElementById('gender').value;
    let birthday = document.getElementById('birthday').value;
    let change = 5;
    if (name === fname) change--;
    if (email === femail) change--;
    if (phone === fphone) change--;
    if (gender === fgender) change--;
    if (birthday === fbirthday) change--;
    if (!change) return validFn('submit', false);
    document.getElementById('loader').classList.add('is-active');

    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    fetch("http://localhost:3000/member/update", {
        method: "PUT",
        body: "name=" + name + "&email=" + email + "&phone=" + phone + "&gender=" + gender + "&birthday=" + birthday + "",
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
        document.getElementById('loader').classList.remove('is-active');
        return response.text();
    }).then(function(data) {
        data = JSON.parse(data);
        if (data.code) window.location.href = '/templates/user';
        else Swal.fire({
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
});