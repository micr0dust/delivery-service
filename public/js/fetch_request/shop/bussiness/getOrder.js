async function getOrder() {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.bussiness_acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/business/order", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200) {
            document.getElementById('loader').classList.remove('is-active');
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
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            });
        }
    });
}