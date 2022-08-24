var _DCE = function(tag){
    return document.createElement(tag)
}

var _setFontConrolStyle = function(el) {
    el.style.display = 'inline-block';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.cursor = 'pointer';
    el.style.textAlign = 'center';
    el.style.lineHeight = '30px';
    el.style.transition = 'all ease .2s';
    el.style.userSelect = 'none';

    // 背景色
    el.onmouseover = function() {
        el.style.background = 'rgba(0,0,0,.1';
    }

    el.onmouseleave = function() {
        el.style.background = '#ffffff'
    }
}

var _setBtnStyle = function(el, type) {
    el.style.marginLeft = '10px';
    el.style.fontSize = '13px';
    el.style.borderRadius = '3px';
    el.style.color = '#ffffff';
    el.style.width = '60px';

    if(type == 'confirm'){
        el.onmouseover = function() {
            el.style.background = 'rgba(0, 65, 119, 0.774)';
        }
        el.onmouseleave = function() {
            el.style.background = '#2c79bbd4'
        }
    }else{
        el.onmouseover = function() {
            el.style.background = 'rgba(44, 187, 99, 0.507)';
        }
        el.onmouseleave = function() {
            el.style.background = 'rgba(44, 187, 99, 0.774)'
        }
    }
    
}


class TextInput {
    constructor(parentEl) {
        this.currTextElStyleList = null; // 当前编辑的文字的style
        this.currTextElParentNode = parentEl; // 放置文字的父元素
        this.currTextInputMap = new Map(); // 放置当前页面所有文字元素的map（key: 文字元素id， value: 文字元素）
        this.currTextInputElBind = null; // 当前正在编辑的文字
        this.currTextIsEdit = false; // 当前是否为编辑状态
        this.currTextDefaultFontSize = 14; // 默认文字大小
        this.currTextColorChoosePanel = null;
        this.currTextFontSizeEl = null;
        this.currTextColorBtn = null;
        this.currTextColorChoosePanelIsShow = false; // 文字的颜色选择面板是否显示
    
        this.currTextToolBarEl = null;
    }
}


TextInput.prototype.initToolBar = function () {
    // toolbar
    let toolBarEl = _DCE('div');
    toolBarEl.id = '3tee-tool-bar';
    toolBarEl.style.display = 'none';
    toolBarEl.style.width = '280px';
    toolBarEl.style.boxShadow = '0 0 10px rgba(0,0,0,.3)';
    toolBarEl.style.padding = '5px 10px';
    toolBarEl.style.borderRadius = '5px';
    toolBarEl.style.height = '30px';
    toolBarEl.style.zIndex = '1000';
    toolBarEl.style.background = '#ffffff';

    this.currTextToolBarEl = toolBarEl

    let fontBoldEl = _DCE('span');
    fontBoldEl.style.fontWeight = 'bold';
    _setFontConrolStyle(fontBoldEl)
    fontBoldEl.innerText = 'B';
    fontBoldEl.onclick = this.bold.bind(this)

    let fontItalicEl = _DCE('span');
    fontItalicEl.style.fontStyle = 'italic';
    _setFontConrolStyle(fontItalicEl)
    fontItalicEl.innerText = 'I';
    fontItalicEl.onclick = this.italic.bind(this)

    let fontColorEl = _DCE('span');
    _setFontConrolStyle(fontColorEl)
    fontColorEl.innerText = 'T';
    fontColorEl.onclick = this.changeColor.bind(this)
    this.currTextColorBtn = fontColorEl

    let fontColorChoosePanel = _DCE('div');
    fontColorChoosePanel.style.background = '#FFFFFF'
    fontColorChoosePanel.style.borderRadius = '5px'
    fontColorChoosePanel.style.width = '132px'
    fontColorChoosePanel.style.height = '110px'
    fontColorChoosePanel.style.boxSizing = 'border-box'
    fontColorChoosePanel.style.padding = '10px'
    fontColorChoosePanel.style.display = 'flex'
    fontColorChoosePanel.style.flexWrap = 'wrap'
    fontColorChoosePanel.style.flexDirection = 'row'
    fontColorChoosePanel.style.justifyContent = 'flex-start'
    fontColorChoosePanel.style.alignItems = 'center'
    fontColorChoosePanel.style.boxShadow = '0 3px 6px #0000001f'
    fontColorChoosePanel.style.position = 'absolute'
    fontColorChoosePanel.style.top = '60px'
    fontColorChoosePanel.style.left = '8px'
    this.currTextColorChoosePanel = fontColorChoosePanel;
    

    let fontColorChoose1 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose1, '#e02020');

    let fontColorChoose2 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose2, '#fa6400');
    
    let fontColorChoose3 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose3, '#f7b500');
    
    let fontColorChoose4 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose4, '#6dd400');
    
    let fontColorChoose5 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose5, '#44d7b6');
    
    let fontColorChoose6 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose6, '#32c5ff');
    
    let fontColorChoose7 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose7, '#0091ff');
    
    let fontColorChoose8 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose8, '#6236ff');
    
    let fontColorChoose9 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose9, '#b620e0');
    
    let fontColorChoose10 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose10, '#6d7278');
    
    let fontColorChoose11 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose11, '#000000');
    
    let fontColorChoose12 = _DCE('span');
    this._setColorBtnStyle(fontColorChoose12, '#ffffff');

    let fontSizeEl = _DCE('input');
    _setFontConrolStyle(fontSizeEl)
    fontSizeEl.type = 'number';
    fontSizeEl.value = '14';
    fontSizeEl.style.border = 'none';
    fontSizeEl.style.width = '50px';
    fontSizeEl.style.height = '30px';
    fontSizeEl.style.display = 'inline-block';
    fontSizeEl.style.boxSizing = 'border-box';
    fontSizeEl.style.fontSize = '14px';
    fontSizeEl.style.outline = 'none';
    fontSizeEl.onchange = this.changeFontSize.bind(this)
    this.currTextFontSizeEl = fontSizeEl

    let confirmBtn = _DCE('span');
    _setFontConrolStyle(confirmBtn)
    _setBtnStyle(confirmBtn, 'confirm')
    confirmBtn.innerText = '确认'
    confirmBtn.style.background = '#2c79bbd4'
    confirmBtn.onclick = this.inputConfirm.bind(this)

    let cancelBtn = _DCE('span');
    _setFontConrolStyle(cancelBtn)
    _setBtnStyle(cancelBtn, 'cancel')
    cancelBtn.innerText = '取消'
    cancelBtn.style.background = 'rgba(44, 187, 99, 0.507)'
    cancelBtn.onclick = this.inputCancel.bind(this)

    this.currTextToolBarEl.appendChild(fontBoldEl)
    this.currTextToolBarEl.appendChild(fontItalicEl)
    this.currTextToolBarEl.appendChild(fontColorEl)
    this.currTextToolBarEl.appendChild(fontColorChoosePanel)
    this.currTextToolBarEl.appendChild(fontSizeEl)
    this.currTextToolBarEl.appendChild(confirmBtn)
    this.currTextToolBarEl.appendChild(cancelBtn)

    this.currTextElParentNode.appendChild(this.currTextToolBarEl)
}



// 控制字体
// 加粗
TextInput.prototype.bold = function (){
    if(this.currTextElStyleList.fontWeight === 'bold'){
        this.currTextElStyleList.fontWeight = ''
    }else{
        this.currTextElStyleList.fontWeight = 'bold'
    }
}
// 斜体
TextInput.prototype.italic = function italic(val){
    if(this.currTextElStyleList.fontStyle === 'italic'){
        this.currTextElStyleList.fontStyle = ''
    }else{
        this.currTextElStyleList.fontStyle = 'italic'
    }
}

// 改变字体颜色
TextInput.prototype.changeColor = function () {
    this.currTextColorChoosePanelIsShow ? this.chooseColorIsShowControl(false) : this.chooseColorIsShowControl(true)
}

// 字体大小
TextInput.prototype.changeFontSize = function (e) {
    const {value} = e.target
    if(parseInt(value) > 30 || parseInt(value) < 10){
        if(value > 30){
            e.target.value = 30
        }

        if(value < 10){
            e.target.value = 10
        }
        return
    }

    this.currTextElStyleList.fontSize = parseInt(value) + 'px'
}

// 设置工具条位置
TextInput.prototype.setToolBarPos = function (oftLeft, oftTop, oftRight,oftBottom) {
    let finalLeft = oftLeft + this.currTextToolBarEl.offsetWidth
    let finalTop = oftTop - this.currTextToolBarEl.offsetHeight - 60

    // 正上方
    if(oftTop > 40 && oftRight > 280){
        console.log(111111111111)
        finalLeft = finalLeft
        finalTop = finalTop
    }
    // 正下方
    else if(oftTop < 40 && oftRight > 280){
        console.log(2222222222222)
        finalTop = finalTop + 90
    }
    // 左方
    else if(oftTop < 40 || oftRight < 280){
        console.log(33333333333333333)
        finalLeft = finalLeft - 310
        finalTop = finalTop + 40
    }
    // 右方
    else if(oftTop < 40){
        console.log(4444444444444444444)
        finalLeft = finalLeft + 280
        finalTop = finalTop + 30
    }else {
        console.log(55555555555555555)
    }
    
    this.currTextToolBarEl.style.position = 'absolute'
    this.currTextToolBarEl.style.left = finalLeft + 'px'
    this.currTextToolBarEl.style.top = finalTop + 'px'
}

// 初始化文本输入框，准备输入
TextInput.prototype.prepareToEdit = function (x, y) {
    let RandomId = Math.round(Math.random() * 10000000)
    // 改用span和contentEditable属性来设置，避免使用input导致宽度不能自增长的问题
    let newInputEl = document.createElement('span')
    this.currTextInputElBind = RandomId

    newInputEl.contentEditable = true
    newInputEl.style.fontSize = this.currTextDefaultFontSize + 'px'
    newInputEl.style.display = 'flex';
    newInputEl.style.borderRadius = '5px';
    newInputEl.style.padding = '5px 10px';
    newInputEl.style.background = 'rgba(0,0,0,0';
    newInputEl.style.outline = 'orange dotted 2px';
    newInputEl.style.position = 'absolute';

    // 设置文本输入框位置
    this.setTextInputPos(newInputEl, x, y)
    // 将id和文本输入框绑定并保存到Map中
    this.currTextInputMap.set(RandomId, newInputEl)
    // 将创建的文本框设置为当前绑定文本输入框
    this.setCurrBindTextEl(RandomId)
    // 聚焦到当前文本框
    newInputEl.focus()
}

TextInput.prototype.setTextInputPos = function (toolbar, x, y) {
    toolbar.style.left = x + 'px'
    toolbar.style.top = (y - 10) + 'px'
    this.currTextElParentNode.appendChild(toolbar)
}

// 通过textId和工具条进行绑定，用于设置样式
TextInput.prototype.setCurrBindTextEl = function (textId) {
    let inputEl = this.currTextInputMap.get(textId)
    if(inputEl){
        this.currTextElStyleList = inputEl.style
    }
}

// 工具条隐藏控制
TextInput.prototype._setToolBarDisplay = function (isDis) {
    this.currTextToolBarEl.style.display = isDis === true ? 'flex' : 'none'
}

// 输入完成
TextInput.prototype._setTextFinished = function () {
    let inputEl = this.currTextInputMap.get(this.currTextInputElBind)
    inputEl.style.outline = 'none'
    inputEl.contentEditable = false
    this.currTextColorBtn.style.color = '#000000'
}

TextInput.prototype._setColorBtnStyle = function(el, bgColor) {
    el.style.display = 'flex';
    el.style.justifyContent = 'center';
    el.style.alignItems = 'center';
    el.style.cursor = 'pointer';
    el.style.margin = '4px';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.boxSizing = 'border-box';
    el.style.borderRadius = '50%';
    el.style.border = '1px solid rgba(0,0,0,.2)';

    el.style.background = bgColor
    el.setAttribute('color', bgColor);

    this.currTextColorChoosePanel.appendChild(el)

    el.onclick = this._handleColorClick.bind(this)
}

/**
 *  颜色选择的panel
 */
TextInput.prototype._handleColorClick = function(e){
    this.currTextElStyleList.color = e.target.getAttribute('color')
    this.currTextColorBtn.style.color = e.target.getAttribute('color')
    this.chooseColorIsShowControl(false)
}


TextInput.prototype.init = function() {
    console.log('+++init, parentEl: ', this.currTextElParentNode)
    // 初始化颜色选择按钮
    this.chooseColorIsShowControl(false)
    this.currTextElParentNode.onclick = this.initCanvasClick.bind(this)
    this.currTextElParentNode.style.position = 'relative'
}

TextInput.prototype.chooseColorIsShowControl = function (isShow){
    console.log('+++chooseColorIsShowControl, isShow: ', isShow)
    this.currTextColorChoosePanelIsShow = isShow
    this.currTextColorChoosePanel.style.display = isShow == true ? 'flex' : 'none'
}

TextInput.prototype.initCanvasClick = function (element) {
    const {offsetX, offsetY, target} = element
    let offsetLeft = offsetX,
        offsetTop = offsetY,
        offsetRight = target.clientWidth - offsetX,
        offsetBottom = target.clientHeight - offsetY;
    
    let isPermit = this._checkBlindZone(offsetLeft, offsetTop, offsetRight, offsetBottom)
    if(!this.currTextIsEdit && isPermit){
        console.log(`+++currTextElParentNode click, x: ${offsetLeft}, y: ${offsetTop}`)
        // 超出边界限制
        // if(offsetX + 250 > this.currTextElParentNode.offsetWidth || offsetTop + 20 > this.currTextElParentNode.offsetHeight){
        //     return
        // }
        this.setToolBarPos(offsetLeft, offsetTop, offsetRight, offsetBottom)
        this.prepareToEdit(offsetLeft, offsetTop, offsetRight, offsetBottom)
        this._setToolBarDisplay(true)
        this.currTextIsEdit = true
    }
}

TextInput.prototype._checkTextIsEmpty = function() {
    let isEmpty = false
    let currText = this.currTextInputMap.get(this.currTextInputElBind)
    if(currText.innerText === ''){
        isEmpty = true
    }

    return isEmpty
}

TextInput.prototype._checkBlindZone = function(oftLeft, oftTop, oftRight,oftBottom) {
    if (oftLeft < 10 || oftTop < 10 || oftRight < 20 || oftBottom < 10) {
        console.log(`+++checkBlindZone invalid pos, oftLeft: ${oftLeft}, oftTop: ${oftTop}, oftRight: ${oftRight},oftBottom: ${oftBottom}`)
        return false
    }
    return true
}

// 点击完成
TextInput.prototype.inputConfirm = function (e) {
    console.log('e: ', e)
    if(e && e.cancelBubble != null){
        // 阻止事件冒泡
        e.cancelBubble = true
    }

    if(this._checkTextIsEmpty()){
        this.inputCancel()
        return
    }
    // 处理完成的文本
    this._setTextFinished()
    this._setToolBarDisplay(false)
    // 清除当前绑定的文本输入框
    this.currTextInputElBind = null
    // 将编辑状态置为false
    this.currTextIsEdit = false
    this.currTextFontSizeEl.value = this.currTextDefaultFontSize
}
TextInput.prototype.inputCancel = function (e) {
    console.log('e: ', e)
    if(e && e.cancelBubble != null){
        // 阻止事件冒泡
        e.cancelBubble = true
    }

    
    this.currTextElParentNode.removeChild(this.currTextInputMap.get(this.currTextInputElBind))
    this.currTextInputMap.delete(this.currTextInputElBind)
    this._setToolBarDisplay(false)
    // 清除当前绑定的文本输入框
    this.currTextInputElBind = null
    // 将编辑状态置为false
    this.currTextIsEdit = false
    this.currTextColorBtn.style.color = '#000000'
}