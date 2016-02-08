var board = new Array(); //棋盘
var score = 0; //得分
var hasConflicted = new Array(); //防止连续叠加

//触控
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

//页面载入完开始初始化
$(document).ready(function() {
	//准备适应屏幕
	prepareForMobile();
	newgame();
})

//自适应

function prepareForMobile() {

	if (documentWidth > 500) {
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	$('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	$('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}


function newgame() {
	//初始化
	init();
	//随机生成两个格子数字
	generateOneNumber();
	generateOneNumber();
}

//初始化函数

function init() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {

			var gridCell = $('#grid-cell-' + i + "-" + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}
	}
	for (var i = 0; i < 4; i++) {
		board[i] = new Array;
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++)
			board[i][j] = 0;
		hasConflicted[i][j] = false;
	}

	updateBoardView();

	score = 0;
	updateScore(score);
}


//更新数据

function updateBoardView() {
	$(".number-cell").remove(); //更新前先全部删除
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
			var theNumberCell = $('#number-cell-' + i + '-' + j);

			if (board[i][j] == 0) {
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
				theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
			} else {
				theNumberCell.css('width', cellSideLength);
				theNumberCell.css('height', cellSideLength);
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));

				//DIY
				theNumberCell.text(getNumberText(board[i][j]));
			}
			hasConflicted[i][j] = false;
		}
	$('.number-cell').css('line-height', cellSideLength + 'px');
	$('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

//随机生成一个数字

function generateOneNumber() {

	if (nospace(board))
		return false;

	//随机位置
	var count = 0;
	var temporary = new Array();
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			if (board[i][j] == 0) {
				temporary[count] = i * 4 + j;
				count++;
			}
		}
	var pos = parseInt(Math.floor(Math.random() * count));

	randx = Math.floor(temporary[pos] / 4);
	randy = Math.floor(temporary[pos] % 4);


	//随机数字
	var randomNumber = Math.random() < 0.5 ? 2 : 4;

	//显示
	board[randx][randy] = randomNumber;
	showNumberWithAnimation(randx, randy, randomNumber);

	return true;
}

//按键
$(document).keydown(function(event) {
	switch (event.keyCode) {
		case 37: //左
			if (moveLeft()) { //移动
				setTimeout("generateOneNumber()", 210); //生成
				setTimeout("isgameover()", 300); //判定游戏是否结束
			}
			break;
		case 38: //上
			if (moveUp()) {
				setTimeout("generateOneNumber()", 210); //生成
				setTimeout("isgameover()", 300); //判定游戏是否结束
			}
			break;
		case 39: //右
			if (moveRight()) {
				setTimeout("generateOneNumber()", 210); //生成
				setTimeout("isgameover()", 300); //判定游戏是否结束
			}
			break;
		case 40: //下
			if (moveDown()) {
				setTimeout("generateOneNumber()", 210); //生成
				setTimeout("isgameover()", 300); //判定游戏是否结束
			}
			break;
		default:
			break;
	}
});

//触控事件
document.addEventListener('touchstart', function(event) {
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;

});

//小屏幕防滑
document.addEventListener('touchmove',function(event) {
	var containerY = $('#grid-container').offset().top;
	if (containerY < starty)
		event.preventDefault();
});

document.addEventListener('touchend', function(event) {
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if (Math.abs(deltax) < 0.1 * documentWidth && Math.abs(deltay) < 0.1 * documentWidth)
		return;

	if (Math.abs(deltax) >= Math.abs(deltay)) {
		//X方向
		if (deltax > 0) {
			//右
			if (moveRight()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}

		}
		//左
		else {
			if (moveLeft()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}

		}
	}
	//Y方向
	else {
		if (deltay > 0) {
			//下
			if (moveDown()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}

		}
		//上
		else {
			if (moveUp()) {
				setTimeout("generateOneNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}
});



//判定是否结束游戏

function isgameover() {
	if (nospace(board) && nomove(board)) {
		gameover();
	}
}
//结束提示语

function gameover() {
	alert("gameover!");
}
//左移

function moveLeft() {

	event.preventDefault();

	if (!canMoveLeft(board))
		return false;

	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {

				for (var k = 0; k < j; k++) {
					//格子为空
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					//两格子内数字大小相等
					else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
						showMoveAnimation(i, j, i, k);
						board[i][k] *= 2;
						board[i][j] = 0;

						//加分
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()", 200);
	return true;
}

//右移

function moveRight() {
	event.preventDefault();

	if (!canMoveRight(board))
		return false;

	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > j; k--) {

					if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
						showMoveAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
						showMoveAnimation(i, j, i, k);
						board[i][k] *= 2;
						board[i][j] = 0;

						//加分
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()", 200);
	return true;
}


//上移

function moveUp() {

	event.preventDefault();

	if (!canMoveUp(board))
		return false;

	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < i; k++) {

					if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
						showMoveAnimation(i, j, k, j);
						board[k][j] *= 2;
						board[i][j] = 0;

						//加分
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()", 200);
	return true;
}

//下移

function moveDown() {

	event.preventDefault();

	if (!canMoveDown(board))
		return false;

	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > i; k--) {

					if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
						showMoveAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
						showMoveAnimation(i, j, k, j);
						board[k][j] *= 2;
						board[i][j] = 0;

						//加分
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}

	setTimeout("updateBoardView()", 200);
	return true;
}