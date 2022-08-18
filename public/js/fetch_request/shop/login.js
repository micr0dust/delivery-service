async function bussinessLogin() {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    return await fetch("/store/login", {
        method: "POST",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200) {
            localStorage.setItem('bussiness_acesstoken', response.headers.get('token'));
            localStorage.setItem('bussiness_refresh_token', response.headers.get('refresh_token'));
            return await response.text();
        } else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return await bussinessLogin();
        } else if (response.status === 403) {
            localStorage.clear();
            location.href = '/admin/login?redirct=' + location.pathname;
        } else {
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            });
        }
    });
}