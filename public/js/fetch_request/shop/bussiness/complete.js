async function complete(_id, comments) {
    const headersList = {
        "Accept": "*/*",
        "token": localStorage.bussiness_acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    return await fetch("/business/order/complete", {
        method: "PUT",
        headers: headersList,
        body: `id=${_id}&comments=${comments}`
    }).then(async function(response) {
        document.getElementById('loader').classList.remove('is-active');
        if (response.status === 200) {
            const result = await response.text();
            const data = JSON.parse(result);
            return data;
        } else if (response.status === 403) {
            if (localStorage.bussiness_refresh_token)
                await getBussinessToken();
            else
                await bussinessLogin();
            return complete(_id);
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