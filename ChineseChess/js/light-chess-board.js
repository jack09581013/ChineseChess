class LightChessBoard extends AbstractChessBoard{

    //初始化明棋棋局
    init() {
        var chessBoard = this
        currentBoardSeletor = '#light-chess-board'

        $.get('LightChessBoard.cshtml', function (lightChessBoard) {
            $('#main-chess-board').html(lightChessBoard)
            chessBoard.initOnMove()

            //Setting position of black chesses
            chessBoard.setChess(new Chariot('black', 1), 0, 0)
            chessBoard.setChess(new Horse('black', 1), 1, 0)
            chessBoard.setChess(new Elephant('black', 1), 2, 0)
            chessBoard.setChess(new Advisor('black', 1), 3, 0)
            chessBoard.setChess(new General('black', 1), 4, 0)
            chessBoard.setChess(new Advisor('black', 2), 5, 0)
            chessBoard.setChess(new Elephant('black', 2), 6, 0)
            chessBoard.setChess(new Horse('black', 2), 7, 0)
            chessBoard.setChess(new Chariot('black', 2), 8, 0)

            chessBoard.setChess(new Cannon('black', 1), 1, 2)
            chessBoard.setChess(new Cannon('black', 2), 7, 2)

            chessBoard.setChess(new Soldier('black', 1), 0, 3)
            chessBoard.setChess(new Soldier('black', 2), 2, 3)
            chessBoard.setChess(new Soldier('black', 3), 4, 3)
            chessBoard.setChess(new Soldier('black', 4), 6, 3)
            chessBoard.setChess(new Soldier('black', 5), 8, 3)

            //Setting position of red chesses
            chessBoard.setChess(new Chariot('red', 1), 0, 9)
            chessBoard.setChess(new Horse('red', 1), 1, 9)
            chessBoard.setChess(new Elephant('red', 1), 2, 9)
            chessBoard.setChess(new Advisor('red', 1), 3, 9)
            chessBoard.setChess(new General('red', 1), 4, 9)
            chessBoard.setChess(new Advisor('red', 2), 5, 9)
            chessBoard.setChess(new Elephant('red', 2), 6, 9)
            chessBoard.setChess(new Horse('red', 2), 7, 9)
            chessBoard.setChess(new Chariot('red', 2), 8, 9)

            chessBoard.setChess(new Cannon('red', 1), 1, 7)
            chessBoard.setChess(new Cannon('red', 2), 7, 7)

            chessBoard.setChess(new Soldier('red', 1), 0, 6)
            chessBoard.setChess(new Soldier('red', 2), 2, 6)
            chessBoard.setChess(new Soldier('red', 3), 4, 6)
            chessBoard.setChess(new Soldier('red', 4), 6, 6)
            chessBoard.setChess(new Soldier('red', 5), 8, 6)

            $('#chess-board-image').click(function () {
                chessBoard.initOnMove()
            })
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

    getXPixel(xIndex) {
        return ((120 + xIndex * 235) * 800 / 2142 - 25) + 'px'
    }

    getYPixel(yIndex) {
        return ((105 + yIndex * 245) * 800 / 2400 - 25) + 'px'
    }

    getXMax() { return 8}
    getYMax() { return 9}

    checkMoveWin() {
        var redGeneral = this.getChessByClass('chess red general 1')
        var blackGeneral = this.getChessByClass('chess black general 1')

        if (redGeneral == undefined || blackGeneral == undefined)
            return

        var generalLook = true
        for (var y = blackGeneral.y + 1; y <= 9; ++y)
            if (this.board[blackGeneral.x][y] != undefined) {
                if (this.board[blackGeneral.x][y] != redGeneral)
                    generalLook = false
                break
            }

        if (generalLook) {
            if (this.currentCamp == 'red') {
                $('#win-text').text('將軍對看，黑方獲勝')
                $('#win-text').css({ color: 'black' })
                $('.ui.modal').modal('show')
            }
            else {
                $('#win-text').text('將軍對看，紅方獲勝')
                $('#win-text').css({ color: 'red' })
                $('.ui.modal').modal('show')
            }
        }
    }

    checkKillWin(beKillChess) {
        //kill general than win
        if (beKillChess.selector.indexOf('general') != -1) {
            if (beKillChess.camp == 'red') {
                $('#win-text').text('黑方獲勝')
                $('#win-text').css({ color: 'black' })
                $('.ui.modal').modal('show')
            }
            else if (beKillChess.camp == 'black') {
                $('#win-text').text('紅方獲勝')
                $('#win-text').css({ color: 'red' })
                $('.ui.modal').modal('show')
            }
        }
    }
}

class LightChess extends Chess{
    constructor(camp, number, type) {
        super(camp, number, type)
    }

    //out-of-range, enemy, friendly, no-chess
    tryMove(x, y) {
        var board = this.chessBoard.board
        if (x < 0) return "out-of-range"
        if (x > this.chessBoard.getXMax()) return "out-of-range"
        if (y < 0) return "out-of-range"
        if (y > this.chessBoard.getYMax()) return "out-of-range"

        if (board[x][y] == undefined)
            return "no-chess"
        else if (this.camp == board[x][y].camp)
            return "friendly"
        else return "enemy"
    }

    getMovePositions() { } //abstract
}


class Chariot extends LightChess{
    constructor(camp, number){
        super(camp, number, 'chariot')
    }

    //Override
    getMovePositions(){
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess
            
        //find left movement
        for (var x = this.x-1; x >= 0; x--){
            result = this.tryMove(x, this.y)
            if (result == "no-chess")
                posList.move.push([x, this.y])
            else if(result == "enemy"){
                posList.kill.push([x, this.y])
                break
            }
            else break
        }

        //find right movement
        for (var x = this.x+1; x <= 8; x++){
            result = this.tryMove(x, this.y)
            if (result == "no-chess")
                posList.move.push([x, this.y])
            else if(result == "enemy"){
                posList.kill.push([x, this.y])
                break
            }
            else break
        }

        //find top movement
        for (var y = this.y - 1; y >= 0; y--){
            result = this.tryMove(this.x, y)
            if (result == "no-chess")
                posList.move.push([this.x, y])
            else if(result == "enemy"){
                posList.kill.push([this.x, y])
                break
            }
            else break
        }                   

        //find bottom movement
        for (var y = this.y + 1; y <= 9; y++){
            result = this.tryMove(this.x, y)
            if (result == "no-chess")
                posList.move.push([this.x, y])
            else if(result == "enemy"){
                posList.kill.push([this.x, y])
                break
            }
            else break
        }
        return posList
    }
}

class Horse extends LightChess{
    constructor(camp, number){
        super(camp, number, 'horse')
    }

    //Override
    getMovePositions(){
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess
        var tryMoveList = [[this.x - 1, this.y - 2, this.x, this.y - 1],
                           [this.x + 1, this.y - 2, this.x, this.y - 1],
                           [this.x + 2, this.y - 1, this.x + 1, this.y],
                           [this.x + 2, this.y + 1, this.x + 1, this.y],
                           [this.x + 1, this.y + 2, this.x, this.y + 1],
                           [this.x - 1, this.y + 2, this.x, this.y + 1],
                           [this.x - 2, this.y + 1, this.x - 1, this.y],
                           [this.x - 2, this.y + -1, this.x - 1, this.y]]

        for(var i=0; i<tryMoveList.length; ++i){
            var x = tryMoveList[i][0]
            var y = tryMoveList[i][1]
            var blockX = tryMoveList[i][2]
            var blockY = tryMoveList[i][3]

            result = this.tryMove(blockX, blockY)
            if (result == "no-chess") {
                result = this.tryMove(x, y)
                if (result == "no-chess")
                    posList.move.push([x, y])
                else if (result == "enemy")
                    posList.kill.push([x, y])
            }                
        }

        return posList
    }
}

class Elephant extends LightChess {
    constructor(camp, number){
        super(camp, number, 'elephant')
    }

    //Override
    getMovePositions(){
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess
        var tryMoveList = [[this.x - 2, this.y - 2, this.x - 1, this.y - 1],
                           [this.x + 2, this.y - 2, this.x + 1, this.y - 1],
                           [this.x + 2, this.y + 2, this.x + 1, this.y + 1],
                           [this.x - 2, this.y + 2, this.x - 1, this.y + 1]]

        for (var i = 0; i < tryMoveList.length; ++i) {
            var x = tryMoveList[i][0]
            var y = tryMoveList[i][1]

            if (this.camp == 'red' && y <= 4) continue
            else if (this.camp == 'black' && y >= 5) continue

            var blockX = tryMoveList[i][2]
            var blockY = tryMoveList[i][3]

            result = this.tryMove(blockX, blockY)
            if (result == "no-chess") {
                result = this.tryMove(x, y)
                if (result == "no-chess")
                    posList.move.push([x, y])
                else if (result == "enemy")
                    posList.kill.push([x, y])
            }
        }

        return posList    
    }
}

class Advisor extends LightChess {
    constructor(camp, number){
        super(camp, number, 'advisor')
    }

    //Override
    getMovePositions(){
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess
        var tryMoveList = [[this.x - 1, this.y - 1],
                           [this.x + 1, this.y - 1],
                           [this.x - 1, this.y + 1],
                           [this.x + 1, this.y + 1]]

        for (var i = 0; i < tryMoveList.length; ++i) {                
            var validRange = false
            var x = tryMoveList[i][0]
            var y = tryMoveList[i][1]

            if (this.camp == 'black' && x >= 3 && x <= 5 && y >= 0 && y <= 2) validRange = true
            else if (this.camp == 'red' && x >= 3 && x <= 5 && y >= 7 && y <= 9) validRange = true

            if (validRange) {
                result = this.tryMove(x, y)
                if (result == "no-chess")
                    posList.move.push([x, y])
                else if (result == "enemy")
                    posList.kill.push([x, y])                    
            }        
        }
        return posList
    }
}

class General_Descard extends LightChess {
    constructor(camp, number){
        super(camp, number, 'general')
    }

    //Override
    getMovePositions(){
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess
        var tryMoveList = [[this.x - 1, this.y],
                           [this.x + 1, this.y],
                           [this.x, this.y - 1],
                           [this.x, this.y + 1]]

        for (var i = 0; i < tryMoveList.length; ++i) {
            var validRange = false
            var onEnemyGeneralLine = false
            var x = tryMoveList[i][0]
            var y = tryMoveList[i][1]

            if (this.camp == 'black') {
                if(x >= 3 && x <= 5 && y >= 0 && y <= 2)
                    validRange = true

                var board = this.chessBoard.board
                for (var downY = y; downY <= 9; ++downY) {
                    result = this.tryMove(x, downY)
                    if (result == "friendly") break
                    else if (result == "enemy") {
                        if (board[x][downY].selector == ".chess.red.general.1")
                            onEnemyGeneralLine = true
                        else break
                    }                       
                }
            }
            else if (this.camp == 'red') {
                if (x >= 3 && x <= 5 && y >= 7 && y <= 9)
                    validRange = true

                var board = this.chessBoard.board
                for (var upY = this.y; upY >= 0; --upY) {
                    result = this.tryMove(x, upY)
                    if (result == "friendly") break
                    else if (result == "enemy") {
                        if (board[x][upY].selector == ".chess.black.general.1")
                            onEnemyGeneralLine = true
                        else break
                    }
                }
            }

            if (validRange && !onEnemyGeneralLine) {
                result = this.tryMove(x, y)
                if (result == "no-chess")
                    posList.move.push([x, y])
                else if (result == "enemy")
                    posList.kill.push([x, y])
            }
        }
        return posList
    }
}

class General extends LightChess {
    constructor(camp, number){
        super(camp, number, 'general')
    }

    //Override
    getMovePositions(){
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
            var result = this.tryMove(x, y) //out-of-range, enemy, friendly, no-chess

            if (result == "no-chess")
                posList.move.push([x, y])
            else if (result == "enemy")
                posList.kill.push([x, y])           
        }
        return posList
    }
}

class Cannon extends LightChess {
    constructor(camp, number){
        super(camp, number, 'cannon')
    }

    //Override
    getMovePositions() {
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess
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
                else break //out-of-range, friendly
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
                else break //out-of-range, friendly
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
        for (var y = this.y + 1; y <= this.chessBoard.getYMax(); y++) {
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
                else break //out-of-range, friendly
            }
        }
        return posList
    }
}

class Soldier extends LightChess {
    constructor(camp, number){
        super(camp, number, 'soldier')
    }

    //Override
    getMovePositions(){
        var posList = {
            move: [],
            kill: []
        }
        var result //out-of-range, enemy, friendly, no-chess

        if (this.camp == 'red') { //往上走

            result = this.tryMove(this.x, this.y - 1)
            if(result == "no-chess")posList.move.push([this.x, this.y - 1])
            else if(result == "enemy")posList.kill.push([this.x, this.y - 1])
                    
            if (this.y <= 4) { //過楚河漢界

                result = this.tryMove(this.x - 1, this.y) //turn left
                if (result == "no-chess") posList.move.push([this.x-1, this.y])
                else if (result == "enemy") posList.kill.push([this.x-1, this.y])

                result = this.tryMove(this.x + 1, this.y) //turn right
                if (result == "no-chess") posList.move.push([this.x + 1, this.y])
                else if (result == "enemy") posList.kill.push([this.x + 1, this.y])
                                 
            }               
        }
        else if (this.camp == 'black') { //往下走

            result = this.tryMove(this.x, this.y + 1)
            if (result == "no-chess") posList.move.push([this.x, this.y + 1])
            else if (result == "enemy") posList.kill.push([this.x, this.y + 1])

            if (this.y >= 5) { //過楚河漢界

                result = this.tryMove(this.x - 1, this.y) //turn left
                if (result == "no-chess") posList.move.push([this.x - 1, this.y])
                else if (result == "enemy") posList.kill.push([this.x - 1, this.y])

                result = this.tryMove(this.x + 1, this.y) //turn right
                if (result == "no-chess") posList.move.push([this.x + 1, this.y])
                else if (result == "enemy") posList.kill.push([this.x + 1, this.y])

            }
        }
        return posList
    }
}