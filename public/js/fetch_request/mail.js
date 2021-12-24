function requestMail(swal) {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    fetch("/member/email/send", {
        method: "PUT",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200);
        else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return requestMail(swal);
        } else {
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            })
        }
        return response.text();
    }).then(function(data) {
        data = JSON.parse(data);
        if (data.code) {
            if (swal)
                Swal.fire({
                    icon: 'success',
                    title: "已重新發送新的驗證碼",
                    text: "請確認發送的郵件是否被歸類為垃圾郵件"
                });
        } else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        }).then(() => {
            if (data.result === "請重新登入") {
                localStorage.removeItem('acesstoken');
                localStorage.removeItem('refresh_token');
                window.location.href = '/admin/login';
            }
        });
        //console.log(data);
    })
}