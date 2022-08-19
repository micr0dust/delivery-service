async function updateSubmit(data) {
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

    return await fetch("/store", {
        method: "PUT",
        headers: headersList,
        body: bodyContent
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            edit(false);
            const result = await response.text();
            const data = JSON.parse(result);
            return data;
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return updateSubmit(data);
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