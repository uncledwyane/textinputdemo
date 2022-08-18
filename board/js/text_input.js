
const toolBarEl = document.getElementById('tool-bar')

// 父元素
const fontColorControlEl = document.getElementById('font-color-control')

let inputElClassList = null
let canvasBg = null
let boxWrapEl = null


// 装input
const textMap = new Map()
// 当前textInput
let currBindText = null
// 是否是编辑状态
let isEdit = false

let fontSize = 14;
let chooseColorIsShow = false;


function init(canvas, parentDom) {
    // 初始化颜色选择按钮
    addCallbackToColorBtn()
    chooseColorIsShowControl(false)
    canvas.onclick = initCanvasClick
    canvasBg = parentDom
    boxWrapEl = parentDom
}

function initCanvasClick(e) {
    if(!isEdit && isTextState){
        console.log(`+++canvasBg click, x: ${e.offsetX}, y: ${e.offsetY}`)
        // 超出边界限制
        if(e.offsetX + 250 > canvasBg.offsetWidth || e.offsetY + 20 > canvasBg.offsetHeight){
            return
        }
        setToolBarPos(e.offsetX, e.offsetY)
        prepareToEdit(e.offsetX, e.offsetY)
        setToolBarDisplay(true)
        isEdit = true
    }
}

// 初始化文本输入框
function prepareToEdit(x, y) {
    let randomId = Math.round(Math.random() * 10000000)
    // 改用span和contentEditable属性来设置，避免使用input导致宽度不能自增长的问题
    let newInputEl = document.createElement('span')
    // let newInputDelEl = document.createElement('i')
    newInputEl.contentEditable = true
    newInputEl.style.fontSize = fontSize + 'px'
    newInputEl.className = 'content-edit content-edit-active'
    newInputEl.setAttribute('textid', randomId)
    // newInputDelEl.className = 'content-edit-del'
    // newInputEl.appendChild(newInputDelEl)
    // 设置文本输入框位置
    setTextInputPos(newInputEl, x, y)
    // 将id和文本输入框绑定并保存到Map中
    textMap.set(randomId, newInputEl)
    currBindText = randomId
    // 将创建的文本框设置为当前绑定文本输入框，用于设置样式
    setCurrBindTextEl(randomId)
    // 聚焦到当前文本框
    newInputEl.focus()
}
// 点击完成
function inputConfirm() {
    // 处理完成的文本
    setTextFinished()
    setToolBarDisplay(false)
    // 清除当前绑定的文本输入框
    currBindText = null
    // 将编辑状态置为false
    isEdit = false
}
function inputCancel() {
    boxWrapEl.removeChild(textMap.get(currBindText))
    textMap.delete(currBindText)
    setToolBarDisplay(false)
    // 清除当前绑定的文本输入框
    currBindText = null
    // 将编辑状态置为false
    isEdit = false
}

// 设置工具条位置
function setToolBarPos(x, y) {
    console.log('setToolBarPos, x: ', x, ' ,y: ', y)
    toolBarEl.style.position = 'absolute'
    toolBarEl.style.left = (x + toolBarEl.offsetWidth) + 'px'
    toolBarEl.style.top = (y - toolBarEl.offsetHeight - 60) + 'px'
}
// 设置文本输入框位置
function setTextInputPos(element, x, y) {
    element.style.position = 'absolute'
    element.style.left = x + 'px'
    element.style.top = (y - 10) + 'px'
    boxWrapEl.appendChild(element)
}
// 工具条隐藏控制
function setToolBarDisplay(isDis) {
    toolBarEl.style.display = isDis === true ? 'flex' : 'none'
}
// 通过textId和工具条进行绑定，用于设置样式
function setCurrBindTextEl(textId) {
    let inputEl = textMap.get(textId)
    if(inputEl){
        inputElClassList = inputEl.style
    }
}
// 输入完成
function setTextFinished() {
    let inputEl = textMap.get(currBindText)
    inputEl.classList.remove('content-edit-active')
    inputEl.contentEditable = false
    inputEl.style.pointerEvents = 'none'

    inputEl.onmouseover = e => {
        if(isEraser){
            const textId = e.target.getAttribute('textid')
            let el = textMap.get(parseInt(textId))
            boxWrapEl.removeChild(el)
            textMap.delete(parseInt(textId))
        }
        console.log('newInputEl.onmouseover e: ', e.target.getAttribute('textid'))
    }
}

function enableTextMouseEvent() {
    if(textMap.size > 0){
        textMap.forEach((value, key, map) => {
            value.style.pointerEvents = 'auto'
        })
    }
}

function disableTextMouseEvent() {
    if(textMap.size > 0){
        textMap.forEach((value, key, map) => {
            value.style.pointerEvents = 'none'
        })
    }
}





/**
 *  颜色选择的panel
 */
function addCallbackToColorBtn() {
    const colorBtns = document.querySelectorAll('.color-btn')
    colorBtns.forEach(colorBtn => {
        colorBtn.onclick = handleColorClick
    })
}

function handleColorClick(e){
    clearClassFromColorBtn()
    e.target.classList.add('color-btn-selected')
    inputElClassList.color = e.target.getAttribute('color')
    fontColorControlEl.style.color = e.target.getAttribute('color')
    chooseColorIsShowControl(false)
}

function clearClassFromColorBtn() {
    const colorBtns = document.querySelectorAll('.color-btn')
    colorBtns.forEach(colorBtn => {
        colorBtn.classList.remove('color-btn-selected')
    })
}

function chooseColorIsShowControl(isShow){
    const colorChoose = document.getElementsByClassName('color-choose')[0]
    chooseColorIsShow = isShow
    colorChoose.style.display = isShow == true ? 'flex' : 'none'
}



// 控制字体
// 加粗
const bold = () => {
    if(inputElClassList.fontWeight === 'bold'){
        inputElClassList.fontWeight = ''
    }else{
        inputElClassList.fontWeight = 'bold'
    }
}
// 斜体
const italic = (val) => {
    if(inputElClassList.fontStyle === 'italic'){
        inputElClassList.fontStyle = ''
    }else{
        inputElClassList.fontStyle = 'italic'
    }
}

// 改变字体颜色
const changeColor = () => {
    chooseColorIsShow ? chooseColorIsShowControl(false) : chooseColorIsShowControl(true)
}

// 字体大小
const changeFontSize = (e) => {
    console.log('e', e.value)
    if(e.value > 30 || e.value < 10){
        return
    }

    inputElClassList.fontSize = e.value + 'px'
}