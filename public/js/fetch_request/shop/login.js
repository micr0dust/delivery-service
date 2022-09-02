async function bussinessLogin() {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/store/login", {
        method: "POST",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            localStorage.setItem('bussiness_acesstoken', response.headers.get('token'));
            localStorage.setItem('bussiness_refresh_token', response.headers.get('refresh_token'));
            return await response.text();
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return await bussinessLogin();
            } else {
                localStorage.clear();
                location.href = '/admin/login?redirct=' + location.pathname;
            }
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
}