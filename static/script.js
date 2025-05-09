document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const submitBtn = document.getElementById("submitBtn");
  const stepIndicator = document.getElementById("step-indicator");
  const form = document.getElementById("storyForm");
  const loadingBar = document.getElementById("loadingBarContainer");
  const player = document.getElementById("player");
  const audio = document.getElementById("audio");

  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("hidden", i !== index);
    });
    stepIndicator.textContent = `Krok ${index + 1} z ${steps.length}`;
    prevBtn.classList.toggle("hidden", index === 0);
    nextBtn.classList.toggle("hidden", index === steps.length - 1);
    submitBtn.classList.toggle("hidden", index !== steps.length - 1);
  }

  showStep(currentStep);

  nextBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!loadingBar || !audio || !player) {
      console.error("Brakuje jednego z wymaganych elementów");
      return;
    }

    form.style.display = "none";
    loadingBar.style.display = "block";
    player.classList.remove("visible");
    player.style.display = "none";

    const data = {
      q1: form.q1.value,
      q2: form.q2.value,
      q3: form.q3.value,
      q4: form.q4.value,
      q5: form.q5.value,
    };

    try {
      const response = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Odpowiedź z /generate:", result);

      // Walidacja audio_url
      if (!result.audio_url || typeof result.audio_url !== "string") {
        throw new Error("Nieprawidłowy audio_url");
      }

      audio.src = result.audio_url;
      audio.load();

      loadingBar.style.display = "none";
      player.style.display = "block";

      setTimeout(() => {
        player.classList.add("visible");
      }, 10);
    } catch (err) {
      loadingBar.style.display = "none";
      alert("Wystąpił problem z generowaniem bajki. Zobacz konsolę (F12 → Console).");
      console.error("Błąd:", err);
    }
  });
});
