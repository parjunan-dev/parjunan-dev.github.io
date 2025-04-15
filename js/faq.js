document.addEventListener('DOMContentLoaded', function() {
    // Select all FAQ questions
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Add click event to each question
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            // Get the parent FAQ item
            const item = btn.closest('.faq-item');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('is-active');
                }
            });
            
            // Toggle the clicked item
            item.classList.toggle('is-active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = item.classList.contains('is-active');
            btn.setAttribute('aria-expanded', isExpanded);
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.setAttribute('aria-hidden', !isExpanded);
            }
        });
    });
}); 