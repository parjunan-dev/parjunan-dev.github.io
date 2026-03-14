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
    const requestUsage = getNumericValue("cloudRunRequestsUsage");
    const averageDuration = getNumericValue("cloudRunAverageDuration");
    const vcpuPerInstance = getNumericValue("cloudRunVcpuPerInstance");
    const memoryPerInstance = getNumericValue("cloudRunMemoryPerInstance");
    const idleHours = getNumericValue("cloudRunIdleHours");
    const cpuActiveRate = getNumericValue("cloudRunCpuActiveRate");
    const cpuIdleRate = getNumericValue("cloudRunCpuIdleRate");
    const memoryRate = getNumericValue("cloudRunMemoryRate");
    const requestRate = getNumericValue("cloudRunRequestRate");
    const activeCpuSeconds = requestUsage * averageDuration * vcpuPerInstance;
    const activeMemorySeconds =
      requestUsage * averageDuration * memoryPerInstance;
    const idleSeconds = idleHours * 3600;
    const idleCpuSeconds = idleSeconds * vcpuPerInstance;
    const idleMemorySeconds = idleSeconds * memoryPerInstance;

    const grossEstimate =
      activeCpuSeconds * cpuActiveRate +
      idleCpuSeconds * cpuIdleRate +
      activeMemorySeconds * memoryRate +
      idleMemorySeconds * memoryRate +
      (requestUsage / 1000000) * requestRate;

    // Google documents Cloud Run's free tier as a spending-based discount
    // derived from its published baseline pricing.
    const freeTierCredit = 6.02;

    document.getElementById("cloudRunActiveCpuSeconds").textContent =
      formatNumber(activeCpuSeconds);
    document.getElementById("cloudRunFreeTierCredit").textContent =
      formatCurrency(freeTierCredit);

    return Math.max(0, grossEstimate - freeTierCredit);
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
    "cloudRunRequestsUsage",
    "cloudRunAverageDuration",
    "cloudRunVcpuPerInstance",
    "cloudRunMemoryPerInstance",
    "cloudRunIdleHours",
    "cloudRunCpuActiveRate",
    "cloudRunCpuIdleRate",
    "cloudRunMemoryRate",
    "cloudRunRequestRate",
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
