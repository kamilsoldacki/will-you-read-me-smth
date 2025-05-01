document.getElementById("storyForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const form = e.target;
    const loading = document.getElementById("loading");

    const data = {
        q1: form.q1.value,
        q2: form.q2.value,
        q3: form.q3.value,
        q4: form.q4.value,
        q5: form.q5.value
    };

    loading.style.display = "block";

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.audio_base64) {
            const audio = document.getElementById("audio");
            audio.src = "data:audio/mpeg;base64," + result.audio_base64;
            document.getElementById("storyForm").style.display = "none";
            document.getElementById("player").style.display = "block";
        } else {
            alert("Wystąpił problem z generowaniem audio.");
            console.error(result);
        }
    } catch (error) {
        console.error("Błąd podczas wysyłania żądania:", error);
        alert("Coś poszło nie tak.");
    } finally {
        loading.style.display = "none";
    }
});
