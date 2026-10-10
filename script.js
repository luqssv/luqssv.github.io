// Animated background: types "There's no place like ::1/128", glitches, erases, repeats.
(function () {
    const lines = document.querySelectorAll(".bg-loopback .bg-line");
    if (lines.length !== 2) return;

    const TEXTS = ["There\u2019s no place like", "::1/128"];
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const parts = Array.from(lines, (line) => ({
        line,
        typed: line.querySelector(".typed"),
        rest: line.querySelector(".rest"),
    }));

    // Show the first `count` characters; the rest stays invisible but keeps its space.
    function show(index, count, override) {
        const text = override || TEXTS[index];
        parts[index].typed.textContent = text.slice(0, count);
        parts[index].rest.textContent = TEXTS[index].slice(count);
    }

    function setActive(index) {
        parts.forEach((p, i) => p.line.classList.toggle("active", i === index));
    }

    // Reduced motion: just show the finished text, no animation.
    if (reducedMotion) {
        show(0, TEXTS[0].length);
        show(1, TEXTS[1].length);
        return;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const GLYPHS = ":/0123456789abcdef";

    async function type(index, delay) {
        setActive(index);
        for (let i = 1; i <= TEXTS[index].length; i++) {
            show(index, i);
            await sleep(delay + Math.random() * delay * 0.5);
        }
    }

    async function erase(index, delay) {
        setActive(index);
        for (let i = TEXTS[index].length - 1; i >= 0; i--) {
            show(index, i);
            await sleep(delay);
        }
    }

    // Briefly scramble a few characters, then settle back.
    async function glitch(index, duration) {
        const text = TEXTS[index];
        const end = Date.now() + duration;

        while (Date.now() < end) {
            const scrambled = Array.from(text, (ch) =>
                Math.random() < 0.45
                    ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                    : ch
            ).join("");
            show(index, text.length, scrambled);
            await sleep(60);
        }
        show(index, text.length);
    }

    async function run() {
        show(0, 0);
        show(1, 0);

        while (true) {
            await sleep(600);
            await type(0, 70);
            await sleep(400);
            await type(1, 140);
            await sleep(3500);
            await glitch(1, 700);
            await sleep(500);
            await erase(1, 55);
            await erase(0, 25);
            setActive(-1);
            await sleep(800);
        }
    }

    run();
})();

// Fade the background phrase as the page scrolls, so it never fights with the content.
(function () {
    const background = document.querySelector(".bg-loopback");
    if (!background) return;

    function update() {
        const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.22));
        background.style.opacity = String(1 - progress * 0.9);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
})();

// Automatic copyright year
document.getElementById("year").textContent =
    new Date().getFullYear();

// Copy Discord username
const discordButton = document.getElementById("discord-copy");

discordButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText("squl7");

        discordButton.querySelector("strong").textContent = "Copied!";

        setTimeout(() => {
            discordButton.querySelector("strong").textContent = "@squl7";
        }, 1500);

    } catch (error) {
        // Still show the username if clipboard access is unavailable.
        discordButton.querySelector("strong").textContent = "@squl7";
    }
});
