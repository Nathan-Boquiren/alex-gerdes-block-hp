const backendURL = 'https://image-upload-backend-whj4.onrender.com/';


async function fetchImages() {
    try {
        const response = await fetch(`${backendURL}images`); // Fetch images from the server
        const images = await response.json(); // Parse JSON response

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Clear existing images

        images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Uploaded Image';

            gallery.appendChild(img);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

// Fetch images on page load
document.addEventListener('DOMContentLoaded', fetchImages);




// JavaScript to toggle the menu visibility
document.getElementById('hamburger').addEventListener('click', (event) => {
    const navMenu = document.getElementById('navMenu');

    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');

    navMenu.classList.toggle('show');

    // Check if the nav menu is open
    if (navMenu.classList.contains('show')) {
        // Apply the "X" style when open
        line2.style.transform = 'scale(0)';
        line1.style.transform = 'rotate(45deg) translateY(-3px)';
        line1.style.transformOrigin = 'center left';
        line3.style.transform = 'rotate(-45deg) translateY(3px)';
        line3.style.transformOrigin = 'center left';
    } else {
        // Reset to hamburger style when closed
        resetHamburgerIcon();
    }

    event.stopPropagation(); // Prevent click event from propagating to the document
});

// Function to reset the hamburger icon to its original state
function resetHamburgerIcon() {
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');

    line2.style.transform = 'scale(1)';
    line1.style.transform = 'rotate(0)';
    line3.style.transform = 'rotate(0)';
}

// Close the menu when a link is clicked
document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('show');
        resetHamburgerIcon();
    });
});

// Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');

    // Check if the click is outside both the nav menu and the hamburger icon
    if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        navMenu.classList.remove('show');
        resetHamburgerIcon();
    }
});
