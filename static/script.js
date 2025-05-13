
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const submitBtn = document.getElementById("submitBtn");
  const stepIndicator = document.getElementById("step-indicator");
  const form = document.getElementById("storyForm");
  const loadingBar = document.getElementById("loadingBarContainer");
  const loadingProgressText = document.getElementById("loadingProgressText");
  const loadingBarFill = document.getElementById("loadingBarFill");
  const player = document.getElementById("player");
  const audio = document.getElementById("audio");

  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("hidden", i !== index);
    });
    stepIndicator.textContent = `${index + 1} z ${steps.length}`;
    if (index === 0) {
    prevBtn.classList.add("invisible");
    prevBtn.classList.remove("hidden");
  } else {
    prevBtn.classList.remove("invisible");
    prevBtn.classList.remove("hidden");
  }
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

    if (!loadingBar || !audio || !player || !loadingBarFill || !loadingProgressText) {
      console.error("Brakuje jednego z wymaganych elementów");
      return;
    }

    form.style.display = "none";
    loadingBar.style.display = "block";
    player.classList.remove("visible");
    player.style.display = "none";

    // Rozpocznij animację procentową
    let percent = 0;
    const progressInterval = setInterval(() => {
      if (percent < 98) {
        percent += Math.floor(Math.random() * 4) + 1;
        if (percent > 98) percent = 98;
        loadingBarFill.style.width = percent + "%";
        loadingProgressText.textContent = `Generujemy Twoją bajkę... ${percent}%`;
      }
    }, 1200);

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

      clearInterval(progressInterval);

      if (!result.audio_base64 || typeof result.audio_base64 !== "string") {
        throw new Error("Nieprawidłowy audio_base64");
      }

      audio.src = "data:audio/wav;base64," + result.audio_base64;
      audio.load();

      loadingBar.style.display = "none";
      player.style.display = "block";

      setTimeout(() => {
        player.classList.add("visible");
      }, 10);
    } catch (err) {
      clearInterval(progressInterval);
      loadingBar.style.display = "none";
      console.error("Błąd przy generowaniu:", err);
    }
  });
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("form-wrapper").style.display = "block";
});
