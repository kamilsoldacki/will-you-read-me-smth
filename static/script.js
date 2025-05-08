
document.addEventListener("DOMContentLoaded", () => {
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
});
