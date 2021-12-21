document.getElementById("submit").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById('loader').classList.add('is-active');
    let name = document.getElementById('name').innerText;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let gender = document.getElementById('gender').value;
    let birthday = document.getElementById('birthday').value;

    let headersList = {
        "Accept": "*/*",
        "token": localStorage.acesstoken,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    fetch("http://localhost:3000/member/update", {
        method: "PUT",
        body: "name=" + name + "&email=" + email + "&phone=" + phone + "&gender=" + gender + "&birthday=" + birthday + "",
        headers: headersList
    }).then(function(response) {
        if (response.status === 200);
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
        if (data.code) window.location.href = '/templates/user';
        else Swal.fire({
            icon: 'error',
            title: data.status,
            text: data.result
        }).then(() => {
            if (data.result === "請重新登入") {
                localStorage.removeItem('acesstoken');
                window.location.href = '/templates/login';
            }
        });
        console.log(data);
    })
});