// JavaScript to toggle the menu visibility
document.getElementById('hamburger').addEventListener('click', () => {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('show');
});