function updateSubmit(data) {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    let bodyContent = "";
    if (data['name']) bodyContent += `name=${data['name']}&`;
    if (data['address']) bodyContent += `address=${data['address']}&`;
    if (data['discount']) bodyContent += `discount=${data['discount']}&`;
    if (data['timeEstimate']) bodyContent += `timeEstimate=${data['timeEstimate']}&`;
    if (data['businessTime']) bodyContent += `businessTime=${data['businessTime']}&`;
    if (data['place']) bodyContent += `place=${data['place']}&`;

    fetch("/store", {
        method: "PUT",
        headers: headersList,
        body: bodyContent
    }).then(async function(response) {
        if (response.status === 200)
            edit(false);
        else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return updateSubmit(data);
        } else {
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            });
        }
        return response.text();
    }).then(async function(data) {
        data = JSON.parse(data);
        document.getElementById('loader').classList.remove('is-active');
        if (data.code) {} else Swal.fire({
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
        console.log(data);
    })
}