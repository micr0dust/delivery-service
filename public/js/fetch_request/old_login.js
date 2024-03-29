var submited = false;

function checkInputFn() {
    if (!submited) return;
    let allcorrect = true;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    if (!validFn('email', /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) allcorrect = false;
    if (!validFn('password', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password))) allcorrect = false;
    return allcorrect;
}

document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    if (!checkInputFn(submited = true)) return;
    const url = window.location.href;
    let redirct;
    if ((url.indexOf('?redirct=') + 1)) redirct = url.toString().split('?redirct=')[1];

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    document.getElementById('loader').classList.add('is-active');

    const headersList = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    };

    fetch("/member/login", {
        method: "POST",
        body: "email=" + email + "&password=" + password,
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            localStorage.setItem('acesstoken', response.headers.get('token'));
            localStorage.setItem('refresh_token', response.headers.get('refresh_token'));
            const result = await response.text();
            const data = JSON.parse(result);
            if (data.code) {
                if (data.result.role) localStorage.setItem('role', JSON.stringify(data.result.role));
                window.location.href = (redirct) ? redirct : '/auth';
            } else Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.result
            });
        } else {
            const result = await response.text();
            const data = JSON.parse(result);
            Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.result
            });
        }
    });
});