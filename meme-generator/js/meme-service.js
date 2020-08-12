'use strict'

var gNextId = 0;
var gImgs = [];

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: null,

    lines: [{
        txt: 'Your text here',
        size: 70,
        align: 'center',
        color: 'black'
    }]
}

function createMemes() {
    // loop pitfall aheadh, beware!
    for (let i = 1; i <= 18; i++) {
        updateModel(i);
    }
}

function updateModel(currNum) {
    var meme = {};
    meme.id = currNum;
    meme.url = 'meme-imgs/' + currNum + '.jpg';
    gImgs.push(meme)
}

function getImgsForDisplay() {
    return gImgs;
}

function updateText(text) {
    gMeme.lines.push({
        txt: text,
        size: 70,
        align: 'center',
        color: 'black'
    })
}

function setImageForDisplay(imgId) {
    gMeme.selectedImgId = imgId;
    return gMeme;
}

function getImgUrl(gCurrId) {
    var currUrl = null;
    gImgs.find(function (img) {
        if (img.id === gCurrId) {
            currUrl = img.url
        }
    })
    return currUrl;
}