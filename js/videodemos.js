document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    const titleElement = document.querySelector('.demo-title');
    const descriptionElement = document.querySelector('.demo-text');

    // Initialize first slide
    slides[0].classList.add('active');
    updateTextContent(slides[0]);

    function updateTextContent(slide) {
        const title = slide.getAttribute('data-title');
        const description = slide.getAttribute('data-description');
        titleElement.textContent = title;
        descriptionElement.textContent = description;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                updateTextContent(slide);
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            }
        });
    }

    function prevSlide() {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides - 1;
        showSlide(currentSlide);
    }

    function nextSlide() {
        currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
        showSlide(currentSlide);
    }

    // Add touch event listeners for swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselContainer = document.querySelector('.carousel-container');
    
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Add click event listeners to carousel controls
    document.querySelector('.carousel-control.prev').addEventListener('click', prevSlide);
    document.querySelector('.carousel-control.next').addEventListener('click', nextSlide);
}); 