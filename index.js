// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const FRAME_TIME = 1000 / 60;
class Renderer {
    canvas;
    ctx;
    dots;
    width;
    height;
    maxConnectionDistance;
    constructor(canvas, options = {}){
        this.maxConnectionDistance = options.connectionDistance ?? 75;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.dots = new Array(options.dotCount ?? 50);
        console.log(this.width, this.height);
        for(let i = 0; i < this.dots.length; i++){
            const coord = [
                Math.random() * (this.width - 10) + 10 | 0,
                Math.random() * (this.height - 10) + 10 | 0, 
            ];
            this.ctx.fillRect(coord[0] - 3, coord[1] - 3, 3, 3);
            this.dots[i] = {
                velocity: Math.random() / 4 + 0.05,
                coordinates: coord,
                angle: Math.random() * Math.PI * 2
            };
        }
        this.ctx.lineWidth = 2;
        this.draw();
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();
        for(let i = 0; i < this.dots.length - 1; i++){
            const base = this.dots[i];
            for(let j = i + 1; j < this.dots.length; j++){
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
        for(let i = 0; i < this.dots.length; i++){
            const dot = this.dots[i];
            if (dot.coordinates[1] < 3 || dot.coordinates[1] > this.height - 3) {
                dot.angle = -dot.angle;
            }
            if (dot.coordinates[0] < 3 || dot.coordinates[0] > this.width - 3) {
                dot.angle = Math.PI - dot.angle;
            }
            const distanceX = Math.cos(dot.angle) * dot.velocity;
            const distanceY = Math.sin(dot.angle) * dot.velocity;
            dot.coordinates[0] += distanceX;
            dot.coordinates[1] += distanceY;
        }
    }
    drawDots() {
        for(let i = 0; i < this.dots.length; i++){
            const dot = this.dots[i];
            this.ctx.fillRect(dot.coordinates[0] - 3, dot.coordinates[1] - 3, 5, 5);
        }
    }
}
async function main() {
    const r = new Renderer(document.getElementById("background"));
    while(true){
        const start = performance.now();
        r.tick();
        r.draw();
        await new Promise((res)=>setTimeout(res, FRAME_TIME - (performance.now() - start))
        );
    }
}
main();

