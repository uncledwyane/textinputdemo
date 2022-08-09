var localVideo = document.getElementById('localVideo');
var canvas = document.getElementById('canvas');
var custom = document.getElementById('custom');
var customUrl = document.getElementById('customUrl');
var boardTool = document.getElementById('board-tool');
var boardSetBtn = document.getElementById('boardSetBtn');
var createBoardBtn = document.getElementById('createBoard');
var clearBoardBtn = document.getElementById('clearBoard');
var updateBgBtn = document.getElementById('updateBoard');
var operateBoardBtn = document.getElementById('operateBoard');
var boardColorSet = document.getElementById('boardColorSet');
var receiverA = document.getElementById('receiverBtn');
var updateBoardBgColorBtn = document.getElementById('updateBoardBgColor');
var chooseBgColorBtn = document.getElementById('chooseBgColor');
var imageURL,localVideoId;
var imgForCanvas = new Image();


var self = this;

restApi.getAccessToken(accessKey, secretKey).then((res) => {
    log.debug('Success', res)
    self.accessToken = res.token;
    createRoom()
}).otherwise((error) => {
    log.debug("Error", error);
    $(".promptMsg").html('getAccessToken(),error:' + error.msg);

})

function joinRoom() {
    if (room) { return }
    if ($("#first").val() == '') {
        $('.promptMsg').html('会议号不能为空，请先创建房间');
    } else {
        var receiverA = document.getElementById('receiverBtn');
        self.roomId = $("#first").val();
        if(receiverA) {
            receiverA.href = './reception.html?roomId=' + self.roomId;
        }
        avdEngine.init(self.serverURL, self.accessToken).then(initSuccess).otherwise(initError);
    }
}

function initSuccess() {
    room = avdEngine.obtainRoom(self.roomId);
    room.join(self.userId, self.userName, '', '').then(joinSuccess).otherwise(joinError);
}

function initError(error) {
    $(".promptMsg").html("AVDEngine 初始化失败！initError(),error:" + error.message);
}

function joinError(error) {
    console.log('==================joinError(),error:', error)
    if (error.code == 404) {
        $(".promptMsg").html("加会失败！原因房间没有找到，请核实。joinError(),error");
    } else {
        $(".promptMsg").html('joinError(),error:' + error.message + "[" + error.code + "]");
    }
}

function createRoom() {
    var topic = 'testingMeeting';
    restApi.createRoom(self.accessToken, topic, self.userId).then((res) => {
        console.log('Success', res)
        $("#first").val(res.room_id);
        joinRoom()
    }).otherwise((error) => {
        console.log("Error", error)
        $(".promptMsg").html('createRoom(),error:' + error.msg);
    })
}

function joinSuccess() {
    console.log('加入会议成功');
    $(".promptMsg").html('加入会议成功');
    setTimeout(()=>{
        $(".promptMsg").html('');
    },2000)

    registerRoomCallback();

    setTimeout(() => { createBoard() }, 2000)
}

function registerRoomCallback() {
    room.addCallback(RoomCallback.connection_status, onConnectionStatus);
}

/**
 * @desc 网络状态回调
 */
function onConnectionStatus(status) {
    if(status == ConnectionStatus.connecting) {
		$(".promptMsg").html("网络故障,正在与服务器重连中...");
	} else if(status == ConnectionStatus.connected) {
		//连接成功
		$(".promptMsg").html("");
	} else if(status == ConnectionStatus.reJoinConnected) {
		//重新加会成功
		$(".promptMsg").html("");
	} else if(status == ConnectionStatus.reconnected) {
		//重连接成功
		$(".promptMsg").html("");
	} else if(status == ConnectionStatus.connectFailed) {
		$(".promptMsg").html("网络故障,与服务器重连超时，正在重新加会操作中...");

		//应用层清场
		if(room.connectionInfoCollector) {
			room.connectionInfoCollector.stop(); //停止收集网络情况
		}
	} else if(status == ConnectionStatus.reJoinRoomTimeOut) {
		$(".promptMsg").html("网络故障,重新加会中...");
	    room.continuousReJoin();
	}
}


function openCamera() {
    var videos = room.selfUser.videos;
    if (videos && videos.length > 0) {
        var video = videos[0];
        if (video) {
            localVideoId = video.id;
            video.previewAndPublish(localVideo).then(()=>{
                setTimeout(()=>{
                    canvas.width = localVideo.offsetWidth;
                    canvas.height = localVideo.offsetHeight;
                    canvas.getContext('2d').drawImage(localVideo, 0, 0, canvas.width, canvas.height);
                    saveAndUpload();
                },1000)
            }).otherwise(showError);
        }
    }
}


function closeCamera(){
    var video = room.selfUser.getVideo(localVideoId);
    console.log
	video.unpreview();
	video.unpublish();
}

function showError() {
    $(".promptMsg").html('showError(),error:'+error.message+"["+error.code+"]");
}

var boardDom = document.getElementById('board_board');
function createBoard(){
    console.log('+++123, createBoard()');
    var backgroundColor = '0,0,0,0';
    var boardWidth = boardDom.offsetWidth;
    var boardHeight = boardDom.offsetHeight;
    log.info(`+++board: width: ${boardWidth}, height: ${boardHeight}`)
   
    var board = room.selfUser.createBoard(boardWidth, boardHeight, backgroundColor, null,'',boardWidth,boardHeight);
    createBoardHandle(board);
}

/**
 * board对象的内容
 * @param {String} userId - 创建者userId
 * @param {int} width -  白板的渲染宽度
 * @param {int} height - 白板的渲染高度
 * @param {Object} backgroundColor - 白板的背景色
 * @param {String} backgroundImage - 白板的背景图访问路径
 * @param {String} title - 白标标题
 * @param {int} outputWidth - 白板的输出宽度
 * @param {int} outputHeight - 白板的输出高度
 * @param {String} description - 描述
 * @param {String} extendData - 扩展内容
 */
function createBoardHandle(board) {
    console.log('+++123, createBoardHandle()');
    
    currentBoard = board;
    
	var newBoardDiv = document.createElement("Div");
	newBoardDiv.id = "board_" + board.id;
	newBoardDiv.style.width = board.width + "px";
	newBoardDiv.style.height = board.height + "px";
    newBoardDiv.style.position = 'relative';
    newBoardDiv.className = 'newBoardDiv';
    // newBoardDiv.style.background = 'url('+board.backgroundImage+') no-repeat center center';
    newBoardDiv.style.backgroundSize = '100% 100%';
    newBoardDiv.style.border = '5px solid #222';
    newBoardDiv.style.boxSizing = 'border-box';

	newBoardDiv.boardUserId = board.userId;
	newBoardDiv.boardId = board.id;

    var newBoardCanvas = document.createElement("Div");
    newBoardCanvas.className = 'newBoardCanvas';
	newBoardCanvas.style.width = "100%";
	newBoardCanvas.style.height = "100%";
	// newBoardCanvas.style.background = "rgba(" + board.backgroundColor + ")";
	newBoardCanvas.style.position = 'relative';

    // 创建批注的背景canvas
    // var backgroundCanvas = document.createElement("canvas");
    // backgroundCanvas.id = 'backgroundCanvas';
    // backgroundCanvas.width = (board.width - 10);
	// backgroundCanvas.height = (board.height - 10);
    // backgroundCanvas.style.position = 'absolute';
    // backgroundCanvas.style.left = '0';
    // backgroundCanvas.style.top = '0';
    // backgroundCanvas.style.zIndex = '-1';
    // backgroundCanvas.getContext('2d').fillStyle = "rgba(" + board.backgroundColor + ")";
    // backgroundCanvas.getContext('2d').fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    
    // 设置背景canvas的img属性
    // imgForCanvas.crossOrigin = 'anonymous';

    
    newBoardDiv.appendChild(newBoardCanvas);
    // newBoardDiv.appendChild(backgroundCanvas);
	boardDom.appendChild(newBoardDiv);
    
    init(newBoardCanvas, boardDom)
	board.createAnnotation().then(function(annotation) {
		annotation.init(newBoardCanvas)
		board.annotation.hlightPointInit('./img/icon-laserPen-move.png', 30, 30);
    });
    
    boardTool.style.display = 'flex';
}


function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

function removeBoard() {
    var board = room.selfUser.boards[0];
	if(board && board.status == boardStatusEnum.open) {
        if(localVideoId) {
            closeCamera();
        }
        removeBoardHandle(board.id);
        // 通过user.closeBoardById关闭白板
        room.selfUser.closeBoardById(board.id);
        room.selfUser.removeBoardById(board.id);
        // room.selfUser.boards = [];
        boardTool.style.display = 'none';
        clearBoardBtn.disabled = true;
        operateBoardBtn.disabled = true;
	}
}

function operateBoard() {
    var board = room.selfUser.boards[0];
    if(board){
        if(board.status == boardStatusEnum.close){
            // 开启白板
            room.selfUser.shareBoardById(board.id);
            createBoardHandle(board);
            operateBoardBtn.innerText = '关闭白板';
        }else if(board.status == boardStatusEnum.open){
            // 关闭白板
            room.selfUser.closeBoardById(board.id);
            removeBoardHandle(board.id);
            operateBoardBtn.innerText = '打开白板';
        }
    }
}

function leaveRoom () {
    if(!room){return}
    var close = window.confirm('您确认退出会议?');
	if(close) {
		var reason = 1; //退会原因
		room.leave(reason).then(function() {
            top.location = "index.html";
			return false;
       });
	}
}


function removeBoardHandle(boardId) {
	var removeBoardDivName = "board_" + boardId;
	var removeBoardsDiv = document.getElementById(removeBoardDivName);
	boardDom.removeChild(removeBoardsDiv);
    currentBoard = null;
    
    boardSetBtn.disabled = false;
    createBoardBtn.disabled = false;
}
