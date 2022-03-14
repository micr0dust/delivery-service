getProductFn()
async function getProductFn() {
    let headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        id: location.href.split('?')[1],
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    await fetch('/member/store/product', {
            method: 'GET',
            headers: headersList
        })
        .then(async function(response) {
            document.getElementById('loader').classList.remove('is-active');
            if (response.status === 200);
            else if (response.status === 403 && localStorage.refresh_token) {
                await getToken()
                return submitFn()
            } else {
                console.log('error: ' + response)
                Swal.fire({
                    icon: 'error',
                    title: '發生錯誤',
                    text: response.status
                }).then(() => {
                    window.location.href = '/auth'
                })
            }
            return response.text()
        })
        .then(function(data) {
            data = JSON.parse(data);
            if (data.code) {
                let productList = document.getElementById('product');
                for (let i = 0; i < data.result.length; i++) {
                    const product = data.result[i];
                    let newProduct = document.getElementById('productTemplate');
                    newProduct.content.querySelector('.card-footer > span:nth-child(1)').textContent = product.name;
                    newProduct.content.querySelector('.card-footer > span:nth-child(2)').textContent = "NT$" + product.price;
                    newProduct.content.querySelector('.product_id').textContent = product.id;
                    let card = document.importNode(newProduct.content, true);
                    productList.appendChild(card);
                }
            } else
                Swal.fire({
                    icon: 'error',
                    title: data.status,
                    text: data.result
                }).then(() => {
                    if (data.result === '請重新登入') {
                        localStorage.removeItem('acesstoken')
                        localStorage.removeItem('refresh_token')
                        window.location.href = '/admin/login'
                    } else window.location.href = '/auth'
                })
        })
}