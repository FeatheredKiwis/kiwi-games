const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let shootingStars = [];
let twinkles = [];

const numStars = 200;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function init() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(dpr, dpr);

  stars = [];
  for (let i = 0; i < numStars; i++) {
    const originX =
      Math.random() * window.innerWidth * 2 - window.innerWidth * 0.5;
    const originY =
      Math.random() * window.innerHeight * 2 - window.innerHeight * 0.5;
    const angle = Math.random() * Math.PI * 2;
    stars.push({
      x: originX,
      y: originY,
      originX,
      originY,
      angle,
      radius: Math.random() * 0.5 + 0.5,
      size: Math.random() * 1.5 + 0.5,
      baseSpeedX: Math.random() * 0.05 - 0.025,
      baseSpeedY: Math.random() * 0.05 - 0.025,
    });
  }
}

function createShootingStar() {
  const angle = 25 * (Math.PI / 180);
  const startX = -100;
  const startY = Math.random() * window.innerHeight * 0.5;
  shootingStars.push({
    x: startX,
    y: startY,
    vx: Math.cos(angle) * 10,
    vy: Math.sin(angle) * 10,
    length: Math.random() * 100 + 50,
    opacity: 1,
  });
}

function createTwinkle() {
  twinkles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    life: 1.0,
  });
}

setInterval(() => {
  if (shootingStars.length < 3) createShootingStar();
  if (twinkles.length < 20) createTwinkle();
}, 1000);

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((s) => {
    const dx = (mouseX - window.innerWidth / 2) * 0.001;
    const dy = (mouseY - window.innerHeight / 2) * 0.001;
    const toOriginX = (s.originX - s.x) * 0.0025;
    const toOriginY = (s.originY - s.y) * 0.0025;

    s.angle += 0.001;
    const circularX = Math.cos(s.angle) * s.radius;
    const circularY = Math.sin(s.angle) * s.radius;

    s.x += s.baseSpeedX + dx + toOriginX + circularX;
    s.y += s.baseSpeedY + dy + toOriginY + circularY;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  twinkles.forEach((t, i) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${t.life})`;
    ctx.shadowColor = `rgba(255, 255, 255, ${t.life})`;
    ctx.shadowBlur = 10;
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    t.life -= 0.02;
    if (t.life <= 0) twinkles.splice(i, 1);
  });

  shootingStars.forEach((s, i) => {
    ctx.strokeStyle = `rgba(255, 255, 255, ${s.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - Math.cos((25 * Math.PI) / 180) * s.length,
      s.y - Math.sin((25 * Math.PI) / 180) * s.length
    );
    ctx.stroke();

    s.x += s.vx;
    s.y += s.vy;
    s.opacity -= 0.005;

    if (
      s.opacity <= 0 ||
      s.x > window.innerWidth + 100 ||
      s.y > window.innerHeight + 100
    ) {
      shootingStars.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
}

window.addEventListener("resize", init);

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("contextmenu", (event) => event.preventDefault());

init();
animate();
