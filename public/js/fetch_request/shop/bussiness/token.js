async function getBussinessToken() {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.bussiness_refresh_token,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    await fetch("/business/token", {
        method: "GET",
        headers: headersList
    }).then(function(response) {
        if (response.status === 200) {
            localStorage.setItem('bussiness_acesstoken', response.headers.get('token'));
        } else {
            localStorage.removeItem('bussiness_refresh_token');
        }
        return response.text();
    }).then(function(data) {
        //console.log(data);
    })
}