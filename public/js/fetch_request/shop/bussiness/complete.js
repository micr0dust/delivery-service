function complete(_id) {
    let headersList = {
        "Accept": "*/*",
        "token": localStorage.bussiness_acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    return fetch("/business/order/complete", {
        method: "PUT",
        headers: headersList,
        body: `id=${_id}`
    }).then(function(response) {
        if (response.status === 200);
        else Swal.fire({
            icon: 'error',
            title: response.status,
            text: response.result
        });
        return response.text();
    }).then(function(data) {
        data = JSON.parse(data);
        return data;
    })
}