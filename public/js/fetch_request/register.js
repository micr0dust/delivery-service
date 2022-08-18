var submited = false;

function checkInputFn() {
    if (!submited) return;
    let allcorrect = submited = true;
    let username = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let repassword = document.getElementById('repassword').value;
    if (!validFn('name', /^.{1,20}$/.test(username))) allcorrect = false;
    if (!validFn('email', /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) allcorrect = false;
    if (!validFn('password', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password))) allcorrect = false;
    if (!validFn('repassword', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(repassword) && (password === repassword))) allcorrect = false;
    if (!validFn('policy', document.getElementById('policy').checked)) allcorrect = false;
    return allcorrect;
}
document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    if (!checkInputFn(submited = true)) return;
    let username = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    document.getElementById('loader').classList.add('is-active');
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    fetch("/member/register", {
        method: "POST",
        body: "name=" + username + "&email=" + email + "&password=" + password,
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            localStorage.setItem('acesstoken', response.headers.get('token'));
            const result = await response.text();
            const data = JSON.parse(result);
            if (data.code)
                window.location.href = '/auth/mail';
            else Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.result
            })
        } else {
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            })
        }
    });
});

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    // var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId());
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

    document.getElementById('loader').classList.add('is-active');
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    fetch("/member/google-register", {
        method: "GET",
        body: "accesstoken=" + id_token,
        headers: headersList
    }).then(function(response) {
        if (response.status === 200)
            localStorage.setItem('acesstoken', response.headers.get('token'));
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
        if (data.code)
            console.log(data);
        //window.location.href = '/auth/mail';
        else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        })

        //console.log(data);
    })
}