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
    let url = window.location.href;
    let redirct;
    if ((url.indexOf('?redirct=') + 1)) redirct = url.toString().split('?redirct=')[1];
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
        if (data.code) {
            if (data.result.role) localStorage.setItem('role', JSON.stringify(data.result.role));
            window.location.href = (redirct) ? redirct : '/auth';
        } else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        });
    })
});

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId());
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    let url = window.location.href;
    let redirct;
    console.log(id_token);
    if ((url.indexOf('?redirct=') + 1)) redirct = url.toString().split('?redirct=')[1];

    document.getElementById('loader').classList.add('is-active');
    let headersList = {
        "Accept": "*/*",
        "id": profile.getId(),
        "Content-Type": "application/x-www-form-urlencoded"
    }
    fetch("/member/google/login", {
        method: "GET",
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
        if (data) {
            try {
                if (data.result.role) localStorage.setItem('role', JSON.stringify(data.result.role));
            } catch (error) {

            }
            window.location.href = data.redirect_url;
        }
        //console.log(data);
    })
}