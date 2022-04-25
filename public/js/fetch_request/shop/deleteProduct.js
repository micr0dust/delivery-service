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
            if (confirm == name) return delProduct(selected.id);
            else Swal.showValidationMessage(
                '輸入錯誤'
            );
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        history.replaceState(null, null, ' ');
        if (result.isConfirmed) {
            getProductFn();
            Swal.fire(
                '刪除成功',
                `${name} 已經被刪除`,
                'success'
            );
        }
    })
}, false);

async function delProduct(productID) {
    if (!productID) return false;
    let headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    await fetch('/store/product/remove', {
            method: 'DELETE',
            body: `product=${productID}`,
            headers: headersList
        })
        .then(async function(response) {
            if (response.status === 200);
            else if (response.status === 403 && localStorage.refresh_token) {
                await getToken();
                return getInfoFn();
            } else throw new Error(response.status);
        }).catch(error => {
            Swal.showValidationMessage(
                `發生錯誤：: ${error}`
            );
        });
}