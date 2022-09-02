async function addProduct(oProduct) {
    let formData = "";
    if (oProduct.name) formData += `name=${oProduct.name}`;
    if (oProduct.price) formData += `&price=${oProduct.price}`;
    if (oProduct.describe) formData += `&describe=${oProduct.describe}`;
    if (oProduct.tag) formData += `&type=${oProduct.tag}`;
    if (oProduct.options) formData += `&options=${oProduct.options}`;

    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    return await fetch("/store/product", {
        method: "POST",
        body: formData,
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 201)
            location.href = "/shop";
        else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return addProduct(oProduct);
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
            `發生錯誤：${error}`
        );
    });
}