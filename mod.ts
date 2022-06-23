/// <reference lib="DOM"/>

interface Dot {
  velocity: [number, number];
  coordinates: [number, number];
}

interface Options {
  dotCount?: number;
  connectionDistance?: number;
}

class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dots: Dot[];
  width: number;
  height: number;
  maxConnectionDistance: number;

  constructor(
    canvas: HTMLCanvasElement,
    options: Options = {},
  ) {
    this.maxConnectionDistance = options.connectionDistance ?? 75;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.dots = new Array(options.dotCount ?? 50);

    for (let i = 0; i < this.dots.length; i++) {
      const coord: [number, number] = [
        Math.random() * (this.width - 50) + 50 | 0,
        Math.random() * (this.height - 50) + 50 | 0,
      ];

      this.ctx.fillRect(coord[0] - 3, coord[1] - 3, 3, 3);
      const velocities = [Math.random() / 4 + 0.075, Math.random() / 4 + 0.075];
      this.dots[i] = {
        velocity: [Math.random() / 4 + 0.1, Math.random() / 4 + 0.1],
        coordinates: coord,
      };

      if ((Math.random() * 2 | 0) === 0) {
        this.dots[i].velocity[0] = -this.dots[i].velocity[0];
      }
      if ((Math.random() * 2 | 0) === 0) {
        this.dots[i].velocity[1] = -this.dots[i].velocity[1];
      }
    }

    this.ctx.lineWidth = 2;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.beginPath();
    for (let i = 0; i < this.dots.length - 1; i++) {
      const base = this.dots[i];

      for (let j = i + 1; j < this.dots.length; j++) {
        const neighbour = this.dots[j];

        const a = Math.abs(base.coordinates[0] - neighbour.coordinates[0]);
        const b = Math.abs(base.coordinates[1] - neighbour.coordinates[1]);

        const distance = Math.sqrt(a ** 2 + b ** 2);

        if (distance < this.maxConnectionDistance) {
          this.ctx.moveTo(base.coordinates[0], base.coordinates[1]);
          this.ctx.lineTo(neighbour.coordinates[0], neighbour.coordinates[1]);
        }
      }
    }

    this.ctx.closePath();
    this.drawDots();
    this.ctx.stroke();
  }

  tick() {
    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];

      if (dot.coordinates[1] < 3 || dot.coordinates[1] > this.height - 3) {
        dot.velocity[1] = -dot.velocity[1];
      }

      if (dot.coordinates[0] < 3 || dot.coordinates[0] > this.width - 3) {
        dot.velocity[0] = -dot.velocity[0];
      }

      dot.coordinates[0] += dot.velocity[0];
      dot.coordinates[1] += dot.velocity[1];
    }
  }

  drawDots() {
    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];
      this.ctx.fillRect(dot.coordinates[0] - 3, dot.coordinates[1] - 3, 5, 5);
    }
  }
}

// deno-lint-ignore no-explicit-any
(globalThis as any).Renderer = Renderer;
