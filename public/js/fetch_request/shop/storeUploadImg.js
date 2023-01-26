async function storeUploadImg(file) {
    let bodyContent = new FormData();
    bodyContent.append("image", file);

    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken
    };
    return await fetch("/store/upload/img", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200);
        else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return storeUploadImg();
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