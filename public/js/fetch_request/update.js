var fname;
var fphone;
var fgender;
var fbirthday;

function editFn() {
    document.getElementById('phone').disabled = false;
    document.getElementById('gender').disabled = false;
    document.getElementById('birthday').disabled = false;
    document.getElementById('edit').classList.add('d-none');
    document.getElementById('updata').classList.remove('d-none');
    fname = document.getElementById('name').innerText;
    fphone = document.getElementById('phone').value;
    fgender = document.getElementById('gender').value;
    fbirthday = document.getElementById('birthday').value;
}

function imeditFn() {
    document.getElementById('phone').disabled = true;
    document.getElementById('gender').disabled = true;
    document.getElementById('birthday').disabled = true;
    document.getElementById('edit').classList.remove('d-none');
    document.getElementById('updata').classList.add('d-none');
    document.getElementById('name').innerText = fname;
    document.getElementById('phone').value = fphone;
    document.getElementById('gender').value = fgender;
    document.getElementById('birthday').value = fbirthday;
    document.getElementById('submit').classList.remove('is-invalid');
}

document.getElementById("submit").addEventListener("click", (function submitFn(e) {
    e.preventDefault();
    let name = document.getElementById('name').innerText;
    let phone = document.getElementById('phone').value;
    let gender = document.getElementById('gender').value;
    let birthday = document.getElementById('birthday').value;
    let change = 4;
    if (name === fname) change--;
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

    fetch("/member/", {
        method: "PUT",
        body: "name=" + name + "&phone=" + phone + "&gender=" + gender + "&birthday=" + birthday + "",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');

        if (response.status === 200) {
            const result = response.text();
            const data = JSON.parse(result);
            if (data.code) window.location.href = '/auth';
            else Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.result
            });
        } else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return submitFn();
        } else {
            console.log('error: ' + response);
            localStorage.clear();
            window.location.href = '/admin/login?redirct=' + location.pathname;
        }
    });
}));