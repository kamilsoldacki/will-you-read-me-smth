document.addEventListener("DOMContentLoaded", () => {
  // Multi-step logic
  const steps = document.querySelectorAll(".step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const stepIndicator = document.getElementById("step-indicator");
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("hidden", i !== index);
    });
    prevBtn.classList.toggle("hidden", index === 0);
    nextBtn.classList.toggle("hidden", index === steps.length - 1);
    submitBtn.classList.toggle("hidden", index !== steps.length - 1);
    stepIndicator.textContent = `Krok ${index + 1} z ${steps.length}`;
  }

  if (prevBtn && nextBtn && submitBtn && stepIndicator) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });

    nextBtn.addEventListener("click", () => {
      const textarea = steps[currentStep].querySelector("textarea");
      if (textarea && textarea.checkValidity()) {
        currentStep++;
        showStep(currentStep);
      } else {
        textarea.reportValidity();
      }
    });

    showStep(currentStep);
  }

  // Obsługa wysyłki formularza
  const form = document.getElementById("storyForm");
  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
    const form = e.target;

    const data = {
        q1: form.q1.value,
        q2: form.q2.value,
        q3: form.q3.value,
        q4: form.q4.value,
        q5: form.q5.value
    };

    // Ukryj formularz i pokaż pasek ładowania
    form.style.display = "none";
    const loadingContainer = document.getElementById("loadingBarContainer");
    const loadingBar = document.getElementById("loadingBar");
    const loadingPercent = document.getElementById("loadingPercent");
    loadingContainer.style.display = "block";

    let current = 0;
    const max = 96;
    const duration = 240000; // 4 minuty = 240 000 ms
    const interval = duration / max;

    const progressInterval = setInterval(() => {
        if (current < max) {
            current++;
            loadingBar.style.width = `${current}%`;
            loadingPercent.textContent = `${current}%`;
        } else {
            clearInterval(progressInterval);
        }
    }, interval);

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            } catch (e) { console.error(e); },
            body: JSON.stringify(data)
    });
  }
});