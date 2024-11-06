const backendURL = 'https://image-upload-backend-whj4.onrender.com';

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const photoInput = document.getElementById('photoInput').files[0];

    formData.append('photo', photoInput);

    try {
        const response = await fetch(`${backendURL}upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        document.getElementById('message').innerText = data.message;

        if (response.ok) {
            fetchImages(); // Refresh the gallery after uploading
            document.getElementById('photoInput').value = ''; // Reset the file input
            document.getElementById('fileName').textContent = 'No file chosen'; // Reset the displayed filename
            
            // Clear the message after 3 seconds
            setTimeout(() => {
                document.getElementById('message').innerText = '';
            }, 3000);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        document.getElementById('message').innerText = 'Error uploading file.';
    }
});



// Function to fetch and display images
// Function to fetch and display images
async function fetchImages() {
    try {
        const response = await fetch(`${backendURL}images`); // Fetch images from the server
        const images = await response.json(); // Parse JSON response
        console.log(images); // Log the images to check their URLs

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Clear existing images

        images.forEach(imageUrl => {
            // Create a container for each image and delete button
            const container = document.createElement('div');
            container.classList.add('image-container'); // Add a class to style container

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Uploaded Image';

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.classList.add('material-symbols-outlined');
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = () => deleteImage(imageUrl.split('/').pop());

            container.appendChild(img);
            container.appendChild(deleteButton);
            gallery.appendChild(container);
        });
    } catch (error) {
        console.error('Error fetching images:', error); // Log any fetching errors
    }
}



// Fetch images on page load
document.addEventListener('DOMContentLoaded', fetchImages);

// JavaScript to display the filename
document.getElementById('photoInput').addEventListener('change', function() {
    const fileInput = this;
    const fileName = fileInput.files[0] ? fileInput.files[0].name : "No file chosen";
    
    // Update the file name display
    document.getElementById('fileName').textContent = fileName;
});

// Function to delete an image
async function deleteImage(filename) {
    try {
        const response = await fetch(`${backendURL}delete/${filename}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        // Display the toast notification
        const toast = document.getElementById('toast');
        toast.innerText = data.message; // Set the toast message
        toast.style.display = 'block'; // Show the toast
        toast.style.opacity = '1'; // Fade in the toast

        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0'; // Fade out
            setTimeout(() => {
                toast.style.display = 'none'; // Remove from display
            }, 500); // Wait for the fade-out transition to finish
        }, 3000); // Show for 3 seconds

        fetchImages(); // Refresh the gallery after deletion
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

