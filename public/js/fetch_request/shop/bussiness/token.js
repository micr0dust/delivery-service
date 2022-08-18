async function getBussinessToken() {
    let headersList = {
        "Accept": "*/*",
        "refresh_token": localStorage.bussiness_refresh_token,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    return await fetch("/business/token", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200) {
            localStorage.setItem('bussiness_acesstoken', response.headers.get('token'));
            return await response.text();
        } else if (response.status === 403) {
            localStorage.clear();
            location.href = '/admin/login?redirct=' + location.pathname;
        }
    });
}