const demoToolboxUserId = "8822";

// Placeholder JS for Contact Page Interactivity

document.addEventListener("DOMContentLoaded", () => {
  // Expandable info card example (future enhancement)
  const cards = document.querySelectorAll(".info-card");

  // Action buttons can be wired to modals, links, or chat widgets
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const action = tile.innerText.trim();
      // alert(`Performing action: ${action}`); // Commenting out generic alert
      // Trigger corresponding support flow here

      // Specific handler for track order button - REMOVED as modal handles this
      // if (tile.id === 'track-order-btn') { ... }

      // Keep original generic alert for other tiles, or implement other specific actions
      // Only alert if it's NOT a button that opens a modal
      if (
        tile.id !== "track-order-btn" &&
        tile.id !== "make-changes-btn" &&
        tile.id !== "report-issue-btn"
      ) {
        alert(`Performing action: ${action}`);
      }
    });
  });

  // Email send button handler
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", () => {
      const elements = initializeFormElements();
      const bsComponents = initializeBootstrapComponents();

      if (elements && elements.emailForm && bsComponents) {
        if (elements.emailForm.checkValidity()) {
          elements.emailForm.classList.remove("was-validated");
          sendEmail();
        } else {
          elements.emailForm.classList.add("was-validated");
        }
      }
    });
  }

  // Initialize FAQ
  try {
    initFAQAccordion();
  } catch (error) {
    console.error("Error initializing FAQ Accordion:", error);
  }

  initializeMobileNavToggle(); // Call the new function

  // Contact form submission handler
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      const emailInput = document.getElementById("email");
      const orderIdInput = document.getElementById("to-orderId");

      // Validation for Track Order
      if (
        !nameInput.value ||
        !phoneInput.value ||
        !emailInput.value ||
        !orderIdInput.value
      ) {
        const trackOrderModalEl = document.getElementById("trackOrderModal");
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");

        if (failureMessageEl)
          failureMessageEl.textContent =
            "Please fill in all required fields for Track Order.";

        if (trackOrderModalEl && failureModalEl) {
          trackOrderModalEl.addEventListener(
            "hidden.bs.modal",
            function onTrackOrderHidden() {
              const failureModalInstance = new bootstrap.Modal(failureModalEl);
              failureModalInstance.show();
              trackOrderModalEl.removeEventListener(
                "hidden.bs.modal",
                onTrackOrderHidden
              ); // Clean up listener
            },
            { once: true }
          ); // Ensure listener is called only once
          const trackOrderModalInstance =
            bootstrap.Modal.getInstance(trackOrderModalEl);
          if (trackOrderModalInstance) trackOrderModalInstance.hide();
        } else if (failureModalEl) {
          // Fallback if trackOrderModalEl is somehow not found
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        return;
      }
      if (phoneInput.value.startsWith("+")) {
        const trackOrderModalEl = document.getElementById("trackOrderModal");
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");

        if (failureMessageEl)
          failureMessageEl.textContent =
            "Invalid phone number format. Please enter without the leading '+'. E.g., 6598765432";

        if (trackOrderModalEl && failureModalEl) {
          trackOrderModalEl.addEventListener(
            "hidden.bs.modal",
            function onTrackOrderHiddenPhone() {
              const failureModalInstance = new bootstrap.Modal(failureModalEl);
              failureModalInstance.show();
              trackOrderModalEl.removeEventListener(
                "hidden.bs.modal",
                onTrackOrderHiddenPhone
              ); // Clean up listener
            },
            { once: true }
          );
          const trackOrderModalInstance =
            bootstrap.Modal.getInstance(trackOrderModalEl);
          if (trackOrderModalInstance) trackOrderModalInstance.hide();
        } else if (failureModalEl) {
          // Fallback
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        return;
      }

      const payload = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        orderId: orderIdInput.value,
        source: "Track Order",
      };

      try {
        const response = await fetch(
          "https://hooks.sg.webexconnect.io/events/X6210XGYRO",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const successModalEl = document.getElementById("successModal");
          const successMessageEl = document.getElementById("successMessage");
          if (successMessageEl)
            successMessageEl.textContent =
              "Thanks! We'll message you the details shortly.";
          if (successModalEl) {
            const modal = new bootstrap.Modal(successModalEl);
            modal.show();
          }

          contactForm.reset();
          const trackOrderModalEl = document.getElementById("trackOrderModal");
          if (trackOrderModalEl) {
            const modalInstance =
              bootstrap.Modal.getInstance(trackOrderModalEl);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        } else {
          const errorData = await response.text();
          const failureModalEl = document.getElementById("failureModal");
          const failureMessageEl = document.getElementById("failureMessage");
          if (failureMessageEl)
            failureMessageEl.textContent = `Oops! Something went wrong. Server responded with: ${response.status} - ${errorData}`;
          if (failureModalEl) {
            const modal = new bootstrap.Modal(failureModalEl);
            modal.show();
          }
          console.error("Webhook error:", response.status, errorData);
        }
      } catch (error) {
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");
        if (failureMessageEl)
          failureMessageEl.textContent =
            "Oops! Something went wrong. Please check your connection and try again. Details: " +
            error.message;
        if (failureModalEl) {
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        console.error("Fetch error:", error);
      }
    });
  }

  // Make Changes form submission handler
  const makeChangesForm = document.getElementById("make-changes-form");
  if (makeChangesForm) {
    makeChangesForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("mc-name");
      const phoneInput = document.getElementById("mc-phone");
      const emailInput = document.getElementById("mc-email");
      const orderIdInput = document.getElementById("mc-orderId");
      const changesInput = document.getElementById("mc-changes");

      // Validation for Make Changes
      if (
        !nameInput.value ||
        !phoneInput.value ||
        !emailInput.value ||
        !orderIdInput.value ||
        !changesInput.value
      ) {
        const makeChangesModalEl = document.getElementById("makeChangesModal");
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");

        if (failureMessageEl)
          failureMessageEl.textContent =
            "Please fill in all required fields for Make Changes.";

        if (makeChangesModalEl && failureModalEl) {
          makeChangesModalEl.addEventListener(
            "hidden.bs.modal",
            function onMakeChangesHidden() {
              const failureModalInstance = new bootstrap.Modal(failureModalEl);
              failureModalInstance.show();
              makeChangesModalEl.removeEventListener(
                "hidden.bs.modal",
                onMakeChangesHidden
              );
            },
            { once: true }
          );
          const makeChangesModalInstance =
            bootstrap.Modal.getInstance(makeChangesModalEl);
          if (makeChangesModalInstance) makeChangesModalInstance.hide();
        } else if (failureModalEl) {
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        return;
      }
      if (phoneInput.value.startsWith("+")) {
        const makeChangesModalEl = document.getElementById("makeChangesModal");
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");

        if (failureMessageEl)
          failureMessageEl.textContent =
            "Invalid phone number format. Please enter without the leading '+'. E.g., 6598765432";

        if (makeChangesModalEl && failureModalEl) {
          makeChangesModalEl.addEventListener(
            "hidden.bs.modal",
            function onMakeChangesHiddenPhone() {
              const failureModalInstance = new bootstrap.Modal(failureModalEl);
              failureModalInstance.show();
              makeChangesModalEl.removeEventListener(
                "hidden.bs.modal",
                onMakeChangesHiddenPhone
              );
            },
            { once: true }
          );
          const makeChangesModalInstance =
            bootstrap.Modal.getInstance(makeChangesModalEl);
          if (makeChangesModalInstance) makeChangesModalInstance.hide();
        } else if (failureModalEl) {
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        return;
      }

      const payload = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        orderId: orderIdInput.value,
        changes: changesInput.value,
        source: "Make Changes",
      };

      try {
        const response = await fetch(
          "https://hooks.sg.webexconnect.io/events/X6210XGYRO",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const successModalEl = document.getElementById("successModal");
          const successMessageEl = document.getElementById("successMessage");
          if (successMessageEl)
            successMessageEl.textContent =
              "Thanks for your change request! We'll review it and get back to you.";
          if (successModalEl) {
            const modal = new bootstrap.Modal(successModalEl);
            modal.show();
          }

          makeChangesForm.reset();
          const makeChangesModalEl =
            document.getElementById("makeChangesModal");
          if (makeChangesModalEl) {
            const modalInstance =
              bootstrap.Modal.getInstance(makeChangesModalEl);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        } else {
          const errorData = await response.text();
          const failureModalEl = document.getElementById("failureModal");
          const failureMessageEl = document.getElementById("failureMessage");
          if (failureMessageEl)
            failureMessageEl.textContent = `Oops! Something went wrong with your change request. Server responded with: ${response.status} - ${errorData}`;
          if (failureModalEl) {
            const modal = new bootstrap.Modal(failureModalEl);
            modal.show();
          }
          console.error("Webhook error:", response.status, errorData);
        }
      } catch (error) {
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");
        if (failureMessageEl)
          failureMessageEl.textContent =
            "Oops! Something went wrong with your change request. Please check your connection. Details: " +
            error.message;
        if (failureModalEl) {
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        console.error("Fetch error:", error);
      }
    });
  }

  // Report Issue form submission handler
  const reportIssueForm = document.getElementById("report-issue-form");
  if (reportIssueForm) {
    reportIssueForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("ri-name");
      const phoneInput = document.getElementById("ri-phone");
      const emailInput = document.getElementById("ri-email");
      const orderIdInput = document.getElementById("ri-orderId");
      const issueInput = document.getElementById("ri-issue");

      // Validation for Report Issue (orderId is optional)
      if (
        !nameInput.value ||
        !phoneInput.value ||
        !emailInput.value ||
        !issueInput.value
      ) {
        const reportIssueModalEl = document.getElementById("reportIssueModal");
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");

        if (failureMessageEl)
          failureMessageEl.textContent =
            "Please fill in all required fields for Report Issue. Order ID is optional.";

        if (reportIssueModalEl && failureModalEl) {
          reportIssueModalEl.addEventListener(
            "hidden.bs.modal",
            function onReportIssueHidden() {
              const failureModalInstance = new bootstrap.Modal(failureModalEl);
              failureModalInstance.show();
              reportIssueModalEl.removeEventListener(
                "hidden.bs.modal",
                onReportIssueHidden
              );
            },
            { once: true }
          );
          const reportIssueModalInstance =
            bootstrap.Modal.getInstance(reportIssueModalEl);
          if (reportIssueModalInstance) reportIssueModalInstance.hide();
        } else if (failureModalEl) {
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        return;
      }
      if (phoneInput.value.startsWith("+")) {
        const reportIssueModalEl = document.getElementById("reportIssueModal");
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");

        if (failureMessageEl)
          failureMessageEl.textContent =
            "Invalid phone number format. Please enter without the leading '+'. E.g., 6598765432";

        if (reportIssueModalEl && failureModalEl) {
          reportIssueModalEl.addEventListener(
            "hidden.bs.modal",
            function onReportIssueHiddenPhone() {
              const failureModalInstance = new bootstrap.Modal(failureModalEl);
              failureModalInstance.show();
              reportIssueModalEl.removeEventListener(
                "hidden.bs.modal",
                onReportIssueHiddenPhone
              );
            },
            { once: true }
          );
          const reportIssueModalInstance =
            bootstrap.Modal.getInstance(reportIssueModalEl);
          if (reportIssueModalInstance) reportIssueModalInstance.hide();
        } else if (failureModalEl) {
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        return;
      }

      const payload = {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        orderId: orderIdInput.value || "",
        issue: issueInput.value,
        source: "Report Issue",
      };

      try {
        const response = await fetch(
          "https://hooks.sg.webexconnect.io/events/X6210XGYRO",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          const successModalEl = document.getElementById("successModal");
          const successMessageEl = document.getElementById("successMessage");
          if (successMessageEl)
            successMessageEl.textContent =
              "Thanks for reporting the issue! We'll look into it.";
          if (successModalEl) {
            const modal = new bootstrap.Modal(successModalEl);
            modal.show();
          }

          reportIssueForm.reset();
          const reportIssueModalEl =
            document.getElementById("reportIssueModal");
          if (reportIssueModalEl) {
            const modalInstance =
              bootstrap.Modal.getInstance(reportIssueModalEl);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        } else {
          const errorData = await response.text();
          const failureModalEl = document.getElementById("failureModal");
          const failureMessageEl = document.getElementById("failureMessage");
          if (failureMessageEl)
            failureMessageEl.textContent = `Oops! Something went wrong with your issue report. Server responded with: ${response.status} - ${errorData}`;
          if (failureModalEl) {
            const modal = new bootstrap.Modal(failureModalEl);
            modal.show();
          }
          console.error("Webhook error:", response.status, errorData);
        }
      } catch (error) {
        const failureModalEl = document.getElementById("failureModal");
        const failureMessageEl = document.getElementById("failureMessage");
        if (failureMessageEl)
          failureMessageEl.textContent =
            "Oops! Something went wrong with your issue report. Please check your connection. Details: " +
            error.message;
        if (failureModalEl) {
          const modal = new bootstrap.Modal(failureModalEl);
          modal.show();
        }
        console.error("Fetch error:", error);
      }
    });
  }
});

// Helper to get form elements
function initializeFormElements() {
  return {
    emailForm: document.getElementById("emailForm"),
    emailName: document.getElementById("emailName"),
    emailAddress: document.getElementById("emailAddress"),
    emailSubject: document.getElementById("emailSubject"),
    emailMessage: document.getElementById("emailMessage"),
  };
}

// Stub for Bootstrap components (expand as needed)
function initializeBootstrapComponents() {
  // Ensure Bootstrap is loaded
  if (
    typeof bootstrap === "undefined" ||
    typeof bootstrap.Modal === "undefined"
  ) {
    console.error("Bootstrap Modal component is not loaded.");
    return null;
  }

  const successModalElement = document.getElementById("successModal");
  const failureModalElement = document.getElementById("failureModal");

  return {
    successModal: successModalElement
      ? new bootstrap.Modal(successModalElement)
      : null,
    failureModal: failureModalElement
      ? new bootstrap.Modal(failureModalElement)
      : null,
    // emailModal is already handled for opening, but if you need to control it from here, add it.
  };
}

// Async sendEmail function
async function sendEmail() {
  const elements = initializeFormElements();
  const bsComponents = initializeBootstrapComponents(); // Initialize modals

  if (!elements) {
    console.error("Email form elements not found.");
    if (bsComponents && bsComponents.failureModal)
      bsComponents.failureModal.show();
    return;
  }
  if (
    !bsComponents ||
    !bsComponents.successModal ||
    !bsComponents.failureModal
  ) {
    console.error("Success/Failure modals could not be initialized.");
    // Fallback to alert if modals aren't ready
    alert("Modal components are not ready. Please check the console.");
    return;
  }

  const currentUserId =
    typeof demoToolboxUserId !== "undefined" ? demoToolboxUserId : null;
  if (!currentUserId) {
    console.warn(
      "demoToolboxUserId is not defined. Sending without it or with a placeholder if allowed by the API."
    );
  }

  const payload = {
    name: elements.emailName.value,
    email: elements.emailAddress.value,
    subject: elements.emailSubject.value,
    body: elements.emailMessage.value,
    session: "custom",
    datacenter: "webex",
    userId: currentUserId,
    demo: "webex-custom",
    isUpstream: false,
    isInstantDemo: true,
    isSfdc: false,
  };

  console.log(
    "Attempting to send email with payload:",
    JSON.stringify(payload, null, 2)
  );

  try {
    const response = await fetchWithTimeout(
      "https://mm-brand.cxdemo.net/api/v1/email",
      {
        timeout: 6000,
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      console.error(
        `Server returned ${response.status} (${response.statusText}):`,
        errorData
      );
      const failureMessageP = document.getElementById("failureMessage");
      if (failureMessageP)
        failureMessageP.textContent = `Error: ${response.statusText}. ${
          typeof errorData === "string" ? errorData : JSON.stringify(errorData)
        }`;
      bsComponents.failureModal.show();
      return;
    }

    const responseData = await response.json();
    console.log("Email sent successfully:", responseData);
    const successMessageP = document.getElementById("successMessage");
    if (successMessageP)
      successMessageP.textContent = "Your email has been sent successfully!"; // Or use responseData
    bsComponents.successModal.show();

    if (elements.emailForm) {
      elements.emailForm.reset();
      elements.emailForm.classList.remove("was-validated");
    }
    // Close the main email modal after success
    const emailModalElement = document.getElementById("emailModal");
    if (emailModalElement && bootstrap.Modal.getInstance(emailModalElement)) {
      bootstrap.Modal.getInstance(emailModalElement).hide();
    }
  } catch (error) {
    console.error("Error sending email (network or other issue):", error);
    const failureMessageP = document.getElementById("failureMessage");
    if (failureMessageP)
      failureMessageP.textContent = `Network or other error: ${error.message}`;
    bsComponents.failureModal.show();
  }
}

// Stub for fetchWithTimeout (implement or import as needed)
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

// Email Card
const emailCard = document.getElementById("emailCard");
const emailModal = document.getElementById("emailModal");
if (emailCard && emailModal && window.bootstrap) {
  const bsEmailModal = new bootstrap.Modal(emailModal);
  emailCard.addEventListener("click", () => {
    bsEmailModal.show();
  });
}

// Show modal function
function showModal(modalElement) {
  modalElement.setAttribute("inert", ""); // Add inert attribute
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
}

// Hide modal function
function hideModal(modalElement) {
  modalElement.removeAttribute("inert"); // Remove inert attribute
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
}

// Example usage
const successModal = document.getElementById("successModal");
const failureModal = document.getElementById("failureModal");

// Call showModal(emailModal) to open the email modal
// Call hideModal(emailModal) to close it

// Mobile Nav Toggle Functionality
function initializeMobileNavToggle() {
  const toggleButton = document.querySelector(".mobile-nav-toggle");
  const mobileMenu =
    document.getElementById("mobileNavMenu") ||
    document.getElementById("mobileNavMenuVideos");

  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener("click", () => {
      const isActive = mobileMenu.classList.contains("active");
      mobileMenu.classList.toggle("active");
      toggleButton.classList.toggle("active");
      toggleButton.setAttribute("aria-expanded", !isActive);

      if (!isActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }
}
// END Mobile Nav Toggle Functionality

// FAQ Accordion Functionality
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) {
    // console.warn("No FAQ items found to initialize"); // Optional: for debugging
    return;
  }

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("is-active");

        // Option 1: Close all other items when one is opened
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            // Don't remove from current item yet
            otherItem.classList.remove("is-active");
          }
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add("is-active");
        } else {
          item.classList.remove("is-active"); // Allows toggling the same item off
        }
      });
    }
  });
}
