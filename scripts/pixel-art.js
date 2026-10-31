// All artwork is original, drawn in a small pixel grid.
export function drawCharacter(ctx, x, y, color, s = 3) {
  ctx.fillStyle = "#0c1820";
  ctx.fillRect(x + s, y + 15 * s, 12 * s, 2 * s);
  ctx.fillStyle = color;
  ctx.fillRect(x + 4 * s, y, 6 * s, 5 * s);
  ctx.fillRect(x + 3 * s, y + 5 * s, 8 * s, 7 * s);
  ctx.fillRect(x, y + 6 * s, 3 * s, 5 * s);
  ctx.fillRect(x + 11 * s, y + 6 * s, 3 * s, 5 * s);
  ctx.fillRect(x + 3 * s, y + 12 * s, 3 * s, 4 * s);
  ctx.fillRect(x + 8 * s, y + 12 * s, 3 * s, 4 * s);
  ctx.fillStyle = "#192733";
  ctx.fillRect(x + 5 * s, y + 2 * s, 2 * s, s);
  ctx.fillRect(x + 8 * s, y + 2 * s, s, s);
  ctx.fillStyle = "#f6e6b4";
  ctx.fillRect(x + 5 * s, y + 6 * s, 4 * s, 2 * s);
}
export function drawLandscape(
  canvas,
  world,
  time = 0,
  party = null,
  flash = false,
) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width,
    h = canvas.height;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle =
    world === "python" ? "#152d2a" : world === "java" ? "#1b2535" : "#242a35";
  ctx.fillRect(0, 0, w, h);
  const colors =
    world === "python"
      ? ["#1c4236", "#29533e", "#416c4c"]
      : world === "java"
        ? ["#29364a", "#3b4d60", "#68737a"]
        : ["#37414a", "#50565b", "#7e7b69"];
  for (let layer = 0; layer < 3; layer++) {
    ctx.fillStyle = colors[layer];
    for (let i = 0; i < 11; i++) {
      const x = (i * w) / 9 + (layer % 2) * 27;
      const height = 30 + ((i * 37 + layer * 51) % 80);
      const top = h * 0.72 - height - layer * 7;
      if (world === "python") {
        ctx.fillRect(x + 15, top, 8, height + 40);
        for (let j = 0; j < 3; j++)
          ctx.fillRect(x - j * 9, top + j * 14, 40 + j * 17, 16);
      } else {
        ctx.fillRect(x, top, 30, height + 40);
        if (world === "sql") {
          ctx.fillRect(x - 5, top, 40, 7);
          ctx.fillRect(x - 5, h * 0.72, 40, 7);
        } else {
          ctx.fillRect(x + 7, top - 12, 15, 15);
          ctx.fillStyle = "#9cc5d0";
          ctx.fillRect(x + 11, top + 15, 5, 5);
          ctx.fillStyle = colors[layer];
        }
      }
    }
  }
  ctx.fillStyle = "#121e26";
  ctx.fillRect(0, h * 0.77, w, h * 0.23);
  ctx.fillStyle = colors[2];
  ctx.fillRect(0, h * 0.77, w, 5);
  for (let i = 0; i < 55; i++) {
    ctx.fillStyle = i % 3 === 0 ? "#c3c78b" : "#3c4e49";
    ctx.fillRect(
      (i * 83) % w,
      h * 0.8 + ((i * 17) % (h * 0.18)),
      (i % 3) + 2,
      2,
    );
  }
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = world === "python" ? "#bce98b" : "#d6c087";
    ctx.fillRect(
      (i * 71 + 19) % w,
      20 + ((i * 23) % (h * 0.58)) + Math.sin(time / 1000 + i) * 3,
      2,
      2,
    );
  }
  if (party) {
    party.forEach((unit, i) =>
      drawCharacter(
        ctx,
        30 + i * 65,
        h * 0.64 + Math.sin(time / 280 + i) * 2,
        unit.color,
      ),
    );
    const ex = w * 0.75,
      ey = h * 0.6;
    ctx.fillStyle = flash
      ? "#edf0df"
      : world === "sql"
        ? "#c2a975"
        : world === "python"
          ? "#86bd87"
          : "#9bb7d4";
    ctx.fillRect(ex + 8, ey, 64, 16);
    ctx.fillRect(ex, ey + 16, 80, 44);
    ctx.fillRect(ex + 8, ey + 60, 64, 8);
    ctx.fillStyle = "#17242c";
    ctx.fillRect(ex + 16, ey + 26, 12, 10);
    ctx.fillRect(ex + 51, ey + 26, 12, 10);
    ctx.fillRect(ex + 28, ey + 48, 24, 6);
    if (flash) {
      ctx.fillStyle = "#bcf484";
      ctx.fillRect(300, ey + 20, 140, 8);
    }
  } else {
    drawCharacter(ctx, w * 0.43, h * 0.62, "#e4d4ac", 2);
    ctx.fillStyle = "#d2e7ac";
    ctx.fillRect(w * 0.49, h * 0.4, 8, 8);
    ctx.fillRect(w * 0.49 + 2, h * 0.4 - 4, 4, 16);
  }
}
