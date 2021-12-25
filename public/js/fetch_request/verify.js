submitFn();

async function submitFn() {
    let url = window.location.href;
    if (!(url.indexOf('?verify=') + 1)) return;
    let code = url.toString().split('?')[1].split('=')[1];
    let headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    await fetch('/member/email/verify', {
            method: 'PUT',
            body: 'verityCode=' + code,
            headers: headersList
        })
        .then(async function(response) {
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
                });
            }
            document.getElementById('loader').classList.remove('is-active');
            return response.text()
        })
        .then(function(data) {
            data = JSON.parse(data)
            if (data.code)
                Swal.fire({
                    icon: 'success',
                    title: data.status,
                    text: data.result
                }).then(() => {
                    window.location.href = '/auth'
                });
            else
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
        });
}