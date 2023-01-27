async function getHistoryOrder() {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/store/order", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            const result = await response.text();
            sessionStorage.orderData = result;
            const data = JSON.parse(result);
            return data;
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return getHistoryOrder();
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