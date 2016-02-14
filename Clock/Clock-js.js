//圆半径
var RADIUS = 8;


//如果为倒计时，则在此设置截止时间
var endTime = new Date(2016, 1, 15, 15, 0, 0);
var curShowTimeSeconds = 0;

//小球
var balls = [];

//明亮的色彩 const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];


//初始化
window.onload = function() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	//自适应
	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;

	MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	//刷新
	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(
		function() {
			render(context);
			update();
		}, 50
	);
}

//计算时间

function getCurrentShowTimeSeconds() {
	var curTime = new Date();
	var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();

	return ret;

	/*
	倒计时
	var ret = endTime.getTime() - curTime.getTime();
	ret = Math.round(ret / 1000);

	return ret >= 0 ? ret : 0;
	*/
}

//更新数据

function update() {

	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds / 3600);
	var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSeconds / 3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
	var curSeconds = curShowTimeSeconds % 60;

	if (nextSeconds != curSeconds) {
		if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
			addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
		}
		if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
			addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
		}
		if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
			addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
		}
		if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
			addBalls(MARGIN_LEFT + 54 * (RADIUS), MARGIN_TOP, parseInt(curMinutes % 10));
		}
		if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
			addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
		}
		if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
			addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds % 10));
		}

		curShowTimeSeconds = nextShowTimeSeconds;

	}

	updateBalls();
}

//刷新每个小球状态
function updateBalls() {

	for (var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = -balls[i].vy * 0.6;
		}
	}

	var count = 0;
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH)
			balls[count++] = balls[i];
	}

	while (balls.length > count) {
		balls.pop();
	}
}

//遍历，如果是1则增加小球
function addBalls(x, y, num) {
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				var aBall = {
					x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
					y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
					g: 2 + Math.random(),
					vx: Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 20,
					vy: Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 20,
					color: '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6)
				}

				balls.push(aBall);
			}
		}
	}
}

//绘制画布

function render(context) {

	context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds / 3600);
	var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
	var seconds = curShowTimeSeconds % 60;

	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), context);
	renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), context);
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, context);
	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), context);
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), context);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, context);
	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), context);
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), context);

	for (var i = 0; i < balls.length; i++) {
		context.fillStyle = (balls[i].color);

		context.beginPath();
		context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
		context.closePath();

		context.fill();
	}
}


//绘制数字

function renderDigit(x, y, num, context) {

	context.fillStyle = "red";

	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				context.beginPath();
				context.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
				context.closePath();

				context.fill();
			}
		}
	}
}

digit =
	[
	[
		[0, 0, 1, 1, 1, 0, 0],
		[0, 1, 1, 0, 1, 1, 0],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 1, 1, 0, 1, 1, 0],
		[0, 0, 1, 1, 1, 0, 0]
	], //0
	[
		[0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[1, 1, 1, 1, 1, 1, 1]
	], //1
	[
		[0, 1, 1, 1, 1, 1, 0],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 1, 1, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 1, 1, 1, 1, 1]
	], //2
	[
		[1, 1, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 1, 1, 1, 1, 1, 0]
	], //3
	[
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 1, 1, 1, 0],
		[0, 0, 1, 1, 1, 1, 0],
		[0, 1, 1, 0, 1, 1, 0],
		[1, 1, 0, 0, 1, 1, 0],
		[1, 1, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 1, 1, 1, 1]
	], //4
	[
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 1, 1, 1, 1, 1, 0]
	], //5
	[
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 1, 1, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 0],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 1, 1, 1, 1, 1, 0]
	], //6
	[
		[1, 1, 1, 1, 1, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 0, 1, 1, 0, 0, 0],
		[0, 0, 1, 1, 0, 0, 0],
		[0, 0, 1, 1, 0, 0, 0],
		[0, 0, 1, 1, 0, 0, 0]
	], //7
	[
		[0, 1, 1, 1, 1, 1, 0],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 1, 1, 1, 1, 1, 0],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 1, 1, 1, 1, 1, 0]
	], //8
	[
		[0, 1, 1, 1, 1, 1, 0],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[1, 1, 0, 0, 0, 1, 1],
		[0, 1, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0, 0, 0]
	], //9
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	] //:
];