const TWEEN = require("@tweenjs/tween.js");
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
document.body.style.margin = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const WAVE_AMOUNT = 40;
const drawWorm = (x, y, color, life, time) => {
	ctx.lineWidth = 60;
	ctx.lineCap = "round";
	ctx.strokeStyle = color;
	ctx.globalAlpha = life;
	ctx.beginPath();
	for (var i = 0; i < 40; i++) {
		ctx.lineTo(x + Math.sin(i / 5 + time) * (WAVE_AMOUNT - i), y + i * 10);
	}
	ctx.stroke();
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.arc(x + Math.sin(time) * WAVE_AMOUNT - 10, y - 15, 5, 0, Math.PI * 2);
	ctx.fill();
	ctx.arc(x + Math.sin(time) * WAVE_AMOUNT + 10, y - 15, 5, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(x + Math.sin(time) * WAVE_AMOUNT, y, 15, 0, Math.PI);
	ctx.fill();
};
const layout = ["qwertyuiop[]", "asdfghjkl;'", "zxcvnm,./"].map((row) =>
	row.split("")
);
const keys = layout.flat();
const ROW_SEPARATION = canvas.height / 2;
const KEY_SEPARATION = canvas.width / 1.5;
let keysPressed = keys.reduce((map, key) => {
	map[key] = { life: 0, audio: new Audio() };
	map[key].audio.src = `sounds/${key}.mp3`;
	map[key].audio.preload = true;
	return map;
}, {});

const render = () => {
	requestAnimationFrame(render);
	TWEEN.update();
	ctx.save();
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.translate(canvas.width / 2, canvas.height / 2);
	const t = Date.now() / 100;
	layout.forEach((row, rowI) => {
		const y = (rowI / layout.length - 0.5) * ROW_SEPARATION;
		row.forEach((key, keyI) => {
			const life = keysPressed[key].life;
			if (life === 0) return;
			const x = ((keyI + 0.5) / row.length - 0.5) * KEY_SEPARATION;
			const hue = (keyI * 40 + rowI * 130) % 360;
			const color = `hsl(${hue}, 100%, 50%)`;
			drawWorm(
				x,
				y + (1 - life) * 20,
				color,
				life,
				t + keyI * 23.2 + rowI * 123.4
			);
		});
	});
	drawWorm(0, 0, "red", t);
	ctx.restore();
};
window.addEventListener("keydown", (e) => {
	if (e.repeat) return;
	const keyObj = keysPressed[e.key];
	keyObj.audio && keyObj.audio.play();
	keyObj.tween && keyObj.tween.stop();
	keyObj.tween = new TWEEN.Tween(keyObj).to({ life: 1 }, 100).start();
});
window.addEventListener("keyup", (e) => {
	const keyObj = keysPressed[e.key];
	keyObj.tween && keyObj.tween.stop();
	keyObj.tween = new TWEEN.Tween(keyObj).to({ life: 0 }, 300).start();
});
render();
