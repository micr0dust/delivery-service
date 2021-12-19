document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById('loader').classList.add('is-active');
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    fetch("/member/login", {
        method: "POST",
        body: "email=" + email + "&password=" + password,
        headers: headersList
    }).then(function(response) {
        if (response.status === 200)
            localStorage.setItem('acesstoken', response.headers.get('token'));
        else {
            console.log('error: ' + response);
            Swal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: response.status
            })
        }
        document.getElementById('loader').classList.remove('is-active');
        return response.text();
    }).then(function(data) {
        data = JSON.parse(data);
        if (data.code)
            window.location.href = '/templates/user';
        else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        });
        console.log(data);
    })
});