'use strict'

const DEFAULT_TEXT_SIZE = 60;
const DEFAULT_TEXT = 'Your text here';
const DEFAULT_FONT = 'Impact';
const DEFAULT_ALIGN = 'center';
const DEFAULT_COLOR = 'white';

var gImgs = [];
var gMyImgs = [];

var gMeme = {
    selectedImgId: null,
    selectedLineIdx: null,

    lines: [{
        txt: DEFAULT_TEXT,
        size: DEFAULT_TEXT_SIZE,
        font: DEFAULT_FONT,
        align: DEFAULT_ALIGN,
        color: DEFAULT_COLOR
    }]
}

function updateTextSize(updatedSize, pos = 0) {
    gMeme.lines[pos].size = updatedSize;
}

function addToMyImgs(gCurrData) {

    let objToPush = {}
    for (let property in gCurrData) {
        objToPush[property] = gCurrData[property]
    }
    gMyImgs.push(objToPush);
}

function resetCurrData() {
    gIsEditing = false;
    gCurrData.lines[0].text = '';
    gCurrData.selectedLineIdx = 0;
    gCurrData.lines = [];
    gCurrData.lines = [{
        text: DEFAULT_TEXT,
        size: DEFAULT_TEXT_SIZE,
        font: 'Impact',
        align: 'center',
        pos: {
            x: null,
            y: null,
        },
        color: 'white',
    }, ];
}

function updateText(text, pos = 0, size = DEFAULT_TEXT_SIZE) {
    gMeme.lines.splice(pos, 1, {
        txt: text,
        size: size,
        font: 'Impact',
        // align: 'center',
        // color: 'white'
    })
}

function getFontSizeAndFamily() {
    var str = gMeme.lines[0].size;
    str += 'px ';
    str += gMeme.lines[0].font;
    return str;
}

function createMemes() {
    // loop pitfall ahead, beware!
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

function setImageForDisplay(imgId) {
    gMeme.selectedImgId = imgId;
    // return gMeme;
}













// function updateTextSettings(updatedSize, pos = 0) {
//     gMeme.lines[pos].size = updatedSize;
// }


// function getImgUrl(gCurrId) {
//     var currUrl = null;
//     gImgs.find(function (img) {
//         if (img.id === gCurrId) {
//             currUrl = img.url
//         }
//     })
//     return currUrl;
// }