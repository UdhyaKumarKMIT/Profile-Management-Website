document.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
function profilecheck() {
    var sid = localStorage.getItem('sid');
    if (!sid) {
        alert('Please login to access the Profile page.');
        window.location.href = 'login.html'; 
        return false; r
    }
   
    return true;
}