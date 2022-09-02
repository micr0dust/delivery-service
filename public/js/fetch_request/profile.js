async function getMember() {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    return await fetch("/member/user/info", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            const result = await response.text();
            return result;
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return getMember();
            } else {
                localStorage.clear();
                window.location.href = '/admin/login';
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