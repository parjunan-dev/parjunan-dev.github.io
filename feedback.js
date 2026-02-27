/**
 * Feedback page: multi-step form with chatbot API and email relay.
 * Set FEEDBACK_CHATBOT_API_URL to your API endpoint (Trans ID).
 * API expects POST with JSON body { "event": { "input": "Message received in the website" } }
 * and returns the reply in response.answers.
 */
const FEEDBACK_CHATBOT_API_URL =
  "https://router.ivastudio.verint.live/ProxyScript/run/68e2e4b7ad4ab30c3c2b3522/current/cisco_messenger";
const FEEDBACK_CHATBOT_AUTH_TOKEN =
  "q8XJm2PzA4t9WkR7yC1vN0bF5hQdS3eUxL8gTzKpV6RfMwY2ZaEnHoJiKlTu9Bs";
const FEEDBACK_EMAIL_RELAY_URL = "https://mm-brand.cxdemo.net/api/v1/email";
const demoToolboxUserId = "8822";
const THANKYOU_PAGE = "thankyou.html";

// Topic options per service – OCBC Bank Singapore Help & Support (https://www.ocbc.com/personal-banking/help-and-support)
const TOPICS_BY_SERVICE = {
  accounts: [
    { value: "giro", label: "Apply for a GIRO arrangement" },
    { value: "closure", label: "Authorise closure of your account" },
    { value: "estatements", label: "Enrol for e-Statements" },
    { value: "statement", label: "Request for statement of account" },
    { value: "add-currency", label: "Request to add currency to your account" },
    { value: "tax-residency", label: "Update tax residency" },
    { value: "combined-statement", label: "Make changes to your Combined Statement" },
    { value: "change-address", label: "Change of Address / Contact Details" },
    { value: "360", label: "360 Account" },
    { value: "savings", label: "Savings / Bonus+ Savings" },
    { value: "other", label: "Other" },
  ],
  cards: [
    { value: "cancel-credit", label: "Cancel your Credit Card" },
    { value: "instalment", label: "Change instalment amounts" },
    { value: "credit-limit", label: "Review your credit card limit" },
    { value: "supplementary", label: "Apply for a supplementary card" },
    { value: "atm-activation", label: "ATM Card Activations" },
    { value: "overseas-atm", label: "Overseas ATM Withdrawal Activation" },
    { value: "card-overseas", label: "Using your ATM/Debit/Credit card overseas" },
    { value: "paper-statements", label: "Revert to Paper Statements" },
    { value: "debit-fcy", label: "Manage Linked Accounts for Foreign Currency (Debit)" },
    { value: "baby-bonus", label: "Baby Bonus Card (apply / reissue / cancel)" },
    { value: "other", label: "Other" },
  ],
  loans: [
    { value: "easicredit", label: "EasiCredit / Card Waiver" },
    { value: "home-loans", label: "Home Loans" },
    { value: "car-loan", label: "Car Loan" },
    { value: "tuition-fee", label: "Tuition Fee Loan" },
    { value: "education-disbursement", label: "Education Loan disbursement" },
    { value: "education-changes", label: "Changes to Education Loan" },
    { value: "sfrp", label: "Special Financial Relief Programme (SFRP)" },
    { value: "interbank-giro", label: "Interbank Giro (Car / Tuition Fee Loan)" },
    { value: "other", label: "Other" },
  ],
  insurance: [
    { value: "investment-linked", label: "Investment-linked Insurance Plan" },
    { value: "accident-health", label: "Accident & Health (e.g. GREAT PA Plan)" },
    { value: "term-guard", label: "GREAT Term Guard" },
    { value: "travel-care", label: "GREAT TravelCare / Travel, Home & Car" },
    { value: "other", label: "Other" },
  ],
  investments: [
    { value: "unit-trusts", label: "Unit Trusts" },
    { value: "equities", label: "Online Equities Account" },
    { value: "roboinvest", label: "OCBC RoboInvest" },
    { value: "precious-metals", label: "Precious Metals Account" },
    { value: "fx", label: "Foreign Currency Exchange" },
    { value: "srs", label: "Supplementary Retirement Scheme (SRS)" },
    { value: "other", label: "Other" },
  ],
  onlinebanking: [
    { value: "reset-pin", label: "Reset your Online Banking PIN" },
    { value: "apply-online-banking", label: "Apply for Online Banking" },
    { value: "phone-banking", label: "Phone Banking Services" },
    { value: "forgot-access-code", label: "Forgot Access Code / PIN" },
    { value: "change-access-code", label: "Change Access Code / PIN" },
    { value: "check-balance-sms", label: "Check balances using SMS" },
    { value: "other", label: "Other" },
  ],
  payments: [
    { value: "fast", label: "FAST" },
    { value: "pricing-guide", label: "Pricing guide" },
    { value: "cheque-status", label: "Status of cheque" },
    { value: "remit-overseas", label: "Remit money overseas" },
    { value: "other", label: "Other" },
  ],
  security: [
    { value: "onetoken", label: "Protect transactions with OCBC OneToken" },
    { value: "transaction-limits", label: "Secure funds with daily transaction limits" },
    { value: "biometrics", label: "Shield mobile banking access with biometrics" },
    { value: "kill-switch", label: "Use the Kill Switch to stop fraudsters" },
    { value: "cooling-off", label: "Cooling-off periods" },
    { value: "authorisation-limits", label: "Role of authorisation limits in surveillance" },
    { value: "scams-ecommerce", label: "Staying safe when shopping on e-commerce websites" },
    { value: "phishing", label: "Preventing phishing scams" },
    { value: "impersonators", label: "Spotting impersonators" },
    { value: "srf", label: "Shared Responsibility Framework" },
    { value: "other", label: "Other" },
  ],
  general: [
    { value: "change-details", label: "Change personal details" },
    { value: "fees-charges", label: "Fees and charges" },
    { value: "branch-code", label: "OCBC Bank and Branch code" },
    { value: "money-lock", label: "OCBC Money Lock" },
    { value: "po-box", label: "P.O. Box cessation" },
    { value: "marketing-consent", label: "Marketing Consent Update / Withdraw" },
    { value: "other", label: "Other" },
  ],
  other: [
    { value: "general-enquiry", label: "General enquiry" },
    { value: "complaint", label: "Complaint" },
    { value: "other", label: "Other" },
  ],
};

let bsSuccessModal, bsFailureModal;

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 15000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

/**
 * Call chatbot API with user message; returns reply text.
 * POSTs to FEEDBACK_CHATBOT_API_URL with:
 *   Content-Type: application/json, Accept: application/json, Authorization: Bearer <token>
 *   Body: { "event": { "input": "<user message>" } }
 * Response is read from response.answers (string or array).
 * If API URL is empty, returns a mock reply for demo.
 */
async function getAgentAnswer(service, topic, userMessage) {
  if (FEEDBACK_CHATBOT_API_URL) {
    const response = await fetchWithTimeout(FEEDBACK_CHATBOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${FEEDBACK_CHATBOT_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        event: {
          input: userMessage || "Message received from the user in the website",
        },
      }),
      timeout: 20000,
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error("Chatbot API failed: " + (errText || response.status));
    }
    const data = await response.json().catch(() => ({}));
    const answers = data.answers;
    const reply = Array.isArray(answers)
      ? answers[0] != null
        ? String(answers[0])
        : null
      : answers != null
        ? String(answers)
        : null;
    if (typeof reply === "string" && reply.trim()) return reply;
    throw new Error(
      "Chatbot response had no readable reply (missing $.answers)",
    );
  }
  // Mock response when no API URL is configured
  await new Promise((r) => setTimeout(r, 1500));
  return `Thank you for your question about "${topic}" under ${service}. We've noted your concern: "${userMessage.slice(0, 80)}${userMessage.length > 80 ? "…" : ""}". Our team will follow up if needed. Is there anything else we can help with?`;
}

/** Send feedback email via relay (same format as index.html Email Modal / script.js sendEmail). */
async function sendFeedbackEmail(payload) {
  const body = JSON.stringify({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    body: payload.body,
    session: "custom",
    datacenter: "webex",
    userId: demoToolboxUserId,
    demo: "webex-custom",
    isUpstream: false,
    isInstantDemo: true,
    isSfdc: false,
  });
  const response = await fetchWithTimeout(FEEDBACK_EMAIL_RELAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    timeout: 10000,
  });
  if (!response.ok) throw new Error("Email relay failed: " + response.status);
  return response;
}

function show(el) {
  if (el) el.style.display = "";
}
function hide(el) {
  if (el) el.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const stepDropdowns = document.getElementById("step-dropdowns");
  const stepHowCanWeHelp = document.getElementById("step-how-can-we-help");
  const stepAnswer = document.getElementById("step-answer");
  const stepPersonal = document.getElementById("step-personal");
  const helpWith = document.getElementById("helpWith");
  const topicSelect = document.getElementById("topic");
  const comments = document.getElementById("comments");
  const nextBtn = document.getElementById("nextBtn");
  const answerBox = document.getElementById("answerBox");
  const answerLoading = document.getElementById("answerLoading");
  const resolveBlock = document.getElementById("resolveBlock");
  const resolveYes = document.getElementById("resolveYes");
  const resolveNo = document.getElementById("resolveNo");
  const personalForm = document.getElementById("personalForm");

  bsSuccessModal = new bootstrap.Modal("#successModal");
  bsFailureModal = new bootstrap.Modal("#failureModal");

  // Populate topic dropdown when "What can we help you with?" changes
  helpWith.addEventListener("change", function () {
    const service = helpWith.value;
    topicSelect.innerHTML = '<option value="">Please select a topic</option>';
    if (!service) {
      stepHowCanWeHelp.style.display = "none";
      return;
    }
    const topics = TOPICS_BY_SERVICE[service] || TOPICS_BY_SERVICE.other;
    topics.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.value;
      opt.textContent = t.label;
      topicSelect.appendChild(opt);
    });
    if (!topicSelect.value) stepHowCanWeHelp.style.display = "none";
  });

  topicSelect.addEventListener("change", function () {
    if (helpWith.value && topicSelect.value) {
      show(stepHowCanWeHelp);
    } else {
      hide(stepHowCanWeHelp);
    }
  });

  // Next: send to AI agent and show answer
  nextBtn.addEventListener("click", async function () {
    const message = (comments.value || "").trim();
    if (!message) {
      comments.reportValidity();
      return;
    }
    nextBtn.disabled = true;
    show(stepAnswer);
    hide(answerBox);
    show(answerLoading);
    hide(resolveBlock);
    try {
      const service = helpWith.value;
      const topic = topicSelect.value;
      const answer = await getAgentAnswer(service, topic, message);
      answerBox.value = answer;
      hide(answerLoading);
      show(answerBox);
      show(resolveBlock);
    } catch (err) {
      console.error(err);
      answerBox.value =
        "Sorry, we couldn't get a response right now. Please try again or use the form below to contact us.";
      hide(answerLoading);
      show(answerBox);
      show(resolveBlock);
    }
    nextBtn.disabled = false;
  });

  // Yes, all good -> redirect to thank you page
  resolveYes.addEventListener("click", function () {
    window.location.href = THANKYOU_PAGE;
  });

  // No, continue to next page -> show personal details form
  resolveNo.addEventListener("click", function () {
    show(stepPersonal);
    stepPersonal.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Personal form submit -> send email via relay (same as index.html Email Modal)
  personalForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!personalForm.checkValidity()) {
      personalForm.classList.add("was-validated");
      return;
    }
    const salutation = document.getElementById("salutation").value;
    const fullName = document.getElementById("fullName").value;
    const personalEmail = document.getElementById("personalEmail").value;
    const personalSubject = document.getElementById("personalSubject").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const additionalInfo = document.getElementById("additionalInfo").value;
    const body = `Service: ${helpWith.value}\nTopic: ${topicSelect.options[topicSelect.selectedIndex]?.text || topicSelect.value}\n\nOriginal query:\n${comments.value}\n\nAdditional information:\n${additionalInfo}\n\nContact: ${contactNumber}`;
    const sendBtn = document.getElementById("sendFeedbackBtn");
    sendBtn.disabled = true;
    try {
      await sendFeedbackEmail({
        name: `${salutation} ${fullName}`.trim(),
        email: personalEmail,
        subject: personalSubject,
        body,
      });
      bsSuccessModal.show();
      personalForm.reset();
      personalForm.classList.remove("was-validated");
    } catch (err) {
      console.error(err);
      bsFailureModal.show();
    }
    sendBtn.disabled = false;
  });
});
