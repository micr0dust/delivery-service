document.addEventListener('DOMContentLoaded', display(), false);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js', {
                scope: '.'
            })
            .then(function() {
                console.log("Service Worker Registered");
            });
    });
}

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
    if (localStorage.role && JSON.parse(localStorage.role).indexOf("store") + 1)
        for (let i = 0; i < document.getElementsByClassName('haveStore').length; i++)
            document.getElementsByClassName('haveStore')[i].style.display = "block";
}

redirect();

async function redirect() {
    let urlparm = window.location.href;
    if (window.location.href.split('?')[1]) {
        urlparm = window.location.href.split('?')[1];
        if (urlparm.split('&')[0].split('=')[0] == "refresh_token")
            if (urlparm.split('&')[0].split('=')[1] != "")
                localStorage.setItem('refresh_token', urlparm.split('&')[0].split('=')[1]);
    }
    if (localStorage.refresh_token && !localStorage.acesstoken) await getToken();
    if (!localStorage.acesstoken && window.location.pathname.split('/')[1] === "auth") return window.location.href = '/admin/login?redirct=' + window.location.href;
    if (localStorage.acesstoken && window.location.pathname.split('/')[1] === "admin") return window.location.href = '/auth';
    return display();
}

function validFn(id, valid) {
    let element = document.getElementById(id);
    if (valid) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    } else {
        element.classList.remove('is-valid')
        element.classList.add('is-invalid');
    }
    return valid;
}