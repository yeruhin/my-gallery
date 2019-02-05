'use strict'

var gameInterval

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timer() {
    var start = Date.now();
    gameInterval = setInterval(() => {
        var delta = Date.now() - start ;
        var left = Math.floor(delta / 1000 /60);
        var right = parseInt(delta / 1000) - (left*60);
        var timerStr = left + ':' + right;
        document.querySelector('.timer').innerText = timerStr;
    }, 500);
}