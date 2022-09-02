async function putPauseProduct(productID) {
    if (!productID) return false;
    const headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    return await fetch('/store/product/pause', {
            method: 'PUT',
            body: `productID=${productID}`,
            headers: headersList
        })
        .then(async function(response) {
            document.getElementById('loader').classList.remove('is-active');
            if (response.status === 200)
                return await response.text();
            else if (response.status === 403) {
                if (localStorage.refresh_token) {
                    await getToken();
                    return putPauseProduct(productID);
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
        }).catch(error => {
            Swal.showValidationMessage(
                `發生錯誤：: ${error}`
            );
        });
}