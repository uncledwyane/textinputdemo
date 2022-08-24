let textObj = {}
let app = document.getElementById('app')


// 白板文字输入的相关属性
textObj.currTextElStyleList = null; // 当前编辑的文字的style
textObj.currTextElParentNode = null; // 放置文字的父元素
textObj.currTextInputMap = new Map(); // 放置当前页面所有文字元素的map（key: 文字元素id， value: 文字元素）
textObj.currTextInputElBind = null; // 当前正在编辑的文字
textObj.currTextIsEdit = false; // 当前是否为编辑状态
textObj.currTextDefaultFontSize = 14; // 默认文字大小
textObj.currTextColorChoosePanel = null;
textObj.currTextFontSizeEl = null;
textObj.currTextColorBtn = null;
textObj.currTextColorChoosePanelIsShow = false; // 文字的颜色选择面板是否显示

textObj.currTextToolBarEl = null;

function init(parentEl) {
    // 初始化颜色选择按钮
    chooseColorIsShowControl(false)
    parentEl.onclick = initCanvasClick
    parentEl.style.position = 'relative'
    textObj.currTextElParentNode = parentEl
}

function initCanvasClick(e) {
    console.log(e)
    if(!textObj.currTextIsEdit){
        console.log(`+++currTextElParentNode click, x: ${e.offsetX}, y: ${e.offsetY}`)
        // 超出边界限制
        if(e.offsetX + 250 > textObj.currTextElParentNode.offsetWidth || e.offsetY + 20 > textObj.currTextElParentNode.offsetHeight){
            return
        }
        setToolBarPos(e.offsetX, e.offsetY)
        prepareToEdit(e.offsetX, e.offsetY)
        setToolBarDisplay(true)
        textObj.currTextIsEdit = true
    }
}

// 初始化文本输入框
function prepareToEdit(x, y) {
    let RandomId = Math.round(Math.random() * 10000000)
    // 改用span和contentEditable属性来设置，避免使用input导致宽度不能自增长的问题
    let newInputEl = document.createElement('span')
    textObj.currTextInputElBind = RandomId

    newInputEl.contentEditable = true
    newInputEl.style.fontSize = textObj.currTextDefaultFontSize + 'px'
    newInputEl.style.display = 'flex';
    newInputEl.style.borderRadius = '5px';
    newInputEl.style.padding = '5px 10px';
    newInputEl.style.background = 'rgba(0,0,0,0';
    newInputEl.style.outline = 'orange dotted 2px';
    newInputEl.style.position = 'absolute';

    // 设置文本输入框位置
    setTextInputPos(newInputEl, x, y)
    // 将id和文本输入框绑定并保存到Map中
    textObj.currTextInputMap.set(RandomId, newInputEl)
    // 将创建的文本框设置为当前绑定文本输入框
    setCurrBindTextEl(RandomId)
    // 聚焦到当前文本框
    newInputEl.focus()
}
function checkTextIsEmpty() {
    let isEmpty = false
    let currText = textObj.currTextInputMap.get(textObj.currTextInputElBind)
    if(currText.innerText === ''){
        isEmpty = true
    }

    return isEmpty
}
// 点击完成
function inputConfirm(e) {
    // 阻止事件冒泡
    e.cancelBubble = true

    if(checkTextIsEmpty()){
        inputCancel()
        return
    }
    // 处理完成的文本
    setTextFinished()
    setToolBarDisplay(false)
    // 清除当前绑定的文本输入框
    textObj.currTextInputElBind = null
    // 将编辑状态置为false
    textObj.currTextIsEdit = false
    textObj.currTextFontSizeEl.value = textObj.currTextDefaultFontSize
}
function inputCancel(e) {
    // 阻止事件冒泡
    e.cancelBubble = true
    
    textObj.currTextElParentNode.removeChild(textObj.currTextInputMap.get(textObj.currTextInputElBind))
    textObj.currTextInputMap.delete(textObj.currTextInputElBind)
    setToolBarDisplay(false)
    // 清除当前绑定的文本输入框
    textObj.currTextInputElBind = null
    // 将编辑状态置为false
    textObj.currTextIsEdit = false
    textObj.currTextColorBtn.style.color = '#000000'
}

// 设置工具条位置
function setToolBarPos(x, y) {
    textObj.currTextToolBarEl.style.position = 'absolute'
    textObj.currTextToolBarEl.style.left = (x + textObj.currTextToolBarEl.offsetWidth) + 'px'
    textObj.currTextToolBarEl.style.top = (y - textObj.currTextToolBarEl.offsetHeight - 60) + 'px'
}
// 设置文本输入框位置
function setTextInputPos(toolbar, x, y) {
    toolbar.style.left = x + 'px'
    toolbar.style.top = (y - 10) + 'px'
    textObj.currTextElParentNode.appendChild(toolbar)
}
// 工具条隐藏控制
function setToolBarDisplay(isDis) {
    textObj.currTextToolBarEl.style.display = isDis === true ? 'flex' : 'none'
}
// 通过textId和工具条进行绑定，用于设置样式
function setCurrBindTextEl(textId) {
    let inputEl = textObj.currTextInputMap.get(textId)
    if(inputEl){
        textObj.currTextElStyleList = inputEl.style
    }
}

// 输入完成
function setTextFinished() {
    let inputEl = textObj.currTextInputMap.get(textObj.currTextInputElBind)
    inputEl.style.outline = 'none'
    inputEl.contentEditable = false
    textObj.currTextColorBtn.style.color = '#000000'
}



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

var _setColorBtnStyle = function(el, bgColor) {
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

    textObj.currTextColorChoosePanel.appendChild(el)

    el.onclick = handleColorClick
}

var _setClickEventToParent = function(parentEl) {
    parentEl.onclick = function() {
        
    }
}

var _initToolBar = function(parentEl) {
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

    textObj.currTextToolBarEl = toolBarEl

    let fontBoldEl = _DCE('span');
    fontBoldEl.style.fontWeight = 'bold';
    _setFontConrolStyle(fontBoldEl)
    fontBoldEl.innerText = 'B';
    fontBoldEl.onclick = bold

    let fontItalicEl = _DCE('span');
    fontItalicEl.style.fontStyle = 'italic';
    _setFontConrolStyle(fontItalicEl)
    fontItalicEl.innerText = 'I';
    fontItalicEl.onclick = italic

    let fontColorEl = _DCE('span');
    _setFontConrolStyle(fontColorEl)
    fontColorEl.innerText = 'T';
    fontColorEl.onclick = changeColor
    textObj.currTextColorBtn = fontColorEl

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
    textObj.currTextColorChoosePanel = fontColorChoosePanel;
    

    let fontColorChoose1 = _DCE('span');
    _setColorBtnStyle(fontColorChoose1, '#e02020');

    let fontColorChoose2 = _DCE('span');
    _setColorBtnStyle(fontColorChoose2, '#fa6400');
    
    let fontColorChoose3 = _DCE('span');
    _setColorBtnStyle(fontColorChoose3, '#f7b500');
    
    let fontColorChoose4 = _DCE('span');
    _setColorBtnStyle(fontColorChoose4, '#6dd400');
    
    let fontColorChoose5 = _DCE('span');
    _setColorBtnStyle(fontColorChoose5, '#44d7b6');
    
    let fontColorChoose6 = _DCE('span');
    _setColorBtnStyle(fontColorChoose6, '#32c5ff');
    
    let fontColorChoose7 = _DCE('span');
    _setColorBtnStyle(fontColorChoose7, '#0091ff');
    
    let fontColorChoose8 = _DCE('span');
    _setColorBtnStyle(fontColorChoose8, '#6236ff');
    
    let fontColorChoose9 = _DCE('span');
    _setColorBtnStyle(fontColorChoose9, '#b620e0');
    
    let fontColorChoose10 = _DCE('span');
    _setColorBtnStyle(fontColorChoose10, '#6d7278');
    
    let fontColorChoose11 = _DCE('span');
    _setColorBtnStyle(fontColorChoose11, '#000000');
    
    let fontColorChoose12 = _DCE('span');
    _setColorBtnStyle(fontColorChoose12, '#ffffff');

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
    fontSizeEl.onchange = changeFontSize
    textObj.currTextFontSizeEl = fontSizeEl

    let confirmBtn = _DCE('span');
    _setFontConrolStyle(confirmBtn)
    _setBtnStyle(confirmBtn, 'confirm')
    confirmBtn.innerText = '确认'
    confirmBtn.style.background = '#2c79bbd4'
    confirmBtn.onclick = inputConfirm

    let cancelBtn = _DCE('span');
    _setFontConrolStyle(cancelBtn)
    _setBtnStyle(cancelBtn, 'cancel')
    cancelBtn.innerText = '取消'
    cancelBtn.style.background = 'rgba(44, 187, 99, 0.507)'
    cancelBtn.onclick = inputCancel

    textObj.currTextToolBarEl.appendChild(fontBoldEl)
    textObj.currTextToolBarEl.appendChild(fontItalicEl)
    textObj.currTextToolBarEl.appendChild(fontColorEl)
    textObj.currTextToolBarEl.appendChild(fontColorChoosePanel)
    textObj.currTextToolBarEl.appendChild(fontSizeEl)
    textObj.currTextToolBarEl.appendChild(confirmBtn)
    textObj.currTextToolBarEl.appendChild(cancelBtn)

    parentEl.appendChild(textObj.currTextToolBarEl)

}


_initToolBar(app)
init(app)





/**
 *  颜色选择的panel
 */
function handleColorClick(e){
    clearClassFromColorBtn()
    e.target.classList.add('color-btn-selected')
    textObj.currTextElStyleList.color = e.target.getAttribute('color')
    textObj.currTextColorBtn.style.color = e.target.getAttribute('color')
    chooseColorIsShowControl(false)
}

function clearClassFromColorBtn() {
    const colorBtns = document.querySelectorAll('.color-btn')
    colorBtns.forEach(colorBtn => {
        colorBtn.classList.remove('color-btn-selected')
    })
}

function chooseColorIsShowControl(isShow){
    textObj.currTextColorChoosePanelIsShow = isShow
    textObj.currTextColorChoosePanel.style.display = isShow == true ? 'flex' : 'none'
}



// 控制字体
// 加粗
function bold(){
    if(textObj.currTextElStyleList.fontWeight === 'bold'){
        textObj.currTextElStyleList.fontWeight = ''
    }else{
        textObj.currTextElStyleList.fontWeight = 'bold'
    }
}
// 斜体
function italic(val){
    if(textObj.currTextElStyleList.fontStyle === 'italic'){
        textObj.currTextElStyleList.fontStyle = ''
    }else{
        textObj.currTextElStyleList.fontStyle = 'italic'
    }
}

// 改变字体颜色
function changeColor() {
    textObj.currTextColorChoosePanelIsShow ? chooseColorIsShowControl(false) : chooseColorIsShowControl(true)
}

// 字体大小
function changeFontSize(e) {
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

    textObj.currTextElStyleList.fontSize = parseInt(value) + 'px'
}