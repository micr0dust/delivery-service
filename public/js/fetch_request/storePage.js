async function getProductFn(url) {
    if (url) localStorage.setItem('url', url);
    const headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        id: location.href.split('?')[1] || localStorage.url,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    await fetch('/member/store/product', {
            method: 'GET',
            headers: headersList
        })
        .then(async function(response) {
            document.getElementById('loader').classList.remove('is-active');
            if (response.status === 200) {
                const result = await response.text();
                const data = JSON.parse(result);
                if (data.code) {
                    let products = document.getElementById('product');
                    while (products.hasChildNodes())
                        products.removeChild(products.lastChild);
                    let productList = document.getElementById('product');
                    for (let i = 0; i < data.result.length; i++) {
                        const product = data.result[i];
                        const newProduct = document.getElementById('productTemplate');
                        newProduct.content.querySelector('div > a > .card-footer > span:nth-child(1)').textContent = product.name;
                        newProduct.content.querySelector('div').id = product.id;
                        newProduct.content.querySelector('div > a > .card-footer > span:nth-child(2)').textContent = "NT$" + product.price;
                        newProduct.content.querySelector('div > a').href = `#${product.id}`;
                        const card = document.importNode(newProduct.content, true);
                        productList.appendChild(card);
                    }
                } else
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.result
                    });
            } else if (response.status === 403) {
                if (localStorage.refresh_token) {
                    await getToken();
                    return submitFn();
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
        })
}