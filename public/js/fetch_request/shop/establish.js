function establish(data) {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    fetch("/store/establish", {
        method: "POST",
        body: `name=${data.name}&address=${data.address}&lat=${data.lat}&lng=${data.lng}&googlePlaceId=${data.googlePlaceId}`,
        headers: headersList
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 201) {
            const result = await response.text();
            const data = JSON.parse(result);
            window.location.href = '/shop';
        } else if (response.status === 403) {
            if (localStorage.refresh_token) {
                await getToken();
                return establish(data);
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