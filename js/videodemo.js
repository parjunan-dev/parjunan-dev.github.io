function toggleMobileMenu() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    overlay.classList.toggle('active');
    body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
} 