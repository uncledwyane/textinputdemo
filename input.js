
const toolBarEl = document.getElementById('tool-bar')
const boxWrapEl = document.getElementById('box-wrap')
const fontColorControlEl = document.getElementById('font-color-control')

let inputElClassList = null
let canvasBg = null


// 装input
const textMap = new Map()
// 当前textInput
let currBindText = null
// 是否是编辑状态
let isEdit = false

let fontSize = 14;
let chooseColorIsShow = false;


function init(canvas) {
    // 初始化颜色选择按钮
    addCallbackToColorBtn()
    chooseColorIsShowControl(false)
    canvas.onclick = initCanvasClick
    canvasBg = canvas
}

function initCanvasClick(e) {
    if(!isEdit){
        console.log(`+++canvasBg click, x: ${e.clientX}, y: ${e.clientY}`)
        // 超出边界限制
        if(e.clientX + 250 > canvasBg.offsetWidth || e.clientY + 20 > canvasBg.offsetHeight){
            return
        }
        setToolBarPos(e.clientX, e.clientY)
        prepareToEdit(e.clientX, e.clientY)
        setToolBarDisplay(true)
        isEdit = true
    }
}

// 初始化文本输入框
function prepareToEdit(x, y) {
    let RandomId = Math.round(Math.random() * 10000000)
    // 改用span和contentEditable属性来设置，避免使用input导致宽度不能自增长的问题
    let newInputEl = document.createElement('span')
    newInputEl.contentEditable = true
    newInputEl.style.fontSize = fontSize + 'px'
    newInputEl.className = 'content-edit content-edit-active'
    // 设置文本输入框位置
    setTextInputPos(newInputEl, x, y)
    // 将id和文本输入框绑定并保存到Map中
    textMap.set(RandomId, newInputEl)
    currBindText = RandomId
    // 将创建的文本框设置为当前绑定文本输入框
    setCurrBindTextEl(RandomId)
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