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
    id: "awstranslate",
    usageInput: "awsTranslateUsage",
    rateInput: "awsTranslateRate",
    freeTierInput: "awsTranslateFreeTier",
    output: "awsTranslateTotal",
    quantityDivisor: 1000000,
  },
  {
    id: "awslambda",
    output: "awsLambdaTotal",
  },
  {
    id: "azuretranslate",
    usageInput: "azureTranslateUsage",
    rateInput: "azureTranslateRate",
    freeTierInput: "azureTranslateFreeTier",
    output: "azureTranslateTotal",
    quantityDivisor: 1000000,
  },
  {
    id: "azurefunctions",
    output: "azureFunctionsTotal",
  },
];

let activeServices = new Set();

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

  if (config.id === "awslambda") {
    const requests = getNumericValue("awsLambdaRequests");
    const duration = getNumericValue("awsLambdaDuration");
    const memoryMb = getNumericValue("awsLambdaMemoryMb");
    const computeRate = getNumericValue("awsLambdaComputeRate");
    const requestRate = getNumericValue("awsLambdaRequestRate");
    const freeGbSeconds = getNumericValue("awsLambdaFreeGbSeconds");
    const freeRequests = getNumericValue("awsLambdaFreeRequests");

    const gbSeconds = requests * duration * (memoryMb / 1024);
    const billableGbSeconds = Math.max(0, gbSeconds - freeGbSeconds);
    const billableRequests = Math.max(0, requests - freeRequests);

    document.getElementById("awsLambdaGbSeconds").textContent =
      formatNumber(gbSeconds);

    return (
      billableGbSeconds * computeRate +
      (billableRequests / 1000000) * requestRate
    );
  }

  if (config.id === "azurefunctions") {
    const requests = getNumericValue("azureFunctionsRequests");
    const duration = getNumericValue("azureFunctionsDuration");
    const memoryMb = getNumericValue("azureFunctionsMemoryMb");
    const computeRate = getNumericValue("azureFunctionsComputeRate");
    const requestRate = getNumericValue("azureFunctionsRequestRate");
    const freeGbSeconds = getNumericValue("azureFunctionsFreeGbSeconds");
    const freeRequests = getNumericValue("azureFunctionsFreeRequests");

    const gbSeconds = requests * duration * (memoryMb / 1024);
    const billableGbSeconds = Math.max(0, gbSeconds - freeGbSeconds);
    const billableRequests = Math.max(0, requests - freeRequests);

    document.getElementById("azureFunctionsGbSeconds").textContent =
      formatNumber(gbSeconds);

    return (
      billableGbSeconds * computeRate +
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

  if (config.id === "awstranslate") {
    document.getElementById("awsTranslateBillable").textContent =
      formatNumber(billableUsage);
  }

  if (config.id === "azuretranslate") {
    document.getElementById("azureTranslateBillable").textContent =
      formatNumber(billableUsage);
  }

  return providerCost * (1 + markup);
}

function updateTotals() {
  let grandTotal = 0;
  let visibleCount = 0;

  calculators.forEach((config) => {
    const total = calculateServiceTotal(config);
    document.getElementById(config.output).textContent = formatCurrency(total);

    const isVisible = activeServices.has(config.id);

    if (isVisible) {
      visibleCount += 1;
      grandTotal += total;
    }
  });

  document.getElementById("grandTotal").textContent = formatCurrency(grandTotal);
  document.getElementById("calculatorEmptyState").style.display =
    visibleCount === 0 ? "block" : "none";
}

function updateServiceSelection() {
  activeServices = new Set(
    Array.from(
      document.querySelectorAll('#servicePicker input[type="checkbox"]:checked'),
      (input) => input.value,
    ),
  );

  document.querySelectorAll(".calc-card").forEach((card) => {
    const service = card.dataset.service;
    card.classList.toggle("is-hidden", !activeServices.has(service));
  });

  updateTotals();
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

  [
    "awsLambdaRequests",
    "awsLambdaDuration",
    "awsLambdaMemoryMb",
    "awsLambdaComputeRate",
    "awsLambdaRequestRate",
    "awsLambdaFreeGbSeconds",
    "awsLambdaFreeRequests",
  ].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateTotals);
  });

  [
    "azureFunctionsRequests",
    "azureFunctionsDuration",
    "azureFunctionsMemoryMb",
    "azureFunctionsComputeRate",
    "azureFunctionsRequestRate",
    "azureFunctionsFreeGbSeconds",
    "azureFunctionsFreeRequests",
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

  document
    .querySelectorAll('#servicePicker input[type="checkbox"]')
    .forEach((input) => {
      input.addEventListener("change", updateServiceSelection);
    });

  updateServiceSelection();
});
