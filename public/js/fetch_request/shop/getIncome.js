async function getIncome() {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/store/income", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200) {
            const result = await response.text();
            const data = JSON.parse(result);
            return data;
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return getIncome();
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