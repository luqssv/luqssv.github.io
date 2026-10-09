const canvas = document.getElementById("ecg");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let animationFrame = 0;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawECG();
}

function drawECG() {
    ctx.clearRect(0, 0, width, height);

    const spacing = 65;
    const rows = Math.ceil(height / spacing) + 2;

    for (let row = 0; row < rows; row++) {
        const baseY = row * spacing;

        ctx.beginPath();

        for (let x = 0; x <= width; x += 3) {
            // Several overlapping wave frequencies
            const slowWave = Math.sin(
                x * 0.008 + row * 1.4 + animationFrame * 0.008
            ) * 13;

            const mediumWave = Math.sin(
                x * 0.035 + row * 0.8 + animationFrame * 0.012
            ) * 5;

            const smallWave = Math.sin(
                x * 0.11 + row + animationFrame * 0.006
            ) * 2;

            // Occasional sharp ECG-like peaks
            const peakPosition = Math.sin(
                x * 0.018 + row * 2.3
            );

            const peak = Math.pow(
                Math.max(0, peakPosition),
                16
            ) * Math.sin(
                x * 0.16 + animationFrame * 0.01
            ) * 35;

            const y =
                baseY +
                slowWave +
                mediumWave +
                smallWave +
                peak;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.strokeStyle = row % 3 === 0
            ? "rgba(66, 190, 163, 0.42)"
            : "rgba(44, 132, 117, 0.26)";

        ctx.lineWidth = row % 3 === 0 ? 1.3 : 0.9;
        ctx.stroke();
    }
}

function animate() {
    animationFrame++;

    drawECG();

    if (!reducedMotion) {
        requestAnimationFrame(animate);
    }
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

if (!reducedMotion) {
    requestAnimationFrame(animate);
}

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