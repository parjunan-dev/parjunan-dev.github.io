// Set these for each customer demo...
const CUSTOMER_NAME = "Webex Contact Center | Singapore";
const CUSTOMER_IMAGE = "images/SingaporePools.png";

// Set this stuff once and forget about it...
const WXCC_TELEPHONE_NUMBER = "+6582004000";
const IMI_SMS_WEBHOOK = "";
const IMI_CALLBACK_WEBHOOK = "";
const PROXY_SERVER_URL = "http://localhost:3000/submit-form"; // Local development
// const PROXY_SERVER_URL = "https://your-glitch-app.glitch.me/submit-form"; // When deployed to Glitch
const demoToolboxUserId = "";
const AGENT_IMAGE =
  "https://cdn.glitch.global/e39bce96-4dfa-4058-9775-199788361cb8/agent.png?v=1730959586778";
const WHATSAPP_IMAGE =
  "https://cdn.glitch.global/ac617fcb-2ab9-466a-84f5-08c5ecb0af5b/whatsapp_business_qr.png?v=1732251286668";
const AMB_IMAGE =
  "https://cdn.glitch.global/ac617fcb-2ab9-466a-84f5-08c5ecb0af5b/apple_messages_for_business_qr_with_id.png?v=1732251283447";
const COFFEE_IMAGE =
  "https://cdn.glitch.global/ac617fcb-2ab9-466a-84f5-08c5ecb0af5b/coffeeDemo.png?v=1732251295694";

// Format phone to +E164
function formatPhoneNumber(phoneNumber) {
  const phoneNumberString = phoneNumber.toString();
  const match = phoneNumberString.match(/^(\d{4})(\d{4})$/);
  if (!match) {
    return phoneNumberString; // Return original if the format is unexpected
  }
  return `+65 ${match[1]} ${match[2]}`;
}

// Helper functions
function toggleMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('active');
  }
}

function bsToggle(bsComponent) {
  if (bsComponent) {
    bsComponent.toggle();
  }
}

function getCallbackDelay() {
  return Math.floor(Math.random() * 5) + 1;
}

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

async function sendCallback(formValues) {
  try {
    const response = await fetchWithTimeout(IMI_CALLBACK_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formValues.name,
        number: formValues.number,
        department: formValues.department,
        reason: formValues.reason,
        userId: demoToolboxUserId
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return true;
  } catch (error) {
    console.error('Error sending callback:', error);
    return false;
  }
}

async function sendEmail(formData) {
  try {
    console.log('Starting email submission...', formData);
    console.log('Proxy server URL:', PROXY_SERVER_URL);
    
    const requestBody = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      userId: demoToolboxUserId
    };
    
    console.log('Request body:', requestBody);
    
    const response = await fetchWithTimeout(PROXY_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData.success;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function sendSMS() {
  try {
    const response = await fetchWithTimeout(IMI_SMS_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: smsName.value,
        number: smsNumber.value,
        userId: demoToolboxUserId
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

function displaySearchResults(results) {
  const resultsContainer = document.getElementById('search-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = results.map(result => `
      <div class="search-result">
        <h3>${result.title}</h3>
        <p>${result.description}</p>
        <a href="${result.url}">Read more</a>
      </div>
    `).join('');
  }
}

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Query all DOM elements once
  const testimonialSlider = document.querySelector(".testimonial-slider");
  const testimonialSlides = testimonialSlider ? testimonialSlider.querySelectorAll(".testimonial-slide") : [];
  const prevButton = document.querySelector(".testimonial-controls button:first-child");
  const nextButton = document.querySelector(".testimonial-controls button:last-child");
  const searchForm = document.getElementById("search-form");
  const helpSearchInput = document.getElementById("search-input");
  const helpCancelIcon = document.querySelector(".cancel-icon");
  const stats = document.querySelectorAll(".stat-number");
  const statsSection = document.querySelector(".stats");
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = "↑";
  scrollToTopBtn.className = "scroll-to-top";
  document.body.appendChild(scrollToTopBtn);

  // First, set all images
  const agentImage = document.getElementById("agent");
  if (agentImage) {
    agentImage.src = AGENT_IMAGE;
  }

  const whatsappQR = document.getElementById("whatsappQR");
  if (whatsappQR) {
    whatsappQR.src = WHATSAPP_IMAGE;
  }

  const ambQR = document.getElementById("ambQR");
  if (ambQR) {
    ambQR.src = AMB_IMAGE;
  }

  const coffeeDemoQR = document.getElementById("coffeeDemoQR");
  if (coffeeDemoQR) {
    coffeeDemoQR.src = COFFEE_IMAGE;
  }

  // Then set title and background image
  document.title = CUSTOMER_NAME;
  const bgImage = document.getElementById("bgImage");
  if (bgImage) {
    bgImage.src = CUSTOMER_IMAGE;
  }

  // Set telephone number
  const telephone = document.getElementById("telephone");
  if (telephone && WXCC_TELEPHONE_NUMBER) {
    telephone.href = "tel:" + WXCC_TELEPHONE_NUMBER;
    telephone.textContent = formatPhoneNumber(WXCC_TELEPHONE_NUMBER);
  }

  // Initialize Bootstrap components
  const bsContactMenu = new bootstrap.Offcanvas("#contactMenu");
  const bsCallModal = new bootstrap.Modal("#callModal", {
    focus: true,
    keyboard: true
  });
  const bsCallbackModal = new bootstrap.Modal("#callbackModal", {
    focus: true,
    keyboard: true
  });
  const bsEmailModal = new bootstrap.Modal("#emailModal", {
    focus: true,
    keyboard: true
  });
  const bsSmsModal = new bootstrap.Modal("#smsModal", {
    focus: true,
    keyboard: true
  });
  const bsWhatsappModal = new bootstrap.Modal("#whatsappModal", {
    focus: true,
    keyboard: true
  });
  const bsAmbModal = new bootstrap.Modal("#ambModal", {
    focus: true,
    keyboard: true
  });
  const bsCoffeeDemoModal = new bootstrap.Modal("#coffeeDemoModal", {
    focus: true,
    keyboard: true
  });
  const bsFailureModal = new bootstrap.Modal("#failureModal", {
    focus: true,
    keyboard: true
  });
  const bsSuccessModal = new bootstrap.Modal("#successModal", {
    backdrop: 'static',
    keyboard: true,
    focus: true
  });

  // Store the element that had focus before the modal was opened
  let lastFocusedElement = null;

  // Function to show success modal with proper focus management
  function showSuccessModal() {
    // Store the current focused element
    lastFocusedElement = document.activeElement;
    
    // Show the modal
    bsSuccessModal.show();
    
    // Set focus to the close button after modal is shown
    const modal = document.getElementById('successModal');
    const closeButton = modal.querySelector('.btn-close');
    if (closeButton) {
      setTimeout(() => closeButton.focus(), 100);
    }
    
    // Add event listener for when modal is hidden
    modal.addEventListener('hidden.bs.modal', function onHidden() {
      // Restore focus to the previously focused element
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
      // Remove the event listener to prevent memory leaks
      modal.removeEventListener('hidden.bs.modal', onHidden);
    });
  }

  // Get reference to HTML elements
  const successMessage = document.getElementById("successMessage");
  const smsName = document.getElementById("smsName");
  const smsNumber = document.getElementById("smsNumber");
  const callbackName = document.getElementById("callbackName");
  const callbackNumber = document.getElementById("callbackNumber");
  const callbackDepartment = document.getElementById("callbackDepartment");
  const callbackReason = document.getElementById("callbackReason");
  const emailName = document.getElementById("emailName");
  const emailAddress = document.getElementById("emailAddress");
  const emailSubject = document.getElementById("emailSubject");
  const emailMessage = document.getElementById("emailMessage");
  const callbackForm = document.getElementById("callbackForm");
  const emailForm = document.getElementById("emailForm");
  const smsForm = document.getElementById("smsForm");

  console.log('Email form elements:', {
    emailForm,
    emailName,
    emailAddress,
    emailSubject,
    emailMessage
  });

  // Get reference to IMI Web Chat div
  const imiWebChat = document.getElementById("divicw");

  // Add Event Listeners for Contact Menu Items
  const callLink = document.getElementById("callLink");
  if (callLink) {
    callLink.addEventListener("click", function () {
      bsCallModal.show();
      bsContactMenu.hide();
    });
  }

  const callbackLink = document.getElementById("callbackLink");
  if (callbackLink) {
    callbackLink.addEventListener("click", function () {
      bsCallbackModal.show();
      bsContactMenu.hide();
    });
  }

  const emailLink = document.getElementById("emailLink");
  if (emailLink) {
    emailLink.addEventListener("click", function () {
      bsEmailModal.show();
      bsContactMenu.hide();
    });
  }

  const smsLink = document.getElementById("smsLink");
  if (smsLink) {
    smsLink.addEventListener("click", function () {
      bsSmsModal.show();
      bsContactMenu.hide();
    });
  }

  const whatsappLink = document.getElementById("whatsappLink");
  if (whatsappLink) {
    whatsappLink.addEventListener("click", function () {
      bsWhatsappModal.show();
      bsContactMenu.hide();
    });
  }

  const ambLink = document.getElementById("ambLink");
  if (ambLink) {
    ambLink.addEventListener("click", function () {
      bsAmbModal.show();
      bsContactMenu.hide();
    });
  }

  const coffeeDemoLink = document.getElementById("coffeeDemoLink");
  if (coffeeDemoLink) {
    coffeeDemoLink.addEventListener("click", function () {
      bsCoffeeDemoModal.show();
      bsContactMenu.hide();
    });
  }

  // Hide imi when the Contact Menu is open
  const contactMenu = document.getElementById("contactMenu");
  if (contactMenu) {
    contactMenu.addEventListener("shown.bs.offcanvas", () => {
      if (imiWebChat) imiWebChat.hidden = true;
    });

    // Show imi when the Contact Menu is closed
    contactMenu.addEventListener("hidden.bs.offcanvas", () => {
      if (imiWebChat) imiWebChat.hidden = false;
    });
  }

  // Dropdown functionality
  const dropbtn = document.querySelector('.dropbtn');
  const dropdown = document.getElementById('myDropdown');
  if (dropbtn && dropdown) {
    dropbtn.addEventListener('click', function() {
      dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
      if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn *')) {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      }
    });
  }

  // Service Cards Carousel
  const servicesGrid = document.querySelector(".services-grid");
  const servicesCards = servicesGrid ? servicesGrid.querySelectorAll(".service-card") : [];
  const carouselPrev = document.querySelector(".carousel-prev");
  const carouselNext = document.querySelector(".carousel-next");

  if (servicesGrid && servicesCards.length > 0 && carouselPrev && carouselNext) {
    let currentIndex = 0;
    const cardWidth = servicesCards[0].offsetWidth;
    const gap = 20; // Gap between cards
    const totalCards = servicesCards.length;
    const visibleCards = 3; // Number of cards visible at once

    function updateCarousel() {
      const offset = -(currentIndex * (cardWidth + gap));
      servicesGrid.style.transform = `translateX(${offset}px)`;
    }

    carouselPrev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    carouselNext.addEventListener("click", () => {
      if (currentIndex < totalCards - visibleCards) {
        currentIndex++;
        updateCarousel();
      }
    });

    updateCarousel();

    servicesCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) {
          return;
        }
        
        const title = card.querySelector('.service-card-title').textContent;
        const description = card.querySelector('.service-card-description').textContent;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'service-modal';
        modal.innerHTML = `
            <div class="service-modal-content">
                <h2>${title}</h2>
                <p>${description}</p>
                <button class="close-modal">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
          document.body.removeChild(modal);
        });
      });
    });
  }

  // Testimonial slider logic
  if (testimonialSlider && testimonialSlides.length > 0 && prevButton && nextButton) {
    let currentIndex = 0;
    const totalTestimonials = testimonialSlides.length;

    function showSlide(index) {
      if (index < 0) {
        currentIndex = totalTestimonials - 1;
      } else if (index >= totalTestimonials) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      testimonialSlides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - currentIndex)}%)`;
      });
    }

    prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
    
    showSlide(currentIndex);
  }

  // Search functionality
  if (searchForm && helpSearchInput && helpCancelIcon) {
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
      const searchQuery = helpSearchInput.value.trim();
      if (searchQuery) {
        const encodedQuery = encodeURIComponent(searchQuery);
        window.location.href = `https://help.webex.com/en-us/result/${encodedQuery}?tab=support&offset=10`;
      }
    });

    helpSearchInput.addEventListener("input", function () {
      helpCancelIcon.style.display = this.value ? "block" : "none";
    });

    helpCancelIcon.addEventListener("click", function () {
      helpSearchInput.value = "";
      this.style.display = "none";
      helpSearchInput.focus();
    });
  }

// Stats counter animation
  if (statsSection && stats.length > 0) {
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        stats.forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-target"));
              const duration = 2000;
              const step = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < target) {
              stat.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              stat.textContent = target;
            }
          };

          updateCounter();
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statsObserver.observe(statsSection);
  }

  // Scroll to top functionality
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

  // Form submission handlers
  if (callbackForm) {
    callbackForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      const formValues = {
        name: callbackName.value,
        number: callbackNumber.value,
        department: callbackDepartment.value,
        reason: callbackReason.value
      };

      const success = await sendCallback(formValues);
      if (success) {
        bsCallbackModal.hide();
        showSuccessModal();
        successMessage.textContent = `We'll call you back in ${getCallbackDelay()} minutes`;
      } else {
        bsFailureModal.show();
      }
    });
  }

  if (emailForm) {
    console.log('Adding email form submit listener');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    
    if (sendEmailBtn) {
      console.log('Found send email button');
      sendEmailBtn.addEventListener('click', async function(e) {
        console.log('Send email button clicked');
        e.preventDefault();
        
        const formData = {
          name: emailName.value,
          email: emailAddress.value,
          subject: emailSubject.value,
          message: emailMessage.value
        };

        console.log('Form data:', formData);
        
        try {
          const success = await sendEmail(formData);
          console.log('Email submission result:', success);
          
          if (success) {
            bsEmailModal.hide();
            showSuccessModal();
            successMessage.textContent = "Your email has been sent successfully";
            
            // Clear the form
            emailName.value = '';
            emailAddress.value = '';
            emailSubject.value = '';
            emailMessage.value = '';
          } else {
            bsFailureModal.show();
          }
        } catch (error) {
          console.error('Error in email form submission:', error);
          bsFailureModal.show();
        }
      });
    } else {
      console.error('Send email button not found');
    }
  } else {
    console.error('Email form not found in the DOM');
  }

  if (smsForm) {
    smsForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      const success = await sendSMS();
      if (success) {
        bsSmsModal.hide();
        showSuccessModal();
        successMessage.textContent = "Your SMS has been sent successfully";
      } else {
        bsFailureModal.show();
      }
    });
  }

  // Add event listeners for modal show/hide
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('show.bs.modal', () => {
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
    });

    modal.addEventListener('hide.bs.modal', () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    });
  });
});
