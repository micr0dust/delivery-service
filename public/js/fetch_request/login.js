function googleLogin() {
    const url = window.location.href;
    if ((url.indexOf('?redirct=') + 1)) {
        const redirct = url.toString().split('?redirct=')[1];
        localStorage.setItem('redirct', redirct);
    }

    document.getElementById('loader').classList.add('is-active');
    const headersList = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    };
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
            });
        }
        return response.text();
    }).then(function(res) {
        const data = JSON.parse(res);
        if (data) {
            if (data.result && data.result.role) localStorage.setItem('role', JSON.stringify(data.result.role));
            window.location.href = data.redirect_url;
        }
        //console.log(data);
    })
}

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
    //const url = window.location.href;
    if ((url.indexOf('?redirct=') + 1)) {
        const redirct = url.toString().split('?redirct=')[1];
        localStorage.setItem('redirct', redirct);
    }

    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?" +
            "scope=email%20profile&" +
            "redirect_uri=" + location.hostname + "/member/google/callback&" +
            "response_type=code&" +
            "client_id=1047924292997-3pht638fc2a7qs83lnt2deqiqkfmntj8.apps.googleusercontent.com";

    document.getElementById('loader').classList.add('is-active');
    return false;
    // const headersList = {
    //     "Accept": "*/*",
    //     "id": profile.getId(),
    //     "Content-Type": "application/x-www-form-urlencoded"
    // };
    // fetch("/member/google/login", {
    //     method: "GET",
    //     headers: headersList
    // }).then(function(response) {
    //     document.getElementById('loader').classList.remove('is-active');
    //     if (response.status === 200) {
    //         localStorage.setItem('acesstoken', response.headers.get('token'));
    //         localStorage.setItem('refresh_token', response.headers.get('refresh_token'));
    //     } else {
    //         console.log('error: ' + response);
    //         Swal.fire({
    //             icon: 'error',
    //             title: '發生錯誤',
    //             text: response.status
    //         });
    //     }
    //     return response.text();
    // }).then(function(res) {
    //     const data = JSON.parse(res);
    //     if (data) {
    //         if (data.result && data.result.role) localStorage.setItem('role', JSON.stringify(data.result.role));
    //         window.location.href = data.redirect_url;
    //     }
    //     //console.log(data);
    // })
}