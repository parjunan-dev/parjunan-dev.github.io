// Set these for each customer demo...
const CUSTOMER_NAME = "Singapore Pools - Legal Sports, Lottery and Horse Racing Betting";
const CUSTOMER_IMAGE = "images/SingaporePools.png";

// Set this stuff once and forget about it...
const WXCC_TELEPHONE_NUMBER = "+6582004000";
const IMI_SMS_WEBHOOK = "";
const IMI_CALLBACK_WEBHOOK = "https://hooks.sg.webexconnect.io/events/I4WVTJ9F2A";
const demoToolboxUserId = "8822";
const AGENT_IMAGE = "https://cdn.glitch.global/e39bce96-4dfa-4058-9775-199788361cb8/agent.png?v=1730959586778";
const WHATSAPP_IMAGE = "https://cdn.glitch.global/ac617fcb-2ab9-466a-84f5-08c5ecb0af5b/whatsapp_business_qr.png?v=1732251286668";
const AMB_IMAGE = "https://cdn.glitch.global/ac617fcb-2ab9-466a-84f5-08c5ecb0af5b/apple_messages_for_business_qr_with_id.png?v=1732251283447";
const COFFEE_IMAGE = "https://cdn.glitch.global/ac617fcb-2ab9-466a-84f5-08c5ecb0af5b/coffeeDemo.png?v=1732251295694";

// Global variables
let bsComponents;

//-----------------------------------------//
// Dont change anything below this line
//-----------------------------------------//

// Initialize DOM elements with error handling
function initializeElements() {
  try {
    // Set title & image for the customer name
    document.title = CUSTOMER_NAME;
    const bgImage = document.getElementById("bgImage");
    if (bgImage) bgImage.src = CUSTOMER_IMAGE;

    // Set Agent Image link
    const agent = document.getElementById("agent");
    if (agent) agent.src = AGENT_IMAGE;

    // Set QR Codes
    const whatsappQR = document.getElementById("whatsappQR");
    if (whatsappQR) whatsappQR.src = WHATSAPP_IMAGE;

    const ambQR = document.getElementById("ambQR");
    if (ambQR) ambQR.src = AMB_IMAGE;

    const coffeeDemoQR = document.getElementById("coffeeDemoQR");
    if (coffeeDemoQR) coffeeDemoQR.src = COFFEE_IMAGE;

    // Set telephone number in Call Us Modal
    const telephone = document.getElementById("telephone");
    if (telephone && WXCC_TELEPHONE_NUMBER) {
      telephone.textContent = formatPhoneNumber(WXCC_TELEPHONE_NUMBER);
    }
  } catch (error) {
    console.error("Error initializing elements:", error);
  }
}

// Initialize Bootstrap components with error handling
function initializeBootstrapComponents() {
  try {
    return {
      contactMenu: new bootstrap.Offcanvas("#contactMenu"),
      callModal: new bootstrap.Modal("#callModal"),
      callbackModal: new bootstrap.Modal("#callbackModal"),
      emailModal: new bootstrap.Modal("#emailModal"),
      smsModal: new bootstrap.Modal("#smsModal"),
      whatsappModal: new bootstrap.Modal("#whatsappModal"),
      ambModal: new bootstrap.Modal("#ambModal"),
      coffeeDemoModal: new bootstrap.Modal("#coffeeDemoModal"),
      failureModal: new bootstrap.Modal("#failureModal"),
      successModal: new bootstrap.Modal("#successModal")
    };
  } catch (error) {
    console.error("Error initializing Bootstrap components:", error);
    return null;
  }
}

// Initialize form elements with error handling
function initializeFormElements() {
  try {
    return {
      successMessage: document.getElementById("successMessage"),
      smsName: document.getElementById("smsName"),
      smsNumber: document.getElementById("smsNumber"),
      callbackName: document.getElementById("callbackName"),
      callbackNumber: document.getElementById("callbackNumber"),
      callbackDepartment: document.getElementById("callbackDepartment"),
      callbackReason: document.getElementById("callbackReason"),
      emailName: document.getElementById("emailName"),
      emailAddress: document.getElementById("emailAddress"),
      emailSubject: document.getElementById("emailSubject"),
      emailMessage: document.getElementById("emailMessage"),
      callbackForm: document.getElementById("callbackForm"),
      emailForm: document.getElementById("emailForm"),
      smsForm: document.getElementById("smsForm"),
      imiWebChat: document.getElementById("divicw")
    };
  } catch (error) {
    console.error("Error initializing form elements:", error);
    return null;
  }
}

// Input validation functions
function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

// Format phone to +E164
function formatPhoneNumber(phoneNumber) {
  try {
    const phoneNumberString = phoneNumber.toString();
    const match = phoneNumberString.match(/^(\d{4})(\d{4})$/);
    if (!match) {
      return phoneNumberString;
    }
    return `+65 ${match[1]} ${match[2]}`;
  } catch (error) {
    console.error("Error formatting phone number:", error);
    return phoneNumber;
  }
}

// Gets the callback delay from the callback modal
function getCallbackDelay() {
  try {
    const immediateCallback = document.getElementById("immediateCallback");
    const delayCallbackMinutes = document.getElementById("delayCallbackMinutes");

    if (immediateCallback && immediateCallback.checked) {
      return 0;
    } else if (delayCallbackMinutes) {
      return delayCallbackMinutes.value * 60;
    }
    return 0;
  } catch (error) {
    console.error("Error getting callback delay:", error);
    return 0;
  }
}

// Improved version of fetch() with a configurable timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 6000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Send callback to imi
async function sendCallback() {
  const elements = initializeFormElements();
  if (!elements) {
    console.error("Form elements not initialized");
    return;
  }

  try {
    // Validate inputs
    if (!validateRequired(elements.callbackName.value) ||
        !validatePhoneNumber(elements.callbackNumber.value) ||
        !validateRequired(elements.callbackDepartment.value) ||
        !validateRequired(elements.callbackReason.value)) {
      throw new Error("Invalid form inputs");
    }

    const delay = getCallbackDelay();
    const response = await fetchWithTimeout(IMI_CALLBACK_WEBHOOK, {
      timeout: 6000,
      method: "POST",
      body: JSON.stringify({
        name: elements.callbackName.value,
        number: elements.callbackNumber.value,
        department: elements.callbackDepartment.value,
        reason: elements.callbackReason.value,
        delay: delay,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Callback Status Code:", response.status);
    console.log("Callback Response Data:", data);

    const number = elements.callbackNumber.value;
    
    // Clear form
    elements.callbackName.value = "";
    elements.callbackNumber.value = "";
    elements.callbackDepartment.value = "";
    elements.callbackReason.value = "";

    if (response.ok) {
      elements.successMessage.textContent = `We will call you at ${formatPhoneNumber(number)} shortly.`;
      bsToggle(bsComponents.successModal);
    } else {
      bsToggle(bsComponents.failureModal);
    }
  } catch (error) {
    console.error("Callback error:", error);
    bsToggle(bsComponents.failureModal);
  }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  bsComponents = initializeBootstrapComponents(); // Initialize globally
  const formElements = initializeFormElements();

  if (bsComponents && formElements) {
    // Add event listeners for Contact Menu Items
    const menuItems = {
      callLink: bsComponents.callModal,
      callbackLink: bsComponents.callbackModal,
      emailLink: bsComponents.emailModal,
      smsLink: bsComponents.smsModal,
      whatsappLink: bsComponents.whatsappModal,
      ambLink: bsComponents.ambModal,
      coffeeDemoLink: bsComponents.coffeeDemoModal
    };

    Object.entries(menuItems).forEach(([id, modal]) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", () => {
          modal.show();
          bsComponents.contactMenu.hide();
        });
      }
    });

    // Handle IMI Web Chat visibility
    if (formElements.imiWebChat) {
      const contactMenu = document.getElementById("contactMenu");
      if (contactMenu) {
        contactMenu.addEventListener("shown.bs.offcanvas", () => {
          formElements.imiWebChat.hidden = true;
        });
        contactMenu.addEventListener("hidden.bs.offcanvas", () => {
          formElements.imiWebChat.hidden = false;
        });
      }
    }

    // Add event listeners for modal close buttons
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");
    if (closeSuccessBtn && bsComponents.successModal) {
      closeSuccessBtn.addEventListener("click", () => {
        bsComponents.successModal.hide();
      });
    }

    const closeFailureBtn = document.getElementById("closeFailureBtn");
    if (closeFailureBtn && bsComponents.failureModal) {
      closeFailureBtn.addEventListener("click", () => {
        bsComponents.failureModal.hide();
      });
    }

    // Handle modal focus management
    const successModal = document.getElementById('successModal');
    const failureModal = document.getElementById('failureModal');
    const emailModal = document.getElementById('emailModal');
    const callbackModal = document.getElementById('callbackModal');
    const callModal = document.getElementById('callModal');
    const smsModal = document.getElementById('smsModal');
    const whatsappModal = document.getElementById('whatsappModal');
    const coffeeDemoModal = document.getElementById('coffeeDemoModal');

    // Handle modal show/hide events
    if (successModal) {
      successModal.addEventListener('show.bs.modal', () => {
        successModal.removeAttribute('inert');
      });
      successModal.addEventListener('hide.bs.modal', () => {
        successModal.setAttribute('inert', '');
      });
    }

    if (failureModal) {
      failureModal.addEventListener('show.bs.modal', () => {
        failureModal.removeAttribute('inert');
      });
      failureModal.addEventListener('hide.bs.modal', () => {
        failureModal.setAttribute('inert', '');
      });
    }

    if (emailModal) {
      emailModal.addEventListener('show.bs.modal', () => {
        emailModal.removeAttribute('inert');
      });
      emailModal.addEventListener('hide.bs.modal', () => {
        emailModal.setAttribute('inert', '');
      });
    }

    if (callbackModal) {
      callbackModal.addEventListener('show.bs.modal', () => {
        callbackModal.removeAttribute('inert');
      });
      callbackModal.addEventListener('hide.bs.modal', () => {
        callbackModal.setAttribute('inert', '');
        document.activeElement.blur();
      });
    }

    if (callModal) {
      callModal.addEventListener('show.bs.modal', () => {
        callModal.removeAttribute('inert');
      });
      callModal.addEventListener('hide.bs.modal', () => {
        callModal.setAttribute('inert', '');
        document.activeElement.blur();
      });
    }

    if (smsModal) {
      smsModal.addEventListener('show.bs.modal', () => {
        smsModal.removeAttribute('inert');
      });
      smsModal.addEventListener('hide.bs.modal', () => {
        smsModal.setAttribute('inert', '');
        document.activeElement.blur();
      });
    }

    if (whatsappModal) {
      whatsappModal.addEventListener('show.bs.modal', () => {
        whatsappModal.removeAttribute('inert');
      });
      whatsappModal.addEventListener('hide.bs.modal', () => {
        whatsappModal.setAttribute('inert', '');
        document.activeElement.blur();
      });
    }

    if (coffeeDemoModal) {
      coffeeDemoModal.addEventListener('show.bs.modal', () => {
        coffeeDemoModal.removeAttribute('inert');
      });
      coffeeDemoModal.addEventListener('hide.bs.modal', () => {
        coffeeDemoModal.setAttribute('inert', '');
        document.activeElement.blur();
      });
    }
  }
});

// Toggles a bootstrap component
function bsToggle(bsComponent) {
  if (bsComponent) {
    bsComponent.toggle();
  }
}

// Send Email to dCloud
async function sendEmail() {
  const elements = initializeFormElements();
  if (!elements) {
    return;
  }

  try {
    // Validate inputs
    if (!validateRequired(elements.emailName.value) ||
        !validateEmail(elements.emailAddress.value) ||
        !validateRequired(elements.emailSubject.value) ||
        !validateRequired(elements.emailMessage.value)) {
      throw new Error("Invalid form inputs");
    }

    const response = await fetchWithTimeout(
      "https://mm-brand.cxdemo.net/api/v1/email",
      {
        timeout: 6000,
        method: "POST",
        body: JSON.stringify({
          name: elements.emailName.value,
          email: elements.emailAddress.value,
          subject: elements.emailSubject.value,
          body: elements.emailMessage.value,
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear form
    elements.emailName.value = "";
    elements.emailAddress.value = "";
    elements.emailSubject.value = "";
    elements.emailMessage.value = "";

    if (!bsComponents || !bsComponents.emailModal) {
      throw new Error("Bootstrap components not available");
    }

    // Hide email modal
    bsComponents.emailModal.hide();

    // Set success message and show success modal
    if (response.status === 202) {
      elements.successMessage.textContent = "Thank you for your email. We will respond shortly.";
      bsComponents.successModal.show();
      // Auto-hide after 4 seconds
      setTimeout(() => {
        if (bsComponents && bsComponents.successModal) {
          bsComponents.successModal.hide();
        }
      }, 4000);
    } else {
      bsComponents.failureModal.show();
      // Auto-hide after 4 seconds
      setTimeout(() => {
        if (bsComponents && bsComponents.failureModal) {
          bsComponents.failureModal.hide();
        }
      }, 4000);
    }
  } catch (error) {
    if (bsComponents) {
      bsComponents.emailModal.hide();
      bsComponents.failureModal.show();
      // Auto-hide after 4 seconds
      setTimeout(() => {
        if (bsComponents && bsComponents.failureModal) {
          bsComponents.failureModal.hide();
        }
      }, 4000);
    }
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
      bsToggle(bsComponents.successModal);
    } else {
      bsToggle(bsComponents.failureModal);
    }
  } catch (error) {
    bsToggle(bsComponents.failureModal);
    console.log("SMS something went wrong!");
    console.log("SMS Error:", error);
  }
}

// Add event listener for Callback Modal Submit button
document.getElementById("sendCallbackBtn").addEventListener("click", () => {
  if (callbackForm.checkValidity()) {
    callbackForm.classList.remove("was-validated");
    bsComponents.callbackModal.hide();
    sendCallback();
  } else callbackForm.classList.add("was-validated");
});

// Add event listener for Email Modal Submit button
document.addEventListener('DOMContentLoaded', () => {
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
});

// Add event listener for SMS Modal Submit button
document.getElementById("sendSmsBtn").addEventListener("click", () => {
  if (smsForm.checkValidity()) {
    smsForm.classList.remove("was-validated");
    bsComponents.smsModal.hide();
    sendSMS();
  } else smsForm.classList.add("was-validated");
});
