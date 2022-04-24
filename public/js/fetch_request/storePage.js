window.addEventListener('hashchange', function() {
    if (!location.hash.split('#')[1]) return;
    let selected = document.getElementById(location.hash.split('#')[1]);
    let name = selected.querySelector('a > div.card-footer.justify-content-between > span:nth-child(1)').textContent;
    Swal.fire({
        title: '刪除商品',
        html: `在下方輸入 <span class="font-weight-bold text-danger">${name}</span> 以確認刪除`,
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonColor: '#bf0d0d',
        cancelButtonColor: '#808080',
        confirmButtonText: '刪除',
        showLoaderOnConfirm: true,
        preConfirm: (confirm) => {
            if (confirm == name) return true;
            else Swal.showValidationMessage(
                '輸入錯誤'
            )
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        history.replaceState(null, null, ' ');
        if (result.isConfirmed)
            Swal.fire(
                '刪除成功',
                `${name} 已經被刪除`,
                'success'
            )
    })
}, false);

async function getProductFn(url) {
    let headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        id: location.href.split('?')[1] || url,
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
                    newProduct.content.querySelector('div > a > .card-footer > span:nth-child(1)').textContent = product.name;
                    newProduct.content.querySelector('div').id = product.id;
                    newProduct.content.querySelector('div > a > .card-footer > span:nth-child(2)').textContent = "NT$" + product.price;
                    newProduct.content.querySelector('div > a').href = `#${product.id}`;
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