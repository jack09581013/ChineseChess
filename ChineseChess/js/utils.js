//用來閃爍紅方區的區塊
var redFlag = true
function startRed() {
    if (!redFlag) {
        return
    }
    $('#red-window-title')
    .fadeTo('slow', 0.5)
    .fadeTo('slow', 1, startRed)
}

function setRed(flag) {
    redFlag = flag
}

//用來閃爍黑方區的區塊
var blackFlag = true
function startBlack() {
    if (!blackFlag) {
        return
    }
    $('#black-window-title')
    .fadeTo('slow', 0.5)
    .fadeTo('slow', 1, startBlack)
}

function setBlack(flag) {
    blackFlag = flag
}

function targetFlash() {
    $('.target')
    .delay('fast')
    .fadeOut('slow')
    .fadeIn('fast', targetFlash)
}

function moveBlockFlash() {
    $('.move-block')
    .delay('fast')
    .fadeTo('slow', 0.2)
    .fadeTo('fast', 0.5, moveBlockFlash)
}

function getClassSelector(className) {
    var tokens = className.split(' ')
    var selector = ''

    //Solving muti-space problem
    var temp = []
    for (var i = 0; i < tokens.length; ++i)
        if (tokens[i] != "")
            temp.push(tokens[i])
    tokens = temp

    //Conver class string to selector string
    for (var i = 0; i < tokens.length; ++i)
        selector += '.' + tokens[i]
    return selector
}

function isMoveBlock(item) {
    return item.selector.startsWith('.move-block')
}

function isTarget(item) {
    return item.selector.startsWith('.target')
}

function rand(min, max) {
    return Math.floor((Math.random() * (max + 1)) + min);
}