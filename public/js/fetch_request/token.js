async function getToken() {
    const headersList = {
        "Accept": "*/*",
        "refresh_token": localStorage.refresh_token,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/member/user/token", {
        method: "POST",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            localStorage.setItem('acesstoken', response.headers.get('token'));
            return await response.text();
        } else if (response.status === 403) {
            localStorage.clear();
            location.href = '/admin/login?redirct=' + location.pathname;
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