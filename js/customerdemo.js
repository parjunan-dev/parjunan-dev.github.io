// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    if (!mobileMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Close mobile menu when clicking close button
document.querySelector('.close-btn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
});

// Off-canvas Menu Toggle
function toggleOffCanvasMenu() {
    const offCanvasMenu = document.getElementById('offCanvasMenu');
    offCanvasMenu.classList.toggle('active');
}

// Close off-canvas menu when clicking outside
document.addEventListener('click', function(event) {
    const offCanvasMenu = document.getElementById('offCanvasMenu');
    const offCanvasBtn = document.querySelector('.off-canvas-btn');
    
    if (!offCanvasMenu.contains(event.target) && !offCanvasBtn.contains(event.target)) {
        offCanvasMenu.classList.remove('active');
    }
});

// Custom Modal Toggle
function toggleCustomModal() {
    const modal = document.getElementById('customModal');
    modal.classList.toggle('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('customModal');
    const modalContent = document.querySelector('.modal-content');
    
    if (event.target === modal) {
        modal.classList.remove('active');
    }
});

// Close modal when clicking close button
document.querySelector('.modal-close').addEventListener('click', function() {
    const modal = document.getElementById('customModal');
    modal.classList.remove('active');
});