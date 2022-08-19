function requestPhoneMessage() {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    fetch("/member/twilio/send", {
        method: "PUT",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200);
        else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return requestMail();
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
            Swal.fire({
                icon: 'success',
                title: "已重新發送新的驗證碼"
            });
        } else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        }).then(() => {
            if (data.result === "請重新登入") {
                localStorage.clear()
                window.location.href = '/admin/login?redirct=' + location.pathname;
            }
        });
        //console.log(data);
    })
}