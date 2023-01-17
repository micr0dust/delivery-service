async function getStore(storeID) {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/member/store/detail", {
        method: "POST",
        headers: headersList,
        body: `id=${location.href.split('?')[1] || localStorage.url}`
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            if (response.redirected) window.location.href = response.url;
            return await response.text();
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return getStore();
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