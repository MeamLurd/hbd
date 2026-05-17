// Personalize the letter here
const CONFIG = {
  name: "tester",
  date: "August 21, 2026",
  signature: "idk bro",
};

const envelope = document.getElementById("envelope");
const letter = document.getElementById("letter");
const closeLetter = document.getElementById("closeLetter");
const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");

let petals = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createPetal() {
  const colors = ["#d4848a", "#eec8cc", "#f4e4e4", "#c9a86c", "#8fa88a"];
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    size: 6 + Math.random() * 10,
    speedY: 0.4 + Math.random() * 1.2,
    speedX: -0.5 + Math.random(),
    rotation: Math.random() * Math.PI * 2,
    spin: -0.02 + Math.random() * 0.04,
    color: colors[Math.floor(Math.random() * colors.length)],
    wobble: Math.random() * Math.PI * 2,
  };
}

function initPetals(count = 40) {
  petals = Array.from({ length: count }, createPetal);
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;
  ctx.globalAlpha = 0.75;

  ctx.beginPath();
  ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function updatePetals() {
  for (const p of petals) {
    p.wobble += 0.02;
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.wobble) * 0.3;
    p.rotation += p.spin;

    if (p.y > canvas.height + p.size) {
      Object.assign(p, createPetal());
      p.y = -p.size;
    }
  }
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePetals();
  petals.forEach(drawPetal);
  animationId = requestAnimationFrame(animatePetals);
}

function burstConfetti() {
  const burst = Array.from({ length: 24 }, () => ({
    ...createPetal(),
    y: canvas.height * 0.4,
    speedY: -(2 + Math.random() * 4),
    speedX: -3 + Math.random() * 6,
    size: 4 + Math.random() * 8,
  }));
  petals.push(...burst);
  setTimeout(() => {
    petals = petals.slice(0, 40);
  }, 3000);
}

function openLetter() {
  if (document.body.classList.contains("letter-open")) return;

  document.body.classList.add("is-opening");

  setTimeout(() => {
    letter.hidden = false;
    requestAnimationFrame(() => {
      letter.classList.add("is-visible");
      document.body.classList.add("letter-open");
    });
    burstConfetti();
  }, 700);
}

function closeLetterView() {
  letter.classList.remove("is-visible");
  document.body.classList.remove("letter-open", "is-opening");

  setTimeout(() => {
    letter.hidden = true;
  }, 500);
}

envelope.addEventListener("click", openLetter);
closeLetter.addEventListener("click", closeLetterView);

letter.addEventListener("click", (e) => {
  if (e.target === letter) closeLetterView();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("letter-open")) {
    closeLetterView();
  }
});

window.addEventListener("resize", resizeCanvas);

document.querySelector(".name").textContent = CONFIG.name;
document.querySelector(".letter__date").textContent = CONFIG.date;
document.querySelector(".signature").textContent = CONFIG.signature;

resizeCanvas();
initPetals();
animatePetals();
