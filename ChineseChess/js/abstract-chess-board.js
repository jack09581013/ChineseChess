var currentBoardSeletor

class Item {
    constructor(selector) {
        this.selector = selector //Selector is multi-classes
        this.x = null
        this.y = null
        this.chessBoard = null
    }
}

class MoveBlock extends Item {
    constructor() {
        super('.move-block.' + MoveBlock.no)
        $(currentBoardSeletor).append('<div class="move-block ' + MoveBlock.no + '"><div/>')
        MoveBlock.no++
    }
}
MoveBlock.no = 0 //Static variable

class Target extends Item {
    constructor() {
        super('.target.' + Target.no)
        $(currentBoardSeletor).append('<img class="target ' + Target.no + '" src="/image/Chesses/Target.png"/>')
        Target.no++
    }
}
Target.no = 0 //Static variable

class Unknown extends Item {
    constructor() {
        super('.unknown.' + Unknown.no)
        $(currentBoardSeletor).append('<img class="unknown ' + Unknown.no + '" src="/image/Chesses/UnknownChess.png"/>')
        Unknown.no++
    }
}
Unknown.no = 0 //Static variable

//Abstract chess
class Chess extends Item {
    constructor(camp, number, type) {
        super('.chess.' + camp + '.' + type + '.' + number)
        this.camp = camp
        this.number = number
    }

    tryMove() { } //Abstract
    getMovePositions() { } //Abstract
}

class AbstractChessBoard {
    constructor() {
        this.board = this.createBoard()
        this.targetList = []
        this.moveBlockList = []
        this.currentCamp = 'red'        
    }

    init() { } //Abstract
    getXPixel(xIndex) { } //Abstract
    getYPixel(yIndex) { } //Abstract
    getXMax() { } //Abstract
    getYMax() { } //Abstract

    createBoard() {
        var board = []
        for (var i = 0; i <= this.getXMax(); ++i) { //x-axis
            var column = []
            for (var j = 0; j <= this.getYMax(); ++j) //y-axis
                column[j] = undefined
            board[i] = column
        }
        return board
    }

    getChess(x, y) {
        return this.board[x][y]
    }

    getChessByClass(className) {
        var board = this.board
        var selector = getClassSelector(className)

        for (var i = 0; i < board.length; ++i)
            for (var j = 0; j < board[i].length; ++j)
                if (board[i][j] != undefined && board[i][j].selector == selector)
                    return board[i][j]
        return undefined
    }

    getMoveBlockByClass(className) {
        var selector = getClassSelector(className)
        var list = this.moveBlockList

        for (var i = 0; i < list.length; ++i)
            if (list[i].selector == selector)
                return list[i]
        return undefined
    }

    getTargetByClass(className) {
        var selector = getClassSelector(className)
        var list = this.targetList

        for (var i = 0; i < list.length; ++i)
            if (list[i].selector == selector)
                return list[i]
        return undefined
    }

    setXY(item) {
        var chessBoard = this
        $(item.selector).css({
            'left': chessBoard.getXPixel(item.x),
            'top': chessBoard.getYPixel(item.y)
        })
    }

    setChess(chess, x, y) {
        this.board[x][y] = chess
        chess.x = x
        chess.y = y
        chess.chessBoard = this
        this.setXY(chess)
    }

    addTarget(x, y) {
        var chessBoard = this
        var target = new Target()
        this.targetList.push(target)
        target.x = x
        target.y = y
        target.chessBoard = this

        this.setXY(target)
    }

    addMoveBlock(x, y) {
        var moveBlock = new MoveBlock()
        this.moveBlockList.push(moveBlock)
        moveBlock.x = x
        moveBlock.y = y
        moveBlock.chessBoard = this
        this.setXY(moveBlock)
    }

    //Move chess if no chess on board[x][y]
    moveChess(className, x, y) {
        var chess = this.getChessByClass(className)
        var originX = chess.x
        var originY = chess.y
        var board = this.board

        if (board[x][y] == undefined) {
            board[x][y] = board[originX][originY]
            board[x][y].x = x
            board[x][y].y = y
            board[originX][originY] = undefined

            this.setXY(board[x][y])
            this.checkMoveWin()
            this.changeCamp()
        }
        else throw "cannot move '" + className + "' to (" + x + "," + y + ")"
    }

    checkMoveWin() { } //Abstract

    //the board[x][y] will be kill, and then move "className" to that position
    killChess(className, x, y) {
        var board = this.board
        var beKillChess = board[x][y]

        if (beKillChess.camp == 'red')
            $(beKillChess.selector).clone().appendTo('#black-window').removeClass().addClass('dead-chess')
        else $(beKillChess.selector).clone().appendTo('#red-window').removeClass().addClass('dead-chess')

        $(beKillChess.selector).hide()
        board[x][y] = undefined
        this.moveChess(className, x, y)
        this.checkKillWin(beKillChess)
    }

    checkKillWin() { } //Abstract

    setOnMove(className) {
        
        var chess = this.getChessByClass(className)
        var posList = chess.getMovePositions()
        
        for (var i = 0; i < posList.move.length; ++i)
            this.addMoveBlock(posList.move[i][0], posList.move[i][1])

        for (var i = 0; i < posList.kill.length; ++i)
            this.addTarget(posList.kill[i][0], posList.kill[i][1])

        targetFlash()
        moveBlockFlash()
    }

    initOnMove() {
        var chessBoard = this
        $('.chess').css({ 'filter': 'none' }) //Clear chess select
        $('.chess').unbind()

        $('.chess.' + this.currentCamp).mouseenter(
            function () {
                $(this).css({ filter: 'drop-shadow(0px 0px 10px red)' })
            }).mouseleave(function () {
                $(this).css({ filter: 'none' })
            })

        $('.chess.' + this.currentCamp).click(function () {
            chessBoard.initOnMove()

            $(this).unbind('mouseleave mouseenter')
            $(this).css({ 'filter': 'drop-shadow(0px 0px 10px red)' })

            var className = $(this).attr('class')
            chessBoard.setOnMove(className)

            $('.move-block').click(function () {
                var moveBlock = chessBoard.getMoveBlockByClass($(this).attr('class'))

                chessBoard.moveChess(className, moveBlock.x, moveBlock.y)
                chessBoard.initOnMove()
            })

            $('.target').click(function () {
                var target = chessBoard.getTargetByClass($(this).attr('class'))
                chessBoard.killChess(className, target.x, target.y)
                chessBoard.initOnMove()
            })
        })

        $('.move-block').remove()
        $('.target').remove()
        MoveBlock.no = 0
        Target.no = 0
        this.targetList = []
        this.moveBlockList = []
    }

    //換對方移動棋子
    changeCamp() {
        if (this.currentCamp == 'red') {
            setRed(false)
            setBlack(true)
            startBlack()
            this.currentCamp = 'black'
            $('#camp-turn-text').text('輪到黑方下棋')
        }
        else if (this.currentCamp == 'black') {
            setRed(true)
            setBlack(false)
            startRed()
            this.currentCamp = 'red'
            $('#camp-turn-text').text('輪到紅方下棋')
        }
        else throw 'wrong camp name'
    }
}