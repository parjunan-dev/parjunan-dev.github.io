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

const computeServices = new Set(["cloudrun", "awslambda", "azurefunctions"]);
const translationServices = new Set(["translate", "awstranslate", "azuretranslate"]);

function getBaselineWorkload() {
  const requests = getNumericValue("baselineRequests");
  const duration = getNumericValue("baselineDuration");
  const memoryMb = getNumericValue("baselineMemory");
  const cpuVcpu = getNumericValue("baselineCpu");
  const responseKb = getNumericValue("baselineResponse");
  const memoryGb = memoryMb / 1024;
  const gbSeconds = memoryGb * duration * requests;
  const vcpuSeconds = cpuVcpu * duration * requests;
  return {
    requests,
    duration,
    memoryMb,
    cpuVcpu,
    responseKb,
    memoryGb,
    gbSeconds,
    vcpuSeconds,
  };
}

function syncComputeInputs() {
  const baseline = getBaselineWorkload();
  const mappings = [
    { id: "cloudRunRequestsUsage", value: baseline.requests },
    { id: "cloudRunAverageDuration", value: baseline.duration },
    { id: "cloudRunVcpuPerInstance", value: baseline.cpuVcpu },
    { id: "cloudRunMemoryPerInstance", value: baseline.memoryGb },
    { id: "awsLambdaRequests", value: baseline.requests },
    { id: "awsLambdaDuration", value: baseline.duration },
    { id: "awsLambdaMemoryMb", value: baseline.memoryMb },
    { id: "azureFunctionsRequests", value: baseline.requests },
    { id: "azureFunctionsDuration", value: baseline.duration },
    { id: "azureFunctionsMemoryMb", value: baseline.memoryMb },
  ];

  mappings.forEach(({ id, value }) => {
    const element = document.getElementById(id);
    if (element) {
      element.value = Number.isFinite(value) ? value : "";
    }
  });
}

function syncTranslationInputs() {
  const charValue = getNumericValue("baselineCharacters");
  const freeChars = getNumericValue("baselineFreeCharacters");
  const mappings = [
    { id: "translateUsage", value: charValue },
    { id: "awsTranslateUsage", value: charValue },
    { id: "azureTranslateUsage", value: charValue },
    { id: "translateFreeTier", value: freeChars },
    { id: "awsTranslateFreeTier", value: freeChars },
    { id: "azureTranslateFreeTier", value: freeChars },
  ];

  mappings.forEach(({ id, value }) => {
    const element = document.getElementById(id);
    if (element) {
      element.value = Number.isFinite(value) ? value : "";
    }
  });
}

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

let includeFreeTier = true;

function getConditionalFree(value) {
  return includeFreeTier ? value : 0;
}

function applyFreeTier(usage, freeTier) {
  return Math.max(0, usage - getConditionalFree(freeTier));
}

function calculateServiceTotal(config) {
  if (config.id === "cloudrun") {
    const baseline = getBaselineWorkload();
    const cpuSeconds = baseline.vcpuSeconds;
    const memorySeconds = baseline.gbSeconds;
    const requests = baseline.requests;
    const billableCpuSeconds = Math.max(
      0,
      cpuSeconds - getConditionalFree(180000),
    );
    const billableMemorySeconds = Math.max(
      0,
      memorySeconds - getConditionalFree(360000),
    );
    const billableRequests = Math.max(
      0,
      requests - getConditionalFree(2000000),
    );
    document.getElementById("cloudRunCpuSeconds").textContent =
      formatNumber(cpuSeconds);

    return (
      billableCpuSeconds * 0.000024 +
      billableMemorySeconds * 0.0000025 +
      (billableRequests / 1000000) * 0.40
    );
  }

  if (config.id === "awslambda") {
    const baseline = getBaselineWorkload();
    const gbSeconds = baseline.gbSeconds;
    const requests = baseline.requests;
    const billableGbSeconds = Math.max(
      0,
      gbSeconds - getConditionalFree(400000),
    );
    const billableRequests = Math.max(
      0,
      requests - getConditionalFree(1000000),
    );

    document.getElementById("awsLambdaGbSeconds").textContent =
      formatNumber(gbSeconds);

    return (
      billableGbSeconds * 0.0000166667 +
      (billableRequests / 1000000) * 0.20
    );
  }

  if (config.id === "azurefunctions") {
    const baseline = getBaselineWorkload();
    const gbSeconds = baseline.gbSeconds;
    const requests = baseline.requests;
    const billableGbSeconds = Math.max(
      0,
      gbSeconds - getConditionalFree(400000),
    );
    const billableRequests = Math.max(
      0,
      requests - getConditionalFree(1000000),
    );

    document.getElementById("azureFunctionsGbSeconds").textContent =
      formatNumber(gbSeconds);

    return (
      billableGbSeconds * 0.000016 +
      (billableRequests / 1000000) * 0.20
    );
  }

  const usage = getNumericValue(config.usageInput);
  const rate = getNumericValue(config.rateInput);
  const markup = config.markupInput
    ? getNumericValue(config.markupInput) / 100
    : 0;
  const freeTier = config.freeTierInput
    ? getNumericValue(config.freeTierInput)
    : 0;
  const billableUsage = applyFreeTier(usage, freeTier);

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
  updateFreeTierNotes();
}

function updateFreeTierNotes() {
  const text = includeFreeTier
    ? "Free tier applied"
    : "Production estimate (free tier excluded)";
  document.getElementById("freeTierStatus").textContent = text;
  document.querySelectorAll(".result-note").forEach((note) => {
    note.textContent = text;
  });
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

  updateBaselinePanels();

  updateTotals();
}

function updateBaselinePanels() {
  const computePanel = document.getElementById("computeBaselinePanel");
  const translatePanel = document.getElementById("translateBaselinePanel");
  const showCompute = [...computeServices].some((service) =>
    activeServices.has(service),
  );
  const showTranslate = [...translationServices].some((service) =>
    activeServices.has(service),
  );
  if (computePanel) {
    computePanel.style.display = showCompute ? "block" : "none";
  }
  if (translatePanel) {
    translatePanel.style.display = showTranslate ? "block" : "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const baselineInputs = [
    "baselineRequests",
    "baselineDuration",
    "baselineMemory",
    "baselineCpu",
    "baselineResponse",
  ];
  baselineInputs.forEach((id) => {
    document
      .getElementById(id)
      .addEventListener("input", () => {
        syncComputeInputs();
        updateTotals();
      });
  });

  ["baselineCharacters", "baselineFreeCharacters"].forEach((id) => {
    document
      .getElementById(id)
      .addEventListener("input", () => {
        syncTranslationInputs();
        updateTotals();
      });
  });

  [
    "cloudRunFreeCpuSeconds",
    "cloudRunFreeMemorySeconds",
    "cloudRunFreeRequests",
    "awsLambdaFreeGbSeconds",
    "awsLambdaFreeRequests",
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

  document
    .getElementById("includeFreeTier")
    .addEventListener("change", (event) => {
      includeFreeTier = event.target.checked;
      updateTotals();
    });

  syncComputeInputs();
  syncTranslationInputs();
  updateServiceSelection();
});
