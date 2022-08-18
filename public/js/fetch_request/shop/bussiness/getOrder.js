function getOrder() {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.bussiness_acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    return fetch("/business/order", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200);
        else if (response.status === 403 && localStorage.refresh_token) {
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
        return response.text();
    }).then(function(data) {
        data = JSON.parse(data);
        document.getElementById('loader').classList.remove('is-active');
        if (data.code) {
            return data;
        } else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        }).then(() => {
            if (data.result === "請重新登入") {
                localStorage.removeItem('acesstoken');
                localStorage.removeItem('refresh_token');
                window.location.href = '/admin/login';
            }
        });
    })
}