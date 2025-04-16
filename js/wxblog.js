document.addEventListener('DOMContentLoaded', function() {
    // Handle dropdown functionality
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Close all other dropdowns
            dropdownButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.classList.remove('active');
                    const otherContent = otherButton.nextElementSibling;
                    otherContent.classList.remove('active');
                }
            });

            // Toggle current dropdown
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.classList.toggle('active');
        });
    });

    // Handle recent post navigation
    const recentPosts = document.querySelectorAll('.recent-post');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    recentPosts.forEach(post => {
        post.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the post title and convert it to ID format
            const postTitle = this.querySelector('h4').textContent;
            const postId = postTitle.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            // Hide all posts
            blogPosts.forEach(blogPost => {
                blogPost.style.display = 'none';
            });
            
            // Show the selected post
            const selectedPost = document.getElementById(postId);
            if (selectedPost) {
                selectedPost.style.display = 'block';
                
                // Scroll to the top of the content
                document.querySelector('.blog-content').scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Handle sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-dropdown a, .recent-posts a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const postPath = this.getAttribute('href');
            
            // Load the post content
            fetch(postPath)
                .then(response => response.text())
                .then(html => {
                    // Parse the fetched HTML to get the article element
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const newArticle = doc.querySelector('article.blog-post');

                    if (!newArticle) {
                        console.error('Fetched content does not contain an article.blog-post element.');
                        return;
                    }

                    // Find the main content area and the existing article (if any)
                    const mainContent = document.querySelector('.blog-content');
                    const existingArticle = mainContent.querySelector('article.blog-post');

                    // Ensure necessary styles are on the new article (from CSS ideally, but let's be safe)
                    newArticle.style.width = '100%';
                    newArticle.style.margin = '0';
                    newArticle.style.boxSizing = 'border-box';
                    // Clear potentially conflicting inline styles from previous attempts
                    newArticle.style.padding = '';
                    newArticle.style.borderRadius = '';
                    newArticle.style.boxShadow = '';

                    if (existingArticle) {
                        // If an article already exists, replace it
                        mainContent.replaceChild(newArticle, existingArticle);
                    } else {
                        // If the content area is empty, append the new article
                        mainContent.innerHTML = ''; // Clear potentially leftover nodes
                        mainContent.appendChild(newArticle);
                    }

                    // Update the URL without reloading the page
                    history.pushState({}, '', postPath);
                    
                    // Scroll to top
                    window.scrollTo(0, 0);
                })
                .catch(error => console.error('Error loading post:', error));
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        fetch(window.location.pathname)
            .then(response => response.text())
            .then(html => {
                 // Parse the fetched HTML to get the article element
                 const parser = new DOMParser();
                 const doc = parser.parseFromString(html, 'text/html');
                 const newArticle = doc.querySelector('article.blog-post');

                 if (!newArticle) return;

                 // Find the main content area and the existing article (if any)
                 const mainContent = document.querySelector('.blog-content');
                 const existingArticle = mainContent.querySelector('article.blog-post');

                 // Ensure necessary styles
                 newArticle.style.width = '100%';
                 newArticle.style.margin = '0';
                 newArticle.style.boxSizing = 'border-box';
                 newArticle.style.padding = '';
                 newArticle.style.borderRadius = '';
                 newArticle.style.boxShadow = '';

                 if (existingArticle) {
                     mainContent.replaceChild(newArticle, existingArticle);
                 } else {
                     mainContent.innerHTML = '';
                     mainContent.appendChild(newArticle);
                 }
            })
            .catch(error => console.error('Error loading post:', error));
    });
}); 