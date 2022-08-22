async function requestPhoneMessage() {
    document.getElementById('loader').classList.add('is-active');
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    return await fetch("/member/twilio/send", {
        method: "POST",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            const result = await response.text();
            const data = JSON.parse(result);
            if (data.code) {
                Swal.fire({
                    icon: 'success',
                    title: "已發送驗證碼"
                });
            } else Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.result
            });
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return requestPhoneMessage();
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
    });
}

async function pinSubmit(pin) {
    document.getElementById('loader').classList.add('is-active');
    const headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    return await fetch('/member/twilio/verify', {
            method: 'POST',
            body: 'code=' + pin,
            headers: headersList
        })
        .then(async function(response) {
            document.getElementById('loader').classList.remove('is-active');

            if (response.status === 200) {
                const result = await response.text();
                const data = JSON.parse(result);
                if (data.code)
                    Swal.fire({
                        icon: 'success',
                        title: data.status,
                        text: data.result
                    }).then(() => {
                        window.location.href = '/auth';
                    });
                else
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
        });
}