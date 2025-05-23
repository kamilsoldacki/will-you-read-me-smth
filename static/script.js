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

  let currentStep = 0; // ← DODAJ TO

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
  
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      document.getElementById("welcome-screen").style.display = "none";
      document.getElementById("form-wrapper").style.display = "block";
    });
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

  document.querySelectorAll("textarea").forEach((area) => {
    area.addEventListener("input", () => {
      const errorBox = document.getElementById("errorBox");
      if (errorBox) {
        errorBox.classList.add("hidden");
      }
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Sprawdzenie wszystkich pól textarea
    const inputs = form.querySelectorAll("textarea");
    let allFilled = true;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        allFilled = false;
      }
    });

    if (!allFilled) {
      const errorBox = document.getElementById("errorBox");
      if (errorBox) {
        errorBox.classList.remove("hidden");
      }
      return;
    }

    if (!loadingBar || !audio || !player || !loadingBarFill || !loadingProgressText) {
      console.error("Brakuje jednego z wymaganych elementów");
      return;
    }

    form.style.display = "none";
    loadingBar.style.display = "block";
    player.classList.remove("visible");
    player.style.display = "none";

    let percent = 0;

    const loadingMessages = [
      "Hm mmm… smok właśnie zmienia głos. Dajmy mu sekundę.",
      "Papier się nie kończy, ale atrament chce być różowy.",
      "O nie! Bohater właśnie zasnął...",
      "Muszę jeszcze tylko dobrać odpowiedni zapach do tej sceny.",
      "Cii… słucham, co mówi las.",
      "Jeszcze moment - krasnal poprawia przecinki.",
      "Narrator ćwiczy głos ślimaka. To trudne.",
      "Czy jednorożce lubią wyścigi sporotwe? Sprawdzam.",
      "Tworzę mapę świata, żeby się nie zgubić w opowieści.",
      "Hm mmm… z której strony wchodzi słońce do tej bajki?",
      "Zawijam słowa w miękkie kocyki.",
      "Pióro pisze, ale bohaterka przerywa i się śmieje.",
      "Dodaję właśnie cichy deszcz z błyszczących liter.",
      "Jeszcze tylko sprawdzę czy wilk nie podjada dialogów.",
      "Zegar bajek tyka…",
      "O, ktoś właśnie wpadł z nowym pomysłem na bohatera!",
      "Cicho... zaczarowuję drzwi do tej historii.",
      "Testuję, czy ta bajka zmieści się w jednej kieszeni.",
      "Czy pies w skarpetkach może być rycerzem?",
      "Przesłuchuję chór wróżek do sceny otwarcia.",
      "Jeszcze moment… mieszam humor z odwagą.",
      "Wiatr musi brzmieć jak muzyka.",
      "Niektóre litery są dziś bardzo figlarne. Ehh, poprawiam literówki.",
      "Piszę, śmieję się, czytam.",
      "Dobre bajki potrzebują tylko chwili z odrobiną magii.",
      "Łączę punkty: początek, środek i boom! Wielkie zaskoczenie.",
      "Ktoś właśnie podrzucił sówkę z podpowiedzią!",
      "Trzymam pióro w jednej ręce, a przygodę w drugiej.",
      "Hmm... niech pomyślę...",
      "Zamykaj oczy... i już lecimy do krainy wyobraźni...",
      "Cii... właśnie podsłuchuję pomysł od smoka z sąsiedztwa.",
      "Oj! Jeden bohater właśnie zgubił swoją... pelerynę?!",
      "Wiesz co? Ta bajka będzie miała zwrot akcji.",
      "Jeszcze niegotowe!",
      "Szukam najlepszego zakończenia.",
      "O! Mam pomysł!",
      "...ale najpierw herbatka.",
      "A gdyby bohaterem był... pies w skarpetkach?",
      "Ta historia będzie tak dobra, mówię Ci!",
      "Dodajemy szczyptę szaleństwa, odrobinę odwagi...",
      "Wiesz co? Już słyszę śmiech bohaterów zza rogu...",
      "Jeszcze tylko kilka słów...",
    ];

    function getRandomMessage() {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }
  
  loadingProgressText.textContent = getRandomMessage();
  
  const messageInterval = setInterval(() => {
    loadingProgressText.textContent = getRandomMessage();
  }, 5555);


    const progressInterval = setInterval(() => {
      if (percent < 98) {
        percent += Math.floor(Math.random() * 4) + 1;
        if (percent > 98) percent = 98;
        loadingBarFill.style.width = percent + "%";
      }
    }, 2222);

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
      clearInterval(messageInterval);

      if (!result.audio_base64 || typeof result.audio_base64 !== "string") {
        throw new Error("Nieprawidłowy audio_base64");
      }

      audio.src = "data:audio/wav;base64," + result.audio_base64;
      audio.load();
      audio.play().catch((e) => {
        console.warn("Autoodtwarzanie zablokowane przez przeglądarkę:", e);
      });

      loadingBar.style.display = "none";
      player.style.display = "block";

      setTimeout(() => {
        player.classList.add("visible");
        // pokaż formularz zgody po 45 sekundach
setTimeout(() => {
  document.getElementById("shareStoryContent").value = result.text;
  document.getElementById("share-form").style.display = "block";
}, 45000);

      }, 10);
    } catch (err) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      loadingBar.style.display = "none";
      console.error("Błąd przy generowaniu:", err);
    }
  });
});


const shareForm = document.getElementById("submitStoryForm");
if (shareForm) {
  shareForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = shareForm.name.value.trim();
    const email = shareForm.email.value.trim();
    const consent = shareForm.consent.checked;
    const story = shareForm.story.value;

    if (!name || !email || !consent) return;

    const payload = { name, email, consent, story };

    try {
      await fetch("/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      document.getElementById("shareThanks").classList.remove("hidden");
      shareForm.reset();
    } catch (err) {
      console.error("Błąd przy wysyłaniu bajki:", err);
    }
  });
}
