// Set these for each customer demo...
const CUSTOMER_NAME = "Webex Contact Center | Singapore";
const CUSTOMER_IMAGE = "images/SingaporePools.png";

// Set this stuff once and forget about it...
const WXCC_TELEPHONE_NUMBER = "+6582004000";
const IMI_SMS_WEBHOOK = "";
const IMI_CALLBACK_WEBHOOK = "";
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

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
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
  const bsCallModal = new bootstrap.Modal("#callModal");
  const bsCallbackModal = new bootstrap.Modal("#callbackModal");
  const bsEmailModal = new bootstrap.Modal("#emailModal");
  const bsSmsModal = new bootstrap.Modal("#smsModal");
  const bsWhatsappModal = new bootstrap.Modal("#whatsappModal");
  const bsAmbModal = new bootstrap.Modal("#ambModal");
  const bsCoffeeDemoModal = new bootstrap.Modal("#coffeeDemoModal");
  const bsFailureModal = new bootstrap.Modal("#failureModal");
  const bsSuccessModal = new bootstrap.Modal("#successModal");

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

  // Dropdown functionality - only initialize if elements exist
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

  // Service Cards Carousel - only initialize if elements exist
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

    // Function to update carousel position
    function updateCarousel() {
      const offset = -(currentIndex * (cardWidth + gap));
      servicesGrid.style.transform = `translateX(${offset}px)`;
    }

    // Previous button click handler
    carouselPrev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    // Next button click handler
    carouselNext.addEventListener("click", () => {
      if (currentIndex < totalCards - visibleCards) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Initialize carousel
    updateCarousel();

    // Add click handlers to service cards
    servicesCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on a button or link
        if (e.target.closest('button') || e.target.closest('a')) {
          return;
        }
        
        // Get the card's title and description
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
        
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .service-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .service-modal-content {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                max-width: 600px;
                width: 90%;
                position: relative;
            }
            .service-modal h2 {
                color: var(--webex-text);
                margin-bottom: 1rem;
            }
            .service-modal p {
                color: var(--webex-text-light);
                line-height: 1.6;
            }
            .close-modal {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--webex-text);
            }
        `;
        document.head.appendChild(style);
        
        // Close modal when clicking the close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
          modal.remove();
          style.remove();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.remove();
            style.remove();
          }
        });
      });
    });
  }

  // Testimonial slider
  let currentSlide = 0;
  const testimonialSlider = document.querySelector(".testimonial-slider");
  const testimonialSlides = testimonialSlider ? testimonialSlider.querySelectorAll(".testimonial-slide") : [];
  const prevButton = document.querySelector(".testimonial-controls button:first-child");
  const nextButton = document.querySelector(".testimonial-controls button:last-child");

  if (testimonialSlider && testimonialSlides.length > 0 && prevButton && nextButton) {
    function showSlide(index) {
      testimonialSlides.forEach((slide, i) => {
        if (slide) {
          slide.style.transform = `translateX(${100 * (i - index)}%)`;
        }
      });
    }

    function nextSlide() {
      if (testimonialSlides.length > 0) {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
      }
    }

    function prevSlide() {
      if (testimonialSlides.length > 0) {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
      }
    }

    // Previous button click handler
    if (prevButton) {
      prevButton.addEventListener("click", prevSlide);
    }

    // Next button click handler
    if (nextButton) {
      nextButton.addEventListener("click", nextSlide);
    }

    // Initialize slider
    showSlide(currentSlide);

    // Auto-advance testimonials
    if (testimonialSlides.length > 0) {
      setInterval(nextSlide, 5000);
    }
  }

  // Add event listener for Email Modal Submit button
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const emailModal = document.getElementById("emailModal");
  const successModal = document.getElementById("successModal");
  const failureModal = document.getElementById("failureModal");

  if (sendEmailBtn && emailForm && emailModal) {
    sendEmailBtn.addEventListener("click", async () => {
      console.log("Send email button clicked");
      
      // Get form values directly from inputs
      const formValues = {
        name: document.getElementById("emailName")?.value || "",
        email: document.getElementById("emailAddress")?.value || "",
        subject: document.getElementById("emailSubject")?.value || "",
        message: document.getElementById("emailMessage")?.value || ""
      };

      // Basic validation
      let isValid = true;
      Object.entries(formValues).forEach(([key, value]) => {
        if (!value) {
          const input = document.getElementById(`email${key.charAt(0).toUpperCase() + key.slice(1)}`);
          if (input) {
            input.classList.add("error");
            isValid = false;
          }
        }
      });

      if (isValid) {
        console.log("Form is valid, proceeding with submission");
        try {
          await sendEmail(formValues);
          
          // Hide email modal
          const bsEmailModal = bootstrap.Modal.getInstance(emailModal);
          if (bsEmailModal) {
            bsEmailModal.hide();
          }
          
          // Show success modal
          if (successModal) {
            const bsSuccessModal = new bootstrap.Modal(successModal);
            bsSuccessModal.show();
          }
          
          emailForm.reset();
        } catch (error) {
          console.error("Email submission error:", error);
          // Show failure modal
          if (failureModal) {
            const bsFailureModal = new bootstrap.Modal(failureModal);
            bsFailureModal.show();
          }
        }
      } else {
        console.log("Form is invalid, showing validation errors");
        emailForm.classList.add("was-validated");
      }
    });
  }

  // Add event listener for Callback Modal Submit button
  const sendCallbackBtn = document.getElementById("sendCallbackBtn");
  if (sendCallbackBtn && callbackForm) {
    sendCallbackBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("Callback form submitted");

      const formData = new FormData(callbackForm);
      const formValues = Object.fromEntries(formData.entries());

      // Basic validation
      let isValid = true;
      const requiredFields = ["name", "number", "department", "reason"];

      requiredFields.forEach((field) => {
        const input = callbackForm.querySelector(`[name="${field}"]`);
        if (input && !formValues[field]) {
          input.classList.add("error");
          isValid = false;
        } else if (input) {
          input.classList.remove("error");
        }
      });

      if (isValid) {
        console.log("Form is valid, proceeding with submission");
        try {
          await sendCallback(formValues);
          
          // Hide callback modal
          const bsCallbackModal = bootstrap.Modal.getInstance(callbackModal);
          if (bsCallbackModal) {
            bsCallbackModal.hide();
          }
          
          // Show success modal
          if (successModal) {
            const bsSuccessModal = new bootstrap.Modal(successModal);
            bsSuccessModal.show();
          }
          
          callbackForm.reset();
        } catch (error) {
          console.error("Callback submission error:", error);
          // Show failure modal
          if (failureModal) {
            const bsFailureModal = new bootstrap.Modal(failureModal);
            bsFailureModal.show();
          }
        }
      } else {
        console.log("Form is invalid, showing validation errors");
        callbackForm.classList.add("was-validated");
      }
    });
  }

  // Add event listener for SMS Modal Submit button
  const sendSmsBtn = document.getElementById("sendSmsBtn");
  if (sendSmsBtn && smsForm) {
    sendSmsBtn.addEventListener("click", () => {
      if (smsForm.checkValidity()) {
        smsForm.classList.remove("was-validated");
        bsSmsModal.hide();
        sendSMS();
      } else smsForm.classList.add("was-validated");
    });
  }

  // Form validation
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll("input, textarea");
    
    if (formInputs.length > 0) {
      // Form submission handler
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());

        // Basic validation
        let isValid = true;
        const requiredFields = ["name", "email", "message"];

        requiredFields.forEach((field) => {
          const input = contactForm.querySelector(`[name="${field}"]`);
          if (input && !formValues[field]) {
            input.classList.add("error");
            isValid = false;
          } else if (input) {
            input.classList.remove("error");
          }
        });

        if (isValid) {
          // Here you would typically send the form data to a server
          console.log("Form submitted:", formValues);
          contactForm.reset();
          alert("Thank you for your message! We will get back to you soon.");
        }
      });

      // Remove error class on input
      formInputs.forEach((input) => {
        if (input) {
          input.addEventListener("input", () => {
            input.classList.remove("error");
          });
        }
      });
    }
  }

  // Chat functionality
  const chatForm = document.getElementById("chatForm");
  const sendChatBtn = document.getElementById("sendChatBtn");
  const chatModal = document.getElementById("chatModal");

  if (chatForm && sendChatBtn && chatModal) {
    const handleChatSubmit = async (e) => {
      e.preventDefault();
      console.log("Chat form submitted");

      const formData = new FormData(chatForm);
      const formValues = Object.fromEntries(formData.entries());

      // Basic validation
      let isValid = true;
      const requiredFields = ["name", "email", "department", "message"];

      requiredFields.forEach((field) => {
        const input = chatForm.querySelector(`[name="${field}"]`);
        if (input && !formValues[field]) {
          input.classList.add("error");
          isValid = false;
        } else if (input) {
          input.classList.remove("error");
        }
      });

      if (isValid) {
        console.log("Form is valid, proceeding with submission");
        try {
          await sendChat(formValues);
          
          // Hide chat modal
          const bsChatModal = bootstrap.Modal.getInstance(chatModal);
          if (bsChatModal) {
            bsChatModal.hide();
          }
          
          // Show success modal
          if (successModal) {
            const bsSuccessModal = new bootstrap.Modal(successModal);
            bsSuccessModal.show();
          }
          
          chatForm.reset();
        } catch (error) {
          console.error("Chat submission error:", error);
          // Show failure modal
          if (failureModal) {
            const bsFailureModal = new bootstrap.Modal(failureModal);
            bsFailureModal.show();
          }
        }
      } else {
        console.log("Form is invalid, showing validation errors");
        chatForm.classList.add("was-validated");
      }
    };

    chatForm.addEventListener("submit", handleChatSubmit);
  }
});

// Toggles a bootstrap component
function bsToggle(bsComponent) {
  bsComponent.toggle();
}

// Gets the callback delay from the callback modal
function getCallbackDelay() {
  const immediateCallback = document.getElementById("immediateCallback");
  const delayCallbackMinutes = document.getElementById("delayCallbackMinutes");

  if (immediateCallback.checked) {
    return 0;
  } else {
    return delayCallbackMinutes.value * 60;
  }
}

// Improved version of fetch() with a configurable timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 6000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

// Send callback to imi
async function sendCallback(formValues) {
  try {
    const delay = getCallbackDelay();

    const response = await fetchWithTimeout(IMI_CALLBACK_WEBHOOK, {
      timeout: 6000,
      method: "POST",
      body: JSON.stringify({
        name: formValues.name,
        number: formValues.number,
        department: formValues.department,
        reason: formValues.reason,
        delay: delay,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Callback Status Code:", response.status);
    console.log("callback Response Data:", data);

    const number = formValues.number;
    formValues.name = "";
    formValues.number = "";
    formValues.department = "";
    formValues.reason = "";

    if (data.response[0].code == 1002) {
      successMessage.innerHTML = `We will call you at ${formatPhoneNumber(
        number
      )} shortly.`;
      bsToggle(bsSuccessModal);
    } else {
      bsToggle(bsFailureModal);
    }
  } catch (error) {
    bsToggle(bsFailureModal);
    console.log("Callback something went wrong!");
    console.log("Callback Error:", error);
  }
}

// Function to send email data to webhook
async function sendEmail(formData) {
    try {
        console.log('Starting email submission...');
        const webhookUrls = [
            'https://webhook.site/d604bbf2-bac1-41ee-a5ea-63f966c8febe',
            'https://hooks.sg.webexconnect.io/events/ODGVAWIT0L'
        ];
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        
        console.log('Sending data to webhooks:', formData);

        // Send to both webhooks simultaneously
        const responses = await Promise.all(webhookUrls.map(async (webhookUrl) => {
            const targetUrl = proxyUrl + encodeURIComponent(webhookUrl);
            console.log('Sending to webhook URL:', targetUrl);
            
            const response = await fetchWithTimeout(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for URL: ${webhookUrl}`);
            }

            return response.json();
        }));

        console.log('Email submission successful to all webhooks:', responses);
        return { success: true, data: responses };
    } catch (error) {
        console.error('Email submission error:', error);
        return { success: false, error: error.message };
    }
}

// Send SMS to imi
async function sendSMS() {
  try {
    const response = await fetchWithTimeout(IMI_SMS_WEBHOOK, {
      timeout: 6000,
      method: "POST",
      body: JSON.stringify({
        name: smsName.value,
        number: smsNumber.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("SMS Status Code:", response.status);
    console.log("SMS Response Data:", data);

    const number = smsNumber.value;
    smsName.value = "";
    smsNumber.value = "";

    if (data.response[0].code == 1002) {
      successMessage.innerHTML = `We sent a SMS to your ${formatPhoneNumber(
        number
      )} number.`;
      bsToggle(bsSuccessModal);
    } else {
      bsToggle(bsFailureModal);
    }
  } catch (error) {
    bsToggle(bsFailureModal);
    console.log("SMS something went wrong!");
    console.log("SMS Error:", error);
  }
}

// Help Center Search Functionality
const searchBar = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-bar button");

// Only initialize search functionality if elements exist
if (searchBar && searchButton) {
  // Sample help articles data
  const helpArticles = [
    {
      title: "Getting Started Guide",
      category: "Getting Started",
      content: "Learn how to get started with our platform...",
    },
    {
      title: "Common Issues",
      category: "Troubleshooting",
      content: "Solutions to common problems...",
    },
    {
      title: "Advanced Features",
      category: "Advanced Features",
      content: "Learn about our advanced features...",
    },
  ];

  // Search functionality
  searchButton.addEventListener("click", () => {
    const searchTerm = searchBar.value.toLowerCase();
    if (searchTerm) {
      const results = helpArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm)
      );
      displaySearchResults(results);
    }
  });

  // Display search results
  function displaySearchResults(results) {
    const resultsContainer = document.createElement("div");
    resultsContainer.className = "search-results";

    if (results.length === 0) {
      resultsContainer.innerHTML =
        "<p>No results found. Try a different search term.</p>";
    } else {
      resultsContainer.innerHTML = results
        .map(
          (article) => `
            <div class="search-result-item">
                <h3>${article.title}</h3>
                <p>${article.content}</p>
                <span class="category">${article.category}</span>
            </div>
        `
        )
        .join("");
    }

    // Remove existing results if any
    const existingResults = document.querySelector(".search-results");
    if (existingResults) {
      existingResults.remove();
    }

    // Add new results
    const helpContainer = document.querySelector(".help-container");
    if (helpContainer) {
      helpContainer.appendChild(resultsContainer);
    }
  }

  // Category navigation
  const categoryLinks = document.querySelectorAll(".category-item a");
  if (categoryLinks.length > 0) {
    categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = e.target
          .closest(".category-item")
          .querySelector("h3").textContent;
        const categoryArticles = helpArticles.filter(
          (article) => article.category === category
        );
        displaySearchResults(categoryArticles);
      });
    });
  }
}

// Navigation and UI Elements
const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.getElementById("contact-form");
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const testimonialSlider = document.querySelector(".testimonial-slider");
const testimonialSlides = testimonialSlider ? testimonialSlider.querySelectorAll(".testimonial-slide") : [];
const prevButton = document.querySelector(".testimonial-controls button:first-child");
const nextButton = document.querySelector(".testimonial-controls button:last-child");
const stats = document.querySelectorAll(".stat-number");
const statsSection = document.querySelector(".stats");

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Service cards animation
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

servicesCards.forEach((card) => {
  observer.observe(card);
});

// Portfolio filtering
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    portfolioItems.forEach((item) => {
      if (
        filterValue === "all" ||
        item.getAttribute("data-category") === filterValue
      ) {
        item.style.display = "block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        }, 100);
      } else {
        item.style.opacity = "0";
        item.style.transform = "scale(0.8)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  });
});

// Stats counter animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        stats.forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-target"));
          const duration = 2000; // 2 seconds
          const step = target / (duration / 16); // 60fps
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

// Scroll to Top Button
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerHTML = "↑";
scrollToTopBtn.className = "scroll-to-top";
document.body.appendChild(scrollToTopBtn);

// Style the scroll to top button
const style = document.createElement("style");
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #0066ff;
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        font-size: 20px;
        transition: opacity 0.3s;
    }
    
    .scroll-to-top:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Show/hide scroll to top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Search functionality
const searchForm = document.getElementById("search-form");
const helpSearchInput = document.getElementById("search-input");
const helpCancelIcon = document.querySelector(".cancel-icon");

// Handle form submission
searchForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  const searchQuery = helpSearchInput.value.trim();
  if (searchQuery) {
    // Encode the search query for URL
    const encodedQuery = encodeURIComponent(searchQuery);
    // Redirect to help.webex.com with the search query
    window.location.href = `https://help.webex.com/en-us/result/${encodedQuery}?tab=support&offset=10`;
  }
});

// Show/hide cancel icon based on input
helpSearchInput.addEventListener("input", function () {
  helpCancelIcon.style.display = this.value ? "block" : "none";
});

// Clear search on cancel icon click
helpCancelIcon.addEventListener("click", function () {
  helpSearchInput.value = "";
  this.style.display = "none";
  helpSearchInput.focus();
});

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  menu.classList.toggle("active");
  hamburger.classList.toggle("active");

  // Prevent body scroll when menu is open
  document.body.style.overflow = menu.classList.contains("active")
    ? "hidden"
    : "";
}
