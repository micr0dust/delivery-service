document.getElementById("logout").addEventListener("click", function(e) {
    e.preventDefault();
    localStorage.clear();
    signOut();
    window.location.href = '/admin/login';
});