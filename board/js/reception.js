var imgForCanvas = new Image();
var remoteBoardId = '';

GetRequest()
function GetRequest() {  
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();  
    if (url.indexOf("?") != -1) {  
        var str = url.substr(1);  
        strs = str.split("&");  
        for(var i = 0; i < strs.length; i ++) {  
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
        }  
    }  
    if(theRequest.roomId) {
        first.value = theRequest.roomId
    };
}

// 获取token
restApi.getAccessToken(accessKey, secretKey).then((res) => {
    log.debug('Success', res)
    self.accessToken = res.token;
}).otherwise((error) => {
    log.debug("Error", error);
    $(".promptMsg").html('getAccessToken(),error:' + error.msg);

})

//  加入会议
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

//  初始化成功
function initSuccess() {
    room = avdEngine.obtainRoom(self.roomId);
    room.join(self.userId, self.userName, '', '').then(joinSuccess).otherwise(joinError);
}

//  初始化失败
function initError(error) {
    $(".promptMsg").html("AVDEngine 初始化失败！initError(),error:" + error.message);
}

//  加入房间失败
function joinError(error) {
    console.log('==================joinError(),error:', error)
    if (error.code == 404) {
        $(".promptMsg").html("加会失败！原因房间没有找到，请核实。joinError(),error");
    } else {
        $(".promptMsg").html('joinError(),error:' + error.message + "[" + error.code + "]");
    }
}

//  加入房间成功
function joinSuccess() {
    log.debug('加入会议成功');
    registerRoomCallback();

    participantsHandle(room.getParticipants());
}

function registerRoomCallback() {
    room.addCallback(RoomCallback.connection_status, onConnectionStatus);

    room.addCallback(RoomCallback.user_join_notify, onUserJoinNotify);
	room.addCallback(RoomCallback.user_leave_notify, onUserLeaveNotify);
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

/**
 * @desc 参会者加会回调
 * @param {Object} users － 参会者数组
 */
function onUserJoinNotify(users) {
	participantsHandle(users);
}

/**
 * @desc 参会者退会回调
 * @param {int} opt - 退会类型
 * @param {int} reason  - 退会原因
 * @param {Object} user - 退会用户
 */
function onUserLeaveNotify(opt, reason, user) {
	console.log("==========onUserLeaveNotify(),reason:",reason,",user:",user);

    boardTool.style.display = 'none';
    if(remoteBoardId){
        removeBoardHandle(remoteBoardId);
    }
	//服务器端报807错误，说明UDP不通或UDP连接超时
	if(reason == 807) {
		$(".promptMsg").html("807错误，UDP不通或UDP连接超时！").show();
		return;
	}
	
	if(reason == 812){
		$(".promptMsg").html(user.id+" 已异常退会").show();
	}else{
		$(".promptMsg").html(user.id+" 已退会").show();
	}
	
}

function participantsHandle(participants) {
    participants.forEach(function(user) {
        user.addCallback(UserCallback.board_share_result, onBoardShareResult);
        user.addCallback(UserCallback.board_update_result, onBoardUpdateResult);
        user.addCallback(UserCallback.board_close_result, onBoardCloseResult);
    })
}

function onBoardShareResult(board){
    console.log("===================onBoardShareResult(),board:",board);
    console.log('+++123, onBoardShareResult()');
	
	//设置当前白板的渲染宽(高)度，输入的对应的x,y等坐标也是基于这个输入的宽(高)度重新计算的。
	board.setRenderWidthAndHeight(800,800);
	createBoardHandle(board);
    remoteBoardId = board.id;
}

function onBoardUpdateResult(boardId,backgroundColor,backgroundImage) {
    console.log("+++onBoardUpateResult(),boardId:",boardId+",backgroundColor:"+backgroundColor+",backgroundImage:"+backgroundImage);
    console.log('room.getUser(room.getOwnerId()).boards[0]',  room.getUser(room.getOwnerId()).boards);
    var boardDiv = document.getElementById('board_' + boardId);
    var newBackgroundImage = '';
    if(boardDiv){
        
        // 使用userAgent区分对方是web还是android，web发过来的初始路径不带?所以使用?来刷新图片，android的路径已经带有一个?所以使用&来刷新
        judgeUserAgent().then(function (userAgent){
            if(backgroundImage){
                console.log('++++onBoardUpdateResult, backgroundImage not null, will change backgroundImage, backgorund url: ', backgroundImage);
                if(backgroundColor){
                    changeBgColor(backgroundColor);
                }
                if(userAgent == 'web'){
                    newBackgroundImage = backgroundImage + '?temp=' + new Date().getTime();
                    updateImgAndCanvas(newBackgroundImage, boardDiv.offsetWidth, boardDiv.offsetHeight);
                    boardDiv.style.backgroundSize = '100% 100%';
                    console.log('+++, web update board background success!, background url: ', newBackgroundImage);
                }else{
                    newBackgroundImage = backgroundImage + '&temp=' + new Date().getTime();
                    updateImgAndCanvas(newBackgroundImage, boardDiv.offsetWidth, boardDiv.offsetHeight);
                    boardDiv.style.backgroundSize = '100% 100%';
                    console.log('+++, other update board background success!, background url: ', newBackgroundImage);
                }

            }
            else{
                console.log('++++onBoardUpdateResult, backgroundImage is null! will set backgroundColor! backgroundColor is ', backgroundColor);
                changeBgColor(backgroundColor);
            }
        })

    }else{
        console.log('+++havn\'t found this board!');
    }
    
}

function changeBgColor(backgroundColor){
    console.log('+++changeBgColor, color is ', backgroundColor);
    var backgroundCanvas = document.getElementById('backgroundCanvas');
    var backgroundCanvasCtx = backgroundCanvas.getContext('2d');
    var boardDiv = document.getElementsByClassName('newBoardDiv')[0];
    backgroundCanvasCtx.fillStyle = 'rgb(' + backgroundColor + ')';
    backgroundCanvasCtx.fillRect(0,0,boardDiv.offsetWidth, boardDiv.offsetHeight);
    console.log('+++, fillRect, width: ', boardDiv.offsetWidth, ', height: ', boardDiv.offsetHeight);
}

var boardDom = document.getElementById('board');
var boardTool = document.getElementById('board-tool');
var currentBoard
function createBoardHandle(board) {
    console.log('+++123, createBoardHandle(), board: ', board);
    currentBoard = board;
    
	var newBoardDiv = document.createElement("Div");
	newBoardDiv.id = "board_" + board.id;
	newBoardDiv.style.width = board.width + "px";
	newBoardDiv.style.height = board.height + "px";
    newBoardDiv.style.position = 'relative';
    newBoardDiv.className = 'newBoardDiv';
    
    newBoardDiv.style.backgroundSize = '100% 100%';
    newBoardDiv.style.border = '5px solid #222';
    newBoardDiv.style.boxSizing = 'border-box';
    
	newBoardDiv.boardUserId = board.userId;
	newBoardDiv.boardId = board.id;
    
	var newBoardCanvas = document.createElement("Div");
	newBoardCanvas.style.width = "100%";
	newBoardCanvas.style.height = "100%";
    newBoardCanvas.style.position = 'relative';
    
    if(board.backgroundImage !== null){
        newBoardCanvas.style.background = 'rgba(0,0,0,0)'
    }

    // 创建批注得背景canvas
    var backgroundCanvas = document.createElement("canvas");
    backgroundCanvas.id = 'backgroundCanvas';
    backgroundCanvas.width = (board.width - 10);
	backgroundCanvas.height = (board.height - 10);
    backgroundCanvas.style.position = 'absolute';
    backgroundCanvas.style.left = '0';
    backgroundCanvas.style.top = '0';
    backgroundCanvas.style.zIndex = '-1';
    backgroundCanvas.getContext('2d').fillStyle = "rgba(" + board.backgroundColor + ")";
    backgroundCanvas.getContext('2d').fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    

    // 设置背景canvas的img属性
    imgForCanvas.crossOrigin = 'anonymous';


    boardDom.appendChild(newBoardDiv);
	newBoardDiv.appendChild(newBoardCanvas);
    newBoardDiv.appendChild(backgroundCanvas);
    
    judgeUserAgent().then(function (userAgent){
        if(board.backgroundImage){
            if(userAgent == 'web'){
                var imgPath = board.backgroundImage + '?temp=' + new Date().getTime();
                updateImgAndCanvas(imgPath, board.width - 10, board.height - 10);
            }else{
                var imgPath = board.backgroundImage + '&temp=' + new Date().getTime();
                updateImgAndCanvas(imgPath, board.width - 10, board.height - 10);
            }
        }
    })

	board.createAnnotation().then(function(annotation) {
		annotation.init(newBoardCanvas)
		board.annotation.hlightPointInit('./img/icon-laserPen-move.png', 30, 30);
    });
    
    boardTool.style.display = 'flex';
}

/**
 * @desc 更新canvas背景层的图片
 * @param {String} imgUrl 图片路径
 * @param {Int} boardWidth 白板宽度
 * @param {Int} boardHeight 白板高度
 */
function updateImgAndCanvas(imgUrl, boardWidth, boardHeight){
    console.log('+++123, updateImgAndCanvas begin, boardWidth: ', boardWidth, ', boardHeight: ', boardHeight);
    var bgCtx = document.getElementById('backgroundCanvas').getContext('2d');
    imgForCanvas.src = imgUrl;
    imgForCanvas.onload = function (){
        bgCtx.drawImage(imgForCanvas, 0, 0, imgForCanvas.width, imgForCanvas.height, 0, 0, boardWidth, boardHeight);
        console.log(`+++123, updateImgAndCanvas imgForCanvas: ${imgForCanvas}, boardWidth: ${boardWidth}, boardHeight: ${boardHeight},  currentBoard: ${currentBoard}`);
        console.log('+++123, updateImgAndCanvas finished');
    }
}

function judgeUserAgent(){
    var promise = new Promise(function (resolve, reject){
        var userAgent = '';
        room.participants.forEach(function (user){
            if(user.id != room.selfUser.id){
                userAgent = user.userAgent;
                console.log('+++judgeUserAgent(), another user\'s userAgent is: ', userAgent);
                resolve(userAgent);
            }
        })
    })
    return promise;
}

function onBoardCloseResult(boardId){
    boardTool.style.display = 'none';
    removeBoardHandle(boardId);
}

function removeBoardHandle(boardId) {
	var removeBoardDivName = "board_" + boardId;
	var removeBoardsDiv = document.getElementById(removeBoardDivName);
	boardDom.removeChild(removeBoardsDiv);
    currentBoard = null;
}


//退会
function leaveRoom () {
    if(!room){return}
    var close = window.confirm('您确认退出会议?');
	if(close) {
		var reason = 1; //退会原因
		room.leave(reason).then(function() {
            top.location = "reception.html";
			return false;
       });
	}
}