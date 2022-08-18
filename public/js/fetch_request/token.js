async function getToken() {
    let headersList = {
        "Accept": "*/*",
        "refresh_token": localStorage.refresh_token,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    await fetch("/member/user/token", {
        method: "GET",
        headers: headersList
    }).then(function(response) {
        if (response.status === 200) {
            localStorage.setItem('acesstoken', response.headers.get('token'));
        } else if ((response.status === 403)) {
            localStorage.removeItem('acesstoken');
            localStorage.removeItem('refresh_token');
            location.href = '/admin/login';
        }
        return response.text();
    }).then(function(data) {
        //console.log(data);
    })
}