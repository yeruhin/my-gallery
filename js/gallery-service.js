'use strict'

const PORTFOLIOS_KEY = 'portfolios'
var gProjs = []

function createPortfolios() {
    if (!gProjs || !gProjs.length) {
        var ids = ['mine-sweeper', 'chess']
        var names = ['Mine Sweeper', 'Chess']
        var titles = ['Find all mines', 'Defeat the computer']
        var descs = ['The purpose of the game is to open all the cells of the board which do not contain a bomb', 'Best strategy game in the world']
        var times = [1548280800000, 1547935200000]
        var labels = [['mines', 'nostalgic'], ['strategy', 'old game']]
        for (let i = 0; i < names.length; i++) {
            gProjs[i] = createPortfolio(ids[i], names[i], titles[i], descs[i], times[i], labels[i])
        }
    }
    return gProjs;
}

function createPortfolio(id, name, title, desc, time, label) {
    return {
        id: id,
        name: name,
        title: title,
        desc: desc,
        smlImg:`img/portfolio/${id}-thumbnail.jpg`,
        bigImg:`img/portfolio/${id}-full.jpg`,
        time: time,
        label: label,
        url:`projs/${id}/index.html`
    }
}

function getProjs() {
    return gProjs
}

function getProjById(projId){
    let theProj = gProjs.find(function(proj){
        return proj.id === projId
    })
    return theProj
}