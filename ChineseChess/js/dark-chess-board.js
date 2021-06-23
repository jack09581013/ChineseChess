class DarkChess extends Chess {
    constructor(camp, number, type, priority) {
        super(camp, number, type)
        this.priority = priority //1~7
    }

    //out-of-range, enemy, friendly, no-chess, unknown
    tryMove(x, y) {
        var board = this.chessBoard.board
        if (x < 0) return "out-of-range"
        if (x > this.chessBoard.getXMax()) return "out-of-range"
        if (y < 0) return "out-of-range"
        if (y > this.chessBoard.getYMax()) return "out-of-range"

        if (board[x][y] == undefined)
            return "no-chess"
        else if (this.chessBoard.isUnknown(x, y))
            return 'unknown'
        else if (this.camp == board[x][y].camp)
            return "friendly"        
        else return 'enemy'
    }

    getMovePositions() {
        var posList = {
            move: [],
            kill: []
        }
        var tryMoveList = [[this.x - 1, this.y],
                           [this.x + 1, this.y],
                           [this.x, this.y - 1],
                           [this.x, this.y + 1]]
        var board = this.chessBoard.board

        for (var i = 0; i < tryMoveList.length; ++i) {
            var x = tryMoveList[i][0]
            var y = tryMoveList[i][1]
            var result = this.tryMove(x, y) //out-of-range, enemy, friendly, no-chess, unknown

            if (result == "no-chess")
                posList.move.push([x, y])

            else if (result == "enemy") {
                var enemyPriority = board[x][y].priority
                switch(this.priority){
                    case 7: //general
                        if (enemyPriority != 1 && enemyPriority <= this.priority)
                            posList.kill.push([x, y])
                        break
                    case 2: //cannon
                        throw "Cannon cannot use this movement algorithm"
                        break

                    case 1: //soldier
                        if (enemyPriority == 7 || enemyPriority == 1)
                            posList.kill.push([x, y])
                        break
                    default: //others
                        if (enemyPriority <= this.priority)
                            posList.kill.push([x, y])
                        break
                }
            }     
        }
        return posList
    }
}

class DarkCannonChess extends DarkChess{
    constructor(camp, number) {
        super(camp, number, 'cannon', 2)
    }

    //Override
    getMovePositions() {
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess, unknown
        var meetChess

        //find left movement
        meetChess = false
        for (var x = this.x - 1; x >= 0; x--) {
            result = this.tryMove(x, this.y)
            if (result == "no-chess") {
                if (!meetChess)
                    posList.move.push([x, this.y])
            }
            else {
                if (!meetChess) {
                    meetChess = true
                    continue
                }
                else if (result == "enemy") {
                    posList.kill.push([x, this.y])
                    break
                }
                else break //out-of-range, friendly, unknown
            }
        }

        //find right movement
        meetChess = false
        for (var x = this.x + 1; x <= this.chessBoard.getXMax() ; x++) {
            result = this.tryMove(x, this.y)
            if (result == "no-chess") {
                if (!meetChess)
                    posList.move.push([x, this.y])
            }
            else {
                if (!meetChess) {
                    meetChess = true
                    continue
                }
                else if (result == "enemy") {
                    posList.kill.push([x, this.y])
                    break
                }
                else break //out-of-range, friendly, unknown
            }
        }

        //find top movement
        meetChess = false
        for (var y = this.y - 1; y >= 0; y--) {
            result = this.tryMove(this.x, y)
            if (result == "no-chess") {
                if (!meetChess)
                    posList.move.push([this.x, y])
            }
            else {
                if (!meetChess) {
                    meetChess = true
                    continue
                }
                else if (result == "enemy") {
                    posList.kill.push([this.x, y])
                    break
                }
                else break
            }
        }

        //find bottom movement
        meetChess = false
        for (var y = this.y + 1; y <= this.chessBoard.getYMax() ; y++) {
            result = this.tryMove(this.x, y)
            if (result == "no-chess") {
                if (!meetChess)
                    posList.move.push([this.x, y])
            }
            else {
                if (!meetChess) {
                    meetChess = true
                    continue
                }
                else if (result == "enemy") {
                    posList.kill.push([this.x, y])
                    break
                }
                else break //out-of-range, friendly, unknown
            }
        }
        return posList
    }
}

class DarkChessBoard extends AbstractChessBoard {
    constructor() {
        super()
        this.unknownList = []
    }

    getXPixel(xIndex) {
        return ((240 + xIndex * 235) * 800 / 2142 - 25) + 'px'
    }

    getYPixel(yIndex) {
        return ((205 + yIndex * 232) * 400 / 1106 - 25) + 'px'
    }

    getXMax() { return 7 }
    getYMax() { return 3 }

    isUnknown(x, y) {
        var list = this.unknownList
        for(var i=0; i<list.length; ++i)
            if(list[i].x == x && list[i].y == y)
                return true
        return false
    }

    deleteUnknown(unknown) {
        var x = unknown.x
        var y = unknown.y
        var list = this.unknownList
        var beDel = false

        for(var i=0; i<list.length; ++i)
            if (list[i].x == x && list[i].y == y) {
                list.splice(i, 1) //delete element
                beDel = true
            }

        if (!beDel)
            throw 'Cannont delete unknown on x = ' + x + ', y = ' + y
    }

    getUnknownByClass(className) {
        var selector = getClassSelector(className)
        var list = this.unknownList

        for (var i = 0; i < list.length; ++i)
            if (list[i].selector == selector)
                return list[i]
        return undefined
    }


    init() {
        var chessBoard = this
        currentBoardSeletor = '#dark-chess-board'

        $.get('DarkChessBoard.cshtml', function (darkChessBoard) {
            $('#main-chess-board').html(darkChessBoard)
            $('.chess').hide()
            var chessList = [new DarkChess('black', 1, 'chariot', 4),
                            new DarkChess('black', 2, 'chariot', 4),
                            new DarkChess('black', 1, 'horse', 3),
                            new DarkChess('black', 2, 'horse', 3),
                            new DarkCannonChess('black', 1),
                            new DarkCannonChess('black', 2),
                            new DarkChess('black', 1, 'elephant', 5),
                            new DarkChess('black', 2, 'elephant', 5),
                            new DarkChess('black', 1, 'advisor', 6),
                            new DarkChess('black', 2, 'advisor', 6),
                            new DarkChess('black', 1, 'general', 7),
                            new DarkChess('black', 1, 'soldier', 1),
                            new DarkChess('black', 2, 'soldier', 1),
                            new DarkChess('black', 3, 'soldier', 1),
                            new DarkChess('black', 4, 'soldier', 1),
                            new DarkChess('black', 5, 'soldier', 1),

                            new DarkChess('red', 1, 'chariot', 4),
                            new DarkChess('red', 2, 'chariot', 4),
                            new DarkChess('red', 1, 'horse', 3),
                            new DarkChess('red', 2, 'horse', 3),
                            new DarkCannonChess('red', 1),
                            new DarkCannonChess('red', 2),
                            new DarkChess('red', 1, 'elephant', 5),
                            new DarkChess('red', 2, 'elephant', 5),
                            new DarkChess('red', 1, 'advisor', 6),
                            new DarkChess('red', 2, 'advisor', 6),
                            new DarkChess('red', 1, 'general', 7),
                            new DarkChess('red', 1, 'soldier', 1),
                            new DarkChess('red', 2, 'soldier', 1),
                            new DarkChess('red', 3, 'soldier', 1),
                            new DarkChess('red', 4, 'soldier', 1),
                            new DarkChess('red', 5, 'soldier', 1)]

            for (var x = 0; x <= chessBoard.getXMax() ; ++x)
                for (var y = 0; y <= chessBoard.getYMax() ; ++y) {
                    chessBoard.addUnknown(x, y)
                    chessBoard.setChess(chessList[x * 4 + y], x, y)
                }

            //洗盤
            for (var i = 0; i < 500 ; ++i) {
                var x = rand(0, 7)
                var y = rand(0, 3)
    
                var temp = chessBoard.board[0][0]
                chessBoard.setChess(chessBoard.board[x][y], 0, 0)
                chessBoard.setChess(temp, x, y)
            }

            $('.unknown').mouseenter(
                function () {
                    $(this).css({ filter: 'drop-shadow(0px 0px 10px red)' })
                }).mouseleave(function () {
                    $(this).css({ filter: 'none' })
                })

            //翻牌Event
            $('.unknown').dblclick(function () {
                var unknown = chessBoard.getUnknownByClass($(this).attr('class'))
                var chess = chessBoard.getChess(unknown.x, unknown.y)
                $(chess.selector).show()
                $(unknown.selector).remove()
                chessBoard.deleteUnknown(unknown)
                chessBoard.changeCamp()
                chessBoard.initOnMove()
            })

            $('#chess-board-image').click(function () {
                chessBoard.initOnMove()
            })
            chessBoard.initOnMove()

        })

        $.get('RedWindow.cshtml', function (redWindow) {
            $('#main-red-window').html(redWindow)
            setRed(true)
            startRed()
        })

        $.get('BlackWindow.cshtml', function (blackWindow) {
            $('#main-black-window').html(blackWindow)
            setBlack(false)
        })

        $('#camp-turn-text').text('輪到紅方下棋')
    }

    addUnknown(x, y) {
        var chessBoard = this
        var unknown = new Unknown()
        this.unknownList.push(unknown)
        unknown.x = x
        unknown.y = y
        unknown.chessBoard = this
        this.setXY(unknown)
    }

    checkKillWin() {
        var board = this.board
        var noRedChess = true
        var noBlackChess = true

        for(var x = 0; x <= this.getXMax(); ++x)
            for (var y = 0; y <= this.getYMax() ; ++y) {
                if (board[x][y] == undefined)
                    continue

                if(board[x][y].camp == 'red')
                    noRedChess = false
                if (board[x][y].camp == 'black')
                    noBlackChess = false
            }

        if (noRedChess) {
            $('#win-text').text('紅棋全數陣亡，黑方獲勝')
            $('#win-text').css({ color: 'black' })
            $('.ui.modal').modal('show')
        }

        if (noBlackChess) {
            $('#win-text').text('黑棋全數陣亡，紅方獲勝')
            $('#win-text').css({ color: 'red' })
            $('.ui.modal').modal('show')
        }
    }
}