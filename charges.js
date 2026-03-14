const calculators = [
  {
    id: "translate",
    usageInput: "translateUsage",
    rateInput: "translateRate",
    markupInput: "translateMarkup",
    output: "translateTotal",
    quantityDivisor: 1000000,
  },
  {
    id: "speech",
    usageInput: "speechUsage",
    rateInput: "speechRate",
    markupInput: "speechMarkup",
    output: "speechTotal",
    quantityDivisor: 1,
  },
  {
    id: "sms",
    usageInput: "smsUsage",
    rateInput: "smsRate",
    markupInput: "smsMarkup",
    output: "smsTotal",
    quantityDivisor: 1,
  },
  {
    id: "whatsapp",
    usageInput: "whatsappUsage",
    rateInput: "whatsappRate",
    markupInput: "whatsappMarkup",
    output: "whatsappTotal",
    quantityDivisor: 1,
  },
];

function getNumericValue(id) {
  const value = Number.parseFloat(document.getElementById(id).value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateServiceTotal(config) {
  const usage = getNumericValue(config.usageInput);
  const rate = getNumericValue(config.rateInput);
  const markup = getNumericValue(config.markupInput) / 100;

  const providerCost = (usage / config.quantityDivisor) * rate;
  return providerCost * (1 + markup);
}

function updateTotals() {
  let grandTotal = 0;

  calculators.forEach((config) => {
    const total = calculateServiceTotal(config);
    grandTotal += total;
    document.getElementById(config.output).textContent = formatCurrency(total);
  });

  document.getElementById("grandTotal").textContent = formatCurrency(grandTotal);
}

document.addEventListener("DOMContentLoaded", () => {
  calculators.forEach((config) => {
    [config.usageInput, config.rateInput, config.markupInput].forEach((id) => {
      document.getElementById(id).addEventListener("input", updateTotals);
    });
  });

  updateTotals();
});
