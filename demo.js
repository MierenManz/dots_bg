const FRAME_TIME = 1000 / 60;

async function main() {
  const r = new Renderer(
    document.getElementById("background"),
    { dotCount: 175 },
  );

  while (true) {
    const start = performance.now();
    r.tick();
    r.draw();
    await new Promise((res) =>
      setTimeout(res, FRAME_TIME - (performance.now() - start))
    );
  }
}

main();
