'use strict'
var TABLE_LENGTH = 0
var NUM_OF_BOMBS = 0
var GAME_LEVEL

var BOMB = '💣'
var NOT_BOMB = '✗'
var FLAG = '🚩'

var ONE_BOMB = '<span style="color:blue">1</span>'
var TWO_BOMB = '<span style="color:green">2</span>'
var THREE_BOMB = '<span style="color:red">3</span>'
var FOUR_BOMB = '<span style="color:darkblue">4</span>'
var FIVE_BOMB = '<span style="color:darkred">5</span>'
var SIX_BOMB = '<span style="color:darkcyan">6</span>'
var SEVEN_BOMB = '<span style="color:purple">7</span>'
var EIGHT_BOMB = '<span style="color:pink">8</span>'

var gBombs = []
var gBoard = [[]]
var gMarkedCells = []
var gMarkedBombsCounter = 0

var gIsFirstClick = false
var gIsGameOn = false

var easyBestScore
var mediumBestScore
var hardBestScore
var elEasyScore = document.querySelector('.Easy')
var elMediumScore = document.querySelector('.Medium')
var elHardScore = document.querySelector('.Hard')
var elTimer = document.querySelector('.timer')
var elSmily = document.querySelector('.smily-btn')

// Load the best scores and the deault board
function initGame(value) {
    elSmily.src = "img/facesmile.gif"
    easyBestScore = (localStorage.getItem('Easy')) ? localStorage.getItem('Easy') : ''
    mediumBestScore = (localStorage.getItem('Medium')) ? localStorage.getItem('Medium') : ''
    hardBestScore = (localStorage.getItem('Hard')) ? localStorage.getItem('Hard') : ''
    elEasyScore.innerText = easyBestScore
    elMediumScore.innerText = mediumBestScore
    elHardScore.innerText = hardBestScore
    radioClick(value)
}

// Get the difficulty level and build the board 
function radioClick(radio) {
    clearInterval(gameInterval)
    elTimer.innerText = '0:0'
    gMarkedCells = []
    gMarkedBombsCounter = 0
    GAME_LEVEL = radio.value
    switch (GAME_LEVEL) {
        case 'Easy':
            TABLE_LENGTH = 4
            NUM_OF_BOMBS = 2
            break;
        case 'Medium':
            TABLE_LENGTH = 6
            NUM_OF_BOMBS = 5
            break;
        case 'Hard':
            TABLE_LENGTH = 8
            NUM_OF_BOMBS = 15
            break;
    }
    gIsFirstClick = true
    gIsGameOn = true
    renderMarkedCellsCounter()
    createTable()
    buildEmptyBoard()
}

// Get the cell user choose and run the function by cell's value
function tdClicked(i, j) {
    if (gIsFirstClick) {
        generateBombs(i, j)
        buildBoard()
        timer()
        gIsFirstClick = false
    }
    var currCell = gBoard[i][j]
    if (currCell.flag || !gIsGameOn) return
    if (currCell.value === BOMB) gameOver(i, j)
    else if (currCell.value === 0) checkEmptyCells(i, j)
    else {
        var newValue = paintValue(currCell.value)
        renderCell(i, j, newValue)
    }
}

// Build the first board 
function buildEmptyBoard() {
    for (let i = 0; i < TABLE_LENGTH; i++) {
        gBoard[i] = []
        for (let j = 0; j < TABLE_LENGTH; j++) {
            gBoard[i][j] = { value: '', flag: false, checked: false }
        }
    }
}

// Render all the bombs on the board
function renderBombs() {
    for (let i = 0; i < gBombs.length; i++) {
        var x = gBombs[i].i
        var y = gBombs[i].j
        if (!gBoard[x][y].flag) {
            renderCell(x, y, BOMB)
        }
    }
}

// Set all values on the board
function buildBoard() {
    for (let i = 0; i < TABLE_LENGTH; i++) {
        for (let j = 0; j < TABLE_LENGTH; j++) {
            if (gBoard[i][j].value === BOMB) continue
            else gBoard[i][j].value = checkNegsBombs(i, j)
        }
    }
}

// Create an array of all bombs coords and add it to the board
function generateBombs(x, y) {
    var randomNumArr1 = []
    var randomNumArr2 = []
    var random1
    var random2
    var randomPlace
    for (let i = 0; i < TABLE_LENGTH ; i++) {
        for (let j = 0; j < TABLE_LENGTH ; j++) {
            if (i === x && j === y) continue
            randomNumArr1.push(i)
            randomNumArr2.push(j)
        }
    }
    for (let i = 0; i < NUM_OF_BOMBS; i++) {
        randomPlace = getRandomIntInclusive(0, randomNumArr1.length - 1)
        random1 = randomNumArr1.splice(randomPlace, 1)[0]
        random2 = randomNumArr2.splice(randomPlace, 1)[0]
        gBombs[i] = { i: random1, j: random2 }
        gBoard[random1][random2].value = BOMB
    }

}

// Create the board on the DOM
function createTable() {
    var elTable = document.querySelector('table')
    var tableStr = '<tr>'
    for (let i = 0; i < TABLE_LENGTH; i++) {
        for (let j = 0; j < TABLE_LENGTH; j++) {
            tableStr += `<td class="cell-${i}-${j}" onmousedown="MarkCell(event,${i},${j})" ><div style="display:block"></div></td>`
        }
        tableStr += '</tr><tr>'
    }
    tableStr = tableStr.slice(0, tableStr.length - 5)
    elTable.innerHTML = tableStr
}

// Render cell by his coords
function renderCell(x, y, value) {
    var elCell = document.querySelector(`.cell-${x}-${y}`)
    if (!gBoard[x][y].flag) elCell.innerHTML = value
    else if (value === FLAG) elCell.lastChild.innerText = value
    if (!gBoard[x][y].checked) gBoard[x][y].checked = true
}

// Check num of negs there are bombs 
function checkNegsBombs(x, y) {
    var negsCount = 0
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (i < 0 || i >= TABLE_LENGTH || j < 0 || j >= TABLE_LENGTH) continue
            if (i === x && j === y) continue
            if (gBoard[i][j].value === BOMB) negsCount++
        }
    }
    return negsCount
}

// Paint the cell's value 
function paintValue(value) {
    var newValue
    switch (value) {
        case 1:
            newValue = ONE_BOMB
            break;
        case 2:
            newValue = TWO_BOMB
            break;
        case 3:
            newValue = THREE_BOMB
            break;
        case 4:
            newValue = FOUR_BOMB
            break;
        case 5:
            newValue = FIVE_BOMB
            break;
        case 6:
            newValue = SIX_BOMB
            break;
        case 7:
            newValue = SEVEN_BOMB
            break;
        case 8:
            newValue = EIGHT_BOMB
            break;
        case 0:
            newValue = ''
            break
        default:
            newValue = value
            break;
    }
    return newValue
}

// When game over reset all vars, show the bombs and freeze the game
function gameOver(i, j) {
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.style.backgroundColor = 'red'
    renderBombs()
    renderMarkedCells()
    clearInterval(gameInterval)
    gIsGameOn = false
    elSmily.src = "img/facedead.gif"
}

// check all the empty cells around the clicked cell and show him
function checkEmptyCells(x, y) {
    var elCell
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            elCell = document.querySelector(`.cell-${i}-${j}`)
            if (i < 0 || i >= TABLE_LENGTH || j < 0 || j >= TABLE_LENGTH) continue
            if (i === x && j === y) continue
            if (gBoard[i][j].value !== BOMB &&
                elCell.innerHTML !== '' &&
                !gBoard[i][j].checked) {
                renderCell(i, j, paintValue(gBoard[i][j].value))
                if (gBoard[i][j].value === 0) checkEmptyCells(i, j)
            }
        }
    }
    return
}

// mark the cell with flag
function MarkCell(event, i, j) {
    var isBomb
    if (event.button === 2 &&
        event.path[0].tagName === 'DIV' &&
        gIsGameOn) {
        isBomb = checkIfMinedCell(event.path[1].className)
        if (!isBomb) gMarkedCells.push(event.path[1].className)
        else {
            gMarkedBombsCounter++
        }
        checkIfWin()
        renderMarkedCellsCounter()
    } else {
        tdClicked(i, j)
    }
}

// check if the marked cell is bomb
function checkIfMinedCell(className) {
    var i = parseInt(className.charAt(5))
    var j = parseInt(className.charAt(7))
    gBoard[i][j].flag = true
    renderCell(i, j, FLAG)
    for (let inx = 0; inx < gBombs.length; inx++) {
        if (gBombs[inx].i === i && gBombs[inx].j === j) {
            return true
        }
    }
    return false
}

// render all the cells are marked and they not bomb
function renderMarkedCells() {
    var elCell
    for (let i = 0; i < gMarkedCells.length; i++) {
        elCell = document.querySelector('.' + gMarkedCells[i])
        elCell.innerText = NOT_BOMB
    }
}

// check if its the best score and set him on the localStorage and and the DOM
function bestScore(time) {
    var colon = time.indexOf(':')
    var min = time.substring(0, colon)
    var sec = time.substring(colon + 1, time.length)
    var score = (min * 60) + sec
    var lsTime = localStorage.getItem(GAME_LEVEL)
    if (lsTime) {
        var lsMin = lsTime.substring(0, colon)
        var lsSec = lsTime.substring(colon + 1, lsTime.length)
        var lsScore = (lsMin * 60) + lsSec
    }
    if (lsTime === null || lsTime === '' || lsScore > score) {
        localStorage.setItem(GAME_LEVEL, time)
        document.querySelector('.' + GAME_LEVEL).innerText = time
    }
}

// render how mach cells marked
function renderMarkedCellsCounter() {
    var elFlagDownCounter = document.querySelector('.flag-down-counter')
    var counterValue = NUM_OF_BOMBS - (gMarkedBombsCounter + gMarkedCells.length)
    elFlagDownCounter.innerText = counterValue
}

// reset the game
function resetGame() {
    initGame({ value: GAME_LEVEL })
}

// check if the player win if he win change the smily and and freeze the game 
function checkIfWin() {
    if (gMarkedBombsCounter === NUM_OF_BOMBS && !gMarkedCells.length) {
        var score = document.querySelector('.timer').innerText
        clearInterval(gameInterval)
        gIsGameOn = false
        bestScore(score)
        elSmily.src = "img/facewin.gif"
    }
}