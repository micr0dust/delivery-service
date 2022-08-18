async function getToken() {
    let headersList = {
        "Accept": "*/*",
        "refresh_token": localStorage.refresh_token,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    console.log('$')
    return await fetch("/member/user/token", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200) {
            localStorage.setItem('acesstoken', response.headers.get('token'));
            return await response.text();
        } else if (response.status === 403) {
            localStorage.clear();
            location.href = '/admin/login?redirct=' + location.pathname;
        }
    });
}