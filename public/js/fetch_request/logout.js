document.getElementById("logout").addEventListener("click", function(e) {
    e.preventDefault();
    localStorage.removeItem('acesstoken');
    localStorage.removeItem('refresh_token');
    signOut();
    window.location.href = '/admin/login';
});