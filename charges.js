const calculators = [
  {
    id: "translate",
    usageInput: "translateUsage",
    rateInput: "translateRate",
    freeTierInput: "translateFreeTier",
    output: "translateTotal",
    quantityDivisor: 1000000,
  },
  {
    id: "cloudrun",
    output: "cloudRunTotal",
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

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateServiceTotal(config) {
  if (config.id === "cloudrun") {
    const cpuUsage = getNumericValue("cloudRunCpuUsage");
    const memoryUsage = getNumericValue("cloudRunMemoryUsage");
    const requestUsage = getNumericValue("cloudRunRequestsUsage");
    const cpuRate = getNumericValue("cloudRunCpuRate");
    const memoryRate = getNumericValue("cloudRunMemoryRate");
    const requestRate = getNumericValue("cloudRunRequestRate");
    const cpuFreeTier = getNumericValue("cloudRunCpuFreeTier");
    const memoryFreeTier = getNumericValue("cloudRunMemoryFreeTier");
    const requestFreeTier = getNumericValue("cloudRunRequestsFreeTier");

    const billableCpu = Math.max(0, cpuUsage - cpuFreeTier);
    const billableMemory = Math.max(0, memoryUsage - memoryFreeTier);
    const billableRequests = Math.max(0, requestUsage - requestFreeTier);

    document.getElementById("cloudRunBillableRequests").textContent =
      formatNumber(billableRequests);

    return (
      billableCpu * cpuRate +
      billableMemory * memoryRate +
      (billableRequests / 1000000) * requestRate
    );
  }

  const usage = getNumericValue(config.usageInput);
  const rate = getNumericValue(config.rateInput);
  const markup = config.markupInput
    ? getNumericValue(config.markupInput) / 100
    : 0;
  const billableUsage = config.freeTierInput
    ? Math.max(0, usage - getNumericValue(config.freeTierInput))
    : usage;

  const providerCost = (billableUsage / config.quantityDivisor) * rate;

  if (config.id === "translate") {
    document.getElementById("translateBillable").textContent =
      formatNumber(billableUsage);
  }

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
  [
    "cloudRunCpuUsage",
    "cloudRunMemoryUsage",
    "cloudRunRequestsUsage",
    "cloudRunCpuRate",
    "cloudRunMemoryRate",
    "cloudRunRequestRate",
    "cloudRunCpuFreeTier",
    "cloudRunMemoryFreeTier",
    "cloudRunRequestsFreeTier",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateTotals);
  });

  calculators.forEach((config) => {
    [config.usageInput, config.rateInput, config.markupInput].forEach((id) => {
      if (id) {
        document.getElementById(id).addEventListener("input", updateTotals);
      }
    });

    if (config.freeTierInput) {
      document
        .getElementById(config.freeTierInput)
        .addEventListener("input", updateTotals);
    }
  });

  updateTotals();
});
