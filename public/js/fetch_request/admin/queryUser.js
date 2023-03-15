async function queryUser(email) {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    document.getElementById('loader').classList.add('is-active');
    return await fetch("/backend/query/user", {
        method: "POST",
        body: `email=${email}`,
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            if (response.redirected) window.location.href = response.url;
            const result = await response.text();
            const data = JSON.parse(result);
            return data;
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return addRole(data);
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