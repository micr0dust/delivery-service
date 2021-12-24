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
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    document.getElementById('loader').classList.add('is-active');
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    fetch("/member/login", {
        method: "POST",
        body: "email=" + email + "&password=" + password,
        headers: headersList
    }).then(function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            localStorage.setItem('acesstoken', response.headers.get('token'));
            localStorage.setItem('refresh_token', response.headers.get('refresh_token'));
        } else {
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
        if (data.code)
            window.location.href = '/auth';
        else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        });
        //console.log(data);
    })
});