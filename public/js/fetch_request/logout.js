document.getElementById("logout").addEventListener("click", function(e) {
    e.preventDefault();
    localStorage.removeItem('acesstoken');
    window.location.href = '/templates/login';
});