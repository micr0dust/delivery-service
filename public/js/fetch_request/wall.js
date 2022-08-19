getStoreFn()
async function getStoreFn() {
    const headersList = {
        Accept: '*/*',
        token: localStorage.acesstoken,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    return await fetch('/member/store', {
            method: 'GET',
            headers: headersList
        })
        .then(async function(response) {
            document.getElementById('loader').classList.remove('is-active');
            if (response.status === 200) {
                const result = await response.text();
                const data = JSON.parse(result);
                if (data.code) {
                    let wall = document.getElementById('wall');
                    for (let i = 0; i < data.result.length; i++) {
                        const store = data.result[i];
                        let newStore = document.getElementById('storeTemplate');
                        newStore.content.querySelector('a > .card-header').textContent = store.name;
                        newStore.content.querySelector('a > .card-footer').textContent = store.address;
                        newStore.content.querySelector('a').href = location.href.split("/wall")[0] + "/storepage?" + store.id;
                        let card = document.importNode(newStore.content, true);
                        wall.appendChild(card);
                    }
                } else
                    Swal.fire({
                        icon: 'error',
                        title: data.status,
                        text: data.result
                    });
            } else if (response.status === 403) {
                if (localStorage.refresh_token) {
                    await getToken();
                    return submitFn();
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