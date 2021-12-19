document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    let username = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let repassword = document.getElementById('repassword').value;
    if (password != repassword) return Swal.fire({
        icon: 'error',
        title: '密碼不相同'
    })
    if (!document.getElementById('policy').checked) return Swal.fire({
        icon: 'error',
        title: '請閱讀並同意我們的政策'
    })
    document.getElementById('loader').classList.add('is-active');
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    fetch("/member/register", {
        method: "POST",
        body: "name=" + username + "&email=" + email + "&password=" + password,
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
            window.location.href = '/templates/verify';
        else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        })

        //console.log(data);
    })
});