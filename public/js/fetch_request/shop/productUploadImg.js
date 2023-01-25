async function uploadProductImg() {
    let bodyContent = new FormData();
    bodyContent.append("product", "631746a97df7da3aa38d4a2e");
    bodyContent.append("image", "c:\Users\Administrator\Desktop\螢幕擷取畫面 2023-01-24 174927.png");


    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken
    };
    return await fetch("/upload/product/img", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 201)
            location.href = "/shop";
        else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return uploadProductImg();
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