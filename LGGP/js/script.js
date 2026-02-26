// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Gallery Logic (Filtering and Navigation)
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        const filters = document.querySelectorAll('.gallery-controls button');
        const items = Array.from(galleryGrid.getElementsByClassName('gallery-item'));

        let currentCategory = 'all';

        // Read URL Params (REQUIREMENT 2 & 6)
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            currentCategory = categoryParam;
        }

        function updateGallery() {
            items.forEach(item => {
                const category = item.getAttribute('data-category');
                const matches = currentCategory === 'all' || category === currentCategory;

                if (matches) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });

            // Update Active Button (REQUIREMENT 3)
            filters.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === currentCategory) {
                    btn.classList.add('active');
                }
            });
        }

        // Category Filter Buttons
        filters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentCategory = e.target.getAttribute('data-filter');
                updateGallery();
                // Update URL without reloading the page
                const newUrl = window.location.pathname + '?category=' + currentCategory;
                window.history.pushState({ path: newUrl }, '', newUrl);
            });
        });

        // Initialize state
        updateGallery();
    }
});

// Modal Logic for Gallery Preview (REQUIREMENT 5)
let currentImageIndex = 0;
let filteredItems = [];

function openModal(src, element) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const galleryGrid = document.getElementById('gallery-grid');

    if (modal && modalImg && element) {
        modalImg.src = src;
        modal.style.display = 'flex';

        // Find current category visible items
        const currentCategoryBtn = document.querySelector('.gallery-controls button.active');
        const currentCategory = currentCategoryBtn ? currentCategoryBtn.getAttribute('data-filter') : 'all';

        const allItems = Array.from(galleryGrid.getElementsByClassName('gallery-item'));
        filteredItems = allItems.filter(item => {
            return currentCategory === 'all' || item.getAttribute('data-category') === currentCategory;
        });

        const currentItem = element.closest('.gallery-item');
        currentImageIndex = filteredItems.indexOf(currentItem);
    }
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('modal-img').src = '';
    }
}

function changeImage(step) {
    if (filteredItems.length === 0) return;

    currentImageIndex += step;

    // Looping
    if (currentImageIndex >= filteredItems.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = filteredItems.length - 1;
    }

    const nextImgSrc = filteredItems[currentImageIndex].querySelector('img').src;
    document.getElementById('modal-img').src = nextImgSrc;
}

// Close Modal when clicking outside the image
window.onclick = function (event) {
    const modal = document.getElementById('image-modal');
    if (event.target === modal) {
        closeModal();
    }
}
