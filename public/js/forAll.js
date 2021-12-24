document.addEventListener('DOMContentLoaded', display(), false);

function display() {
    if (localStorage.acesstoken) {
        for (let i = 0; i < document.getElementsByClassName('isAuthenticated').length; i++)
            document.getElementsByClassName('isAuthenticated')[i].style.display = "block";
        for (let i = 0; i < document.getElementsByClassName('notAuthenticated').length; i++)
            document.getElementsByClassName('notAuthenticated')[i].style.display = "none";
    } else {
        for (let i = 0; i < document.getElementsByClassName('isAuthenticated').length; i++)
            document.getElementsByClassName('isAuthenticated')[i].style.display = "none";
        for (let i = 0; i < document.getElementsByClassName('notAuthenticated').length; i++)
            document.getElementsByClassName('notAuthenticated')[i].style.display = "block";
    }
}

redirect();

async function redirect() {
    if (localStorage.refresh_token && !localStorage.acesstoken) await getToken();
    if (!localStorage.acesstoken && window.location.pathname.split('/')[1] === "auth") return window.location.href = '/admin/login';
    if (localStorage.acesstoken && window.location.pathname.split('/')[1] === "admin") return window.location.href = '/auth';
    return display();
}

function validFn(id, valid) {
    let element = document.getElementById(id);
    if (valid) {
        element.classList.remove('is-invalid')
        element.classList.add('is-valid');
    } else {
        element.classList.remove('is-valid')
        element.classList.add('is-invalid');
    }
    return valid;
}