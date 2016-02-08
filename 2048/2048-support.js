//获取当前屏幕宽度
documentWidth = window.screen.availWidth;

gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;
//获取坐标

function getPosTop(i, j) {
	return cellSpace + i * (cellSpace + cellSideLength);
}

//获取坐标

function getPosLeft(i, j) {
	return cellSpace + j * (cellSpace + cellSideLength);
}

//数字背景颜色

function getNumberBackgroundColor(number) {
	switch (number) {
		case 2:
			return "#eee4da";
			break;
		case 4:
			return "#ede0c8";
			break;
		case 8:
			return "#f2b179";
			break;
		case 16:
			return "#f59563";
			break;
		case 32:
			return "#f67c5f";
			break;
		case 64:
			return "#f65e3b";
			break;
		case 128:
			return "#edcf72";
			break;
		case 256:
			return "#edcc61";
			break;
		case 512:
			return "#9c0";
			break;
		case 1024:
			return "#33b5e5";
			break;
		case 2048:
			return "#09c";
			break;
		case 4096:
			return "#a6c";
			break;
		case 8192:
			return "#93c";
			break;
	}
	return "black";
}

//DIY
function getNumberText(number){
	switch(number){
		case 2:return "2"; break;
		case 4:return "4"; break;
		case 8:return "8"; break;
		case 16:return "16"; break;	
		case 32:return "32"; break;	
		case 64:return "64"; break;
		case 128:return "128"; break;
		case 256:return "256"; break;	
		case 512:return "512"; break;	
		case 1024:return "1024"; break;	
		case 2048:return "2048"; break	;
		case 4096:return "4096"; break	;
		case 8192:return "8192"; break	;
	}
    return "black";
}

//数字颜色

function getNumberColor(number) {
	if (number <= 4)
		return "#776e65";

	return "white";
}

//检查是否没有空间

function nospace(board) {
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			if (board[i][j] == 0)
				return false;
	return true;
}

//是否还能移动

function nomove() {
	if (canMoveLeft(board) ||
		canMoveRight(board) ||
		canMoveUp(board) ||
		canMoveDown(board))
		return false;
	return true;
}
//判定是否能向左移动

function canMoveLeft(board) {

	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++)
			if (board[i][j] != 0)
				if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
					return true;

	return false;
}
//判定是否能向右移动

function canMoveRight(board) {

	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--)
			if (board[i][j] != 0)
				if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
					return true;

	return false;
}
//判定是否能向上移动

function canMoveUp(board) {

	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++)
			if (board[i][j] != 0)
				if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
					return true;

	return false;
}
//判定是否能向下移动

function canMoveDown(board) {

	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--)
			if (board[i][j] != 0)
				if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
					return true;

	return false;
}
//判断左右移动的路径上是否有障碍物

function noBlockHorizontal(row, col1, col2, board) {
	for (var i = col1 + 1; i < col2; i++)
		if (board[row][i] != 0)
			return false;
	return true;
}
//判断上下移动的路径上是否有障碍物

function noBlockVertical(col, row1, row2, board) {
	for (var i = row1 + 1; i < row2; i++)
		if (board[i][col] != 0)
			return false;
	return true;
}