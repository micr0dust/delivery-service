async function getOrder() {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.bussiness_acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/business/order", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            const result = await response.text();
            const data = JSON.parse(result);
            if (data.code) {
                return data;
            } else Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.result
            });
        } else if (response.status === 403) {
            if (localStorage.bussiness_refresh_token)
                await getBussinessToken();
            else
                await bussinessLogin();
            return getOrder();
        } else {
            // const result = await response.text();
            // const data = JSON.parse(result);
            // Swal.fire({
            //     icon: 'error',
            //     title: data.status,
            //     text: data.result
            // });
        }
    });
}