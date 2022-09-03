async function getOneProduct(productID) {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "productID": productID,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/store/product/one", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            return await response.text();
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return getOneProduct();
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