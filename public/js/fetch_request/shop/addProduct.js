function addProductForm() {
    Swal.fire({
        title: '新增商品',
        html: `<input type="text" id="name" class="swal2-input" placeholder="商品名稱" autocomplete="off">
        <input type="text" id="describe" class="swal2-input" placeholder="敘述"autocomplete="off">
        <input type="text" id="tag" class="swal2-input" placeholder="標籤" autocomplete="off">
        <input type="number" id="price" class="swal2-input" min="1" max="9999" placeholder="商品價格" autocomplete="off">`,
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonColor: '#808080',
        confirmButtonText: '建立',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#name').value;
            const describe = Swal.getPopup().querySelector('#describe').value;
            const tag = Swal.getPopup().querySelector('#tag').value;
            const price = Swal.getPopup().querySelector('#price').value;
            const oProduct = {
                name: name,
                describe: describe,
                tag: tag,
                price: price
            };
            if (name && price) return addProduct(oProduct);
            else Swal.showValidationMessage(
                '商品名稱和價格為必填選項'
            );
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            getProductFn();
            Swal.fire(
                '建立成功',
                '',
                'success'
            );
        }
    })
}

async function addProduct(oProduct) {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    await fetch("/store/product/add", {
        method: "POST",
        body: `name=${oProduct.name}&price=${oProduct.price}&describe=${oProduct.describe}&type=${oProduct.tag}`,
        headers: headersList
    }).then(async function(response) {
        if (response.status === 201);
        else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return getInfoFn();
        } else throw new Error(response.status);
    }).catch(error => {
        Swal.showValidationMessage(
            `發生錯誤：${error}`
        );
    });
}