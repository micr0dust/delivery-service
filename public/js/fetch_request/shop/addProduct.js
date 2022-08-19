function addProductForm() {
    Swal.fire({
        title: '新增商品',
        html: `<input type="text" id="product" class="swal2-input" placeholder="商品名稱" autocomplete="off">
        <input type="text" id="describe" class="swal2-input" placeholder="敘述"autocomplete="off">
        <input type="text" id="tag" class="swal2-input" placeholder="標籤" autocomplete="off">
        <input type="number" id="price" class="swal2-input" min="1" max="9999" placeholder="商品價格" autocomplete="off">
        <div id="options"></div>`,
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: '進階選項',
        denyButtonColor: '#00AAAA',
        cancelButtonColor: '#808080',
        confirmButtonText: '建立',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#product').value;
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
        } else if (result.isDenied) {
            const product = Swal.getPopup().querySelector('#product').value;
            const describe = Swal.getPopup().querySelector('#describe').value;
            const tag = Swal.getPopup().querySelector('#tag').value;
            const price = Swal.getPopup().querySelector('#price').value;
            location.href = `/shop/add?product=${product}&describe=${describe}&tag=${tag}&price=${price}`;
        }
    })
}

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