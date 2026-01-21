// Set these for each customer demo...
const CUSTOMER_NAME = "Webex AI";
const CUSTOMER_IMAGE = "images/UOB.png";

// Set this stuff once and forget about it...
const WXCC_TELEPHONE_NUMBER = "+6560478480";
const IMI_SMS_WEBHOOK = "";
const IMI_CALLBACK_WEBHOOK =
  "https://hooks.sg.webexconnect.io/events/I4WVTJ9F2A";
const demoToolboxUserId = "8822";
const AGENT_IMAGE = "/images/agent.png";
const WHATSAPP_IMAGE = "/images/whatsapp_business_qr.png";
const AMB_IMAGE = "/images/apple_messages_for_business_qr_with_id.png";
const COFFEE_IMAGE = "/images/coffeeDemo.png";

// Global variables for Bootstrap modals and form elements
let bsSuccessModal, bsFailureModal;
let successMessage,
  callbackName,
  callbackNumber,
  callbackDepartment,
  callbackReason;
let emailName, emailAddress, emailSubject, emailMessage;
let smsName, smsNumber;

// Format phone number for display
function formatPhoneNumber(phoneNumber) {
  const phoneNumberString = phoneNumber.toString();

  // If it already starts with +, return as is (international format)
  if (phoneNumberString.startsWith("+")) {
    return phoneNumberString;
  }

  // Legacy support: if it's 8 digits, assume Singapore number
  const match = phoneNumberString.match(/^(\d{4})(\d{4})$/);
  if (match) {
    return `+65 ${match[1]} ${match[2]}`;
  }

  // Return original if format is unexpected
  return phoneNumberString;
}

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
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
  bsFailureModal = new bootstrap.Modal("#failureModal");
  bsSuccessModal = new bootstrap.Modal("#successModal");

  // Get reference to HTML elements
  successMessage = document.getElementById("successMessage");
  smsName = document.getElementById("smsName");
  smsNumber = document.getElementById("smsNumber");
  callbackName = document.getElementById("callbackName");
  callbackNumber = document.getElementById("callbackNumber");
  callbackDepartment = document.getElementById("callbackDepartment");
  callbackReason = document.getElementById("callbackReason");
  emailName = document.getElementById("emailName");
  emailAddress = document.getElementById("emailAddress");
  emailSubject = document.getElementById("emailSubject");
  emailMessage = document.getElementById("emailMessage");
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

  // Add event listener for Callback Modal Submit button
  document.getElementById("sendCallbackBtn").addEventListener("click", () => {
    if (callbackForm.checkValidity()) {
      callbackForm.classList.remove("was-validated");
      bsCallbackModal.hide();
      sendCallback();
    } else callbackForm.classList.add("was-validated");
  });

  // Add event listener for Email Modal Submit button
  document.getElementById("sendEmailBtn").addEventListener("click", () => {
    if (emailForm.checkValidity()) {
      emailForm.classList.remove("was-validated");
      bsEmailModal.hide();
      sendEmail();
    } else emailForm.classList.add("was-validated");
  });

  // Add event listener for SMS Modal Submit button
  document.getElementById("sendSmsBtn").addEventListener("click", () => {
    if (smsForm.checkValidity()) {
      smsForm.classList.remove("was-validated");
      bsSmsModal.hide();
      sendSMS();
    } else smsForm.classList.add("was-validated");
  });
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
async function sendCallback() {
  try {
    const delay = getCallbackDelay();

    const response = await fetchWithTimeout(IMI_CALLBACK_WEBHOOK, {
      timeout: 6000,
      method: "POST",
      body: JSON.stringify({
        name: callbackName.value,
        number: callbackNumber.value,
        department: callbackDepartment.value,
        reason: callbackReason.value,
        delay: delay,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Callback Status Code:", response.status);
    console.log("callback Response Data:", data);

    const number = callbackNumber.value;
    callbackName.value = "";
    callbackNumber.value = "";
    callbackDepartment.value = "";
    callbackReason.value = "";

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

// Send Email to dCloud
async function sendEmail() {
  try {
    const response = await fetchWithTimeout(
      "https://mm-brand.cxdemo.net/api/v1/email",
      {
        timeout: 6000, // six seconds
        method: "POST",
        body: JSON.stringify({
          name: emailName.value,
          email: emailAddress.value,
          subject: emailSubject.value,
          body: emailMessage.value,
          session: "custom",
          datacenter: "webex",
          userId: demoToolboxUserId,
          demo: "webex-custom",
          isUpstream: false,
          isInstantDemo: true,
          isSfdc: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("Email Status Code:", response.status);
    console.log("Email Response Data:", data);
    emailName.value = "";
    emailAddress.value = "";
    emailSubject.value = "";
    emailMessage.value = "";
    if (response.status == 202) {
      successMessage.innerHTML = `Thank you for your email.  We will respond shortly.`;
      bsToggle(bsSuccessModal);
    } else {
      bsToggle(bsFailureModal);
    }
  } catch (error) {
    bsToggle(bsFailureModal);
    console.log("Email something went wrong!");
    console.log("Email Error:", error);
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
  document.querySelector(".help-container").appendChild(resultsContainer);
}

// Category navigation
document.querySelectorAll(".category-item a").forEach((link) => {
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

// Navigation and UI Elements
const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const serviceCards = document.querySelectorAll(".service-card");
const contactForm = document.getElementById("contact-form");
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const testimonialSlider = document.querySelector(".testimonial-slider");
const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const prevButton = document.querySelector(
  ".testimonial-controls button:first-child"
);
const nextButton = document.querySelector(
  ".testimonial-controls button:last-child"
);
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

serviceCards.forEach((card) => {
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

// Testimonial slider
let currentSlide = 0;

function showSlide(index) {
  testimonialSlides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - index)}%)`;
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % testimonialSlides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide =
    (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
  showSlide(currentSlide);
}

prevButton.addEventListener("click", prevSlide);
nextButton.addEventListener("click", nextSlide);

// Auto-advance testimonials
setInterval(nextSlide, 5000);

// Form validation
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const formValues = Object.fromEntries(formData.entries());

  // Basic validation
  let isValid = true;
  const requiredFields = ["name", "email", "message"];

  requiredFields.forEach((field) => {
    const input = contactForm.querySelector(`[name="${field}"]`);
    if (!formValues[field]) {
      input.classList.add("error");
      isValid = false;
    } else {
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
contactForm.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
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
