// Seriously dude, hands off my code!

// Initialize document animations.
document.addEventListener("DOMContentLoaded", () => {

    // Define loading text variants.
    const loading_variants = [
        "Loading...",
        "L04D1NG,..",
        "L0ADING,,,",
        "Lø@diŋG..,",
        "|04D?NG...",
        "LOADING___",
        "booting Purdue.exe...",
        "initializing squirrels...",
        "compiling motivation...",
        "error: coffee not found"
    ];

    // Define title variants.
    const title_variants = [
        "BoilerVerse",
        "B01l3rV3r5e",
        "boilerverse",
        "฿ØłⱠɆⱤVɆⱤ₴Ɇ",
        "B@!ler\\/er$e",
        "BOILERVERSE",
        "𝐛⃥⃒̸𝐨⃥⃒̸𝐢⃥⃒̸𝐥⃥⃒̸𝐞⃥⃒̸𝐫⃥⃒̸𝐯⃥⃒̸𝐞⃥⃒̸𝐫⃥⃒̸𝐬⃥⃒̸𝐞⃥⃒̸"
    ];

    // Initialize states.
    const display = document.getElementById("loading-text");
    let index = 0;
    const cycleTime = 300;
    const totalDuration = 4000;

    // Randomly cycle through variants,
    const interval = setInterval(() => {
        if (Math.random() > 0.25) index = (index + 1);
        display.textContent = loading_variants[index % loading_variants.length];
        document.title = title_variants[index % title_variants.length];
        if (Math.random() < 0.75) display.classList.toggle("glitch");
    }, cycleTime);

    // Figure out where to send the user next.
    const params = new URLSearchParams(window.location.search);
    const next = `pages/${params.get("next") || "bsod"}.html`;

    // Redirect after delay.
    setTimeout(() => {
        clearInterval(interval);
        display.textContent = "Reality patch deployed.";
        setTimeout(() => window.location.href = next, 1000 + Math.floor(500 * Math.random()));
    }, totalDuration);
});
