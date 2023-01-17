async function getLocationByAddress(address) {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/store/addressInfo", {
        method: "POST",
        headers: headersList,
        body: `address=${address}`
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            const result = await response.text();
            const data = JSON.parse(result);
            return data;
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return getLocationByAddress(address);
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