getInfoFn();

function getInfoFn() {
    let urlparm = window.location.href;
    if (window.location.href.split('?')[1]) {
        urlparm = window.location.href.split('?')[1];
        if (urlparm.split('&')[0].split('=')[0] == "refresh_token")
            if (urlparm.split('&')[0].split('=')[1] != "")
                localStorage.setItem('refresh_token', urlparm.split('&')[0].split('=')[1]);
    }

    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    fetch("/store", {
        method: "GET",
        headers: headersList
    }).then(async function(response) {
        if (response.status === 200) {
            const result = await response.text();
            const data = JSON.parse(result);
            document.getElementById('loader').classList.remove('is-active');
            if (data.code) {
                if (data.result.name) document.getElementById('name').innerText = data.result.name;
                if (data.result.address) document.getElementById('address').value = data.result.address;
                if (data.result.place) document.getElementById('place').value = data.result.place;
                if (data.result.timeEstimate) document.getElementById('timeEstimate').value = data.result.timeEstimate;
                if (data.result.businessTime) {
                    const schedule = document.getElementById('schedule');
                    const line = schedule.querySelectorAll('[name="line"]');
                    const businessTime = data.result.businessTime;
                    for (let i = 1; i < line.length; i++) {
                        const time = line[i].querySelectorAll('[name="dateCheck"]');
                        for (let j = 0; j < time.length; j++) {
                            time[j].checked = Boolean(businessTime[i - 1][j]);
                            time[j].checked ?
                                time[j].parentNode.classList.add('bg-warning') :
                                time[j].parentNode.classList.remove('bg-warning');
                        }
                    }
                }
                if (data.result.create_date) document.getElementById('create').value = new Date(data.result.create_date).toLocaleString();
                if (data.result.last_login) document.getElementById('update').value = new Date(data.result.last_login).toLocaleString();
                if (data.result.url) await getProductFn(data.result.url);
            } else Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.result
            }).then(() => {
                if (data.result === "請重新登入") {
                    localStorage.clear();
                    window.location.href = '/admin/login?redirct=' + location.pathname;
                }
            });
        } else if (response.status === 403 && localStorage.refresh_token) {
            await getToken();
            return getInfoFn();
        } else if (response.status === 403) {
            await getToken();
            return submitFn();
        } else {
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            });
        }
    });
}