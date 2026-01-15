const el = document.getElementById("num");

// Poll until the counter.dev element is ready
const interval = setInterval(() => {
  // Select the counter.dev span using the data-id
  const real = document.querySelector('[data-id="bdad96f3-e256-4fb1-8bee-da58d4c7d280"]');
  if (!real) return;

  // Parse the number from counter.dev
  const target = parseInt(real.textContent.replace(/,/g, ""), 10);
  if (isNaN(target)) return;

  clearInterval(interval);

  // Animate from 0 to target
  let cur = 0;
  const step = Math.max(1, Math.floor(target / 60)); // smooth steps
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) {
      cur = target;
      clearInterval(t);
    }
    el.textContent = cur.toLocaleString();
  }, 16);
}, 100);
