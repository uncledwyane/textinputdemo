var serverURL = SERVER_URL;
var accessKey = ACCESS_KEY;
var secretKey = SECRET_KEY;

var accessToken = null;

var roomId = null;
var userId = Math.uuid();
var userName = 'user' + parseInt(Math.floor(Math.random() * 9000) + 1000);

var AVDEngine = ModuleBase.use(ModulesEnum.avdEngine);
var avdEngine = new AVDEngine();
avdEngine.setLog(Appender.browserConsole, LogLevel.debug);
avdEngine.initDevice();

var restApi = new RestApi(serverURL);

var currentBoard

// 鼠标
function chooseMouse() {
    setTextState(false)
	currentBoard.annotation.setShapeType(shapeTypeEnum.mouse);
}

// 激光笔
function startHlightPoint() {
    setTextState(false)
	currentBoard.annotation.startHlightPoint();
}

// 笔
function selectChangeType(shapeType) {
    setTextState(false)
	if(shapeType == 999) {
		currentBoard.annotation.setShapeType(shapeTypeEnum.line);
		currentBoard.annotation.setArrowType(arrowTypeEnum.double);
	} else if(shapeType == 333) {
		currentBoard.annotation.setShapeType(shapeTypeEnum.rect);
        currentBoard.annotation.setFillColor(fillTypeEnum.full);
  		currentBoard.annotation.setColorOpacity(0.5);        
	} else {
		currentBoard.annotation.setArrowType(arrowTypeEnum.none);
		currentBoard.annotation.setShapeType(shapeType);
	}

    disableTextMouseEvent()
    
    isEraser = false
}

// 橡皮擦
function clearAnnotation() {
    setTextState(false)
	currentBoard.annotation.setShapeType(shapeTypeEnum.eraser, './img/board_eraser.png');
    isEraser = true
    enableTextMouseEvent()
}

// 撤销
function undo() {
	currentBoard.annotation.undo();
    setTextState(false)
    
    disableTextMouseEvent()
}

// 清除
function eraser() {
	currentBoard.annotation.clear();
    setTextState(false)
    
    disableTextMouseEvent()
}

// 保存
function download() {
    var backgroundCanvas = document.getElementById('backgroundCanvas');
	currentBoard.annotation.download(backgroundCanvas);
    setTextState(false)
}

var colorIpt = document.getElementById('colorIpt');
// 监听颜色变化
function selectToolColorChange(){
    var color = "rgba(" + colorRgb(colorIpt.value) + ")";
    currentBoard.annotation.setColor(color);
}


// 颜色值转化为rgba格式
function colorRgb(value){
    var sColor = value.toLowerCase();
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i=1; i<4; i+=1) {
                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i=1; i<7; i+=2) {
            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
        }
        return sColorChange.join(",") + ",1";
    }
    return sColor;
}

//iPhone手机上，QQ浏览器,搜狗浏览器,火狐浏览器等切换到后台再切回前台，或接听电话后，音视频控件的播放状态会变成暂停，通过监听进行处理。
document.addEventListener("visibilitychange", () => { 
    //当浏览器的某个标签页切换到后台就会触发
	if(document.hidden) {
		console.info("+++visibilitychange页面被挂起");
	//从后台切换到前台时就会触发
	}else {
		console.info("+++visibilitychange页面呼出");
		var videos = document.getElementsByTagName("video");
		for(var video of videos){
		   video.play();
		}
		
		var audios = document.getElementsByTagName("audio");
		for(var audio of audios){
		   audio.play();
		}
    }
});