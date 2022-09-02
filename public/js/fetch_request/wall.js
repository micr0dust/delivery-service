async function getStoreFn() {
    const headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    return await fetch('/member/store', {
            method: 'GET',
            headers: headersList
        })
        .then(async function(response) {
            document.getElementById('loader').classList.remove('is-active');
            if (response.status === 200) {
                const result = await response.text();
                const data = JSON.parse(result);
                if (data.code) return data;
                else Swal.fire({
                    icon: 'error',
                    title: data.status,
                    text: data.result
                });
            } else if (response.status === 403) {
                if (localStorage.refresh_token) {
                    await getToken();
                    return submitFn();
                } else {
                    localStorage.clear();
                    window.location.href = '/admin/login?redirct=' + location.pathname;
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