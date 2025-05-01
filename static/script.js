document.getElementById("storyForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const form = e.target;

    const data = {
        q1: form.q1.value,
        q2: form.q2.value,
        q3: form.q3.value,
        q4: form.q4.value,
        q5: form.q5.value
    };

    const response = await fetch("/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("storyForm").style.display = "none";
    document.getElementById("player").style.display = "block";
    document.getElementById("audio").src = result.audio_url;
});
