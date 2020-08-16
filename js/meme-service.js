'use strict'

const DEFAULT_TEXT_SIZE = 60;
const DEFAULT_TEXT = 'Your text here';
const DEFAULT_FONT = 'Impact';
const DEFAULT_ALIGN = 'center';
const DEFAULT_COLOR = 'white';

var gImgs = [];
var gMyImgs = [];

var gCurrData = setReset();

function setReset() {
    return gCurrData = {
        id: null,
        selectedLineIdx: 0,
        selectedStickerIdx: 0,
        stickers: [],
        lines: [{
            text: DEFAULT_TEXT,
            size: DEFAULT_TEXT_SIZE,
            font: DEFAULT_FONT,
            align: DEFAULT_ALIGN,
            color: DEFAULT_COLOR,
            pos: {
                x: null,
                y: null,
            }
        }]
    };
}

function getStickersForDisplay() {
    return gCurrData.stickers;
}

function setSticker(currSticker) {
    let newSticker = {
        sticker: currSticker,
        size: DEFAULT_TEXT_SIZE,
        pos: {
            x: gCanvas.width / 2 - 30,
            y: gCanvas.height / 2 - 30
        }
    }
    gCurrData.stickers.push(newSticker)
}

function updateTextSize(updatedSize, pos = 0) {
    gCurrData.lines[pos].size = updatedSize;
}

function addToMyImgs(gCurrData) {

    let objToPush = {}
    for (let property in gCurrData) {
        objToPush[property] = gCurrData[property]
    }
    gMyImgs.push(objToPush);
}

function setSize(val) {
    if (val.dataset.size === '+')
        gCurrData.lines[gCurrData.selectedLineIdx].size += 10;
    else if (
        val.dataset.size === '-' &&
        gCurrData.lines[gCurrData.selectedLineIdx].size > 10
    ) {
        gCurrData.lines[gCurrData.selectedLineIdx].size -= 10;
    }
}

function updateImgId(id) {
    gCurrData.id = id;
}

function getClickedSticker(clickX, clickY) {
    return gCurrData.stickers.find(function (el) {
        return clickX > el.pos.x && clickX < (el.pos.x + gCtx.measureText(el.text).width) &&
            clickY > el.pos.y - el.size && clickY < el.pos.y
    });
}

function getClickedStickerIdx(clickX, clickY) {
    return gCurrData.stickers.findIndex(function (el) {
        return clickX > el.pos.x && clickX < (el.pos.x + gCtx.measureText(el.text).width) &&
            clickY > el.pos.y - el.size && clickY < el.pos.y
    });
}

function getClickedText(clickX, clickY) {
    return gCurrData.lines.find(function (el) {
        return clickX > el.pos.x && clickX < (el.pos.x + gCtx.measureText(el.text).width) &&
            clickY > el.pos.y - el.size && clickY < el.pos.y
    });
}

function getClickedTextidx(clickX, clickY) {
    return gCurrData.lines.findIndex(function (el) {
        return clickX > el.pos.x && clickX < (el.pos.x + gCtx.measureText(el.text).width) &&
            clickY > el.pos.y - el.size && clickY < el.pos.y
    });
}

function getFontSizeAndFamily() {
    var str = gCurrData.lines[0].size;
    str += 'px ';
    str += gCurrData.lines[0].font;
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

function insertNewLine() {
    let addedLine = {
        text: DEFAULT_TEXT,
        size: DEFAULT_TEXT_SIZE,
        font: DEFAULT_FONT,
        align: DEFAULT_ALIGN,
        color: DEFAULT_COLOR,
        pos: {
            x: null,
            y: null,
        }
    };
    gCurrData.lines.push(addedLine);
}

function checkAddedLine() {

    let linesCount = gCurrData.lines.length;
    let currLine = gCurrData.lines[gCurrData.selectedLineIdx]
    gCtx.font = currLine.size + 'px ' + currLine.font;
    let textWidth = gCtx.measureText(currLine.text).width;

    if (linesCount === 1) {
        currLine.pos.x = gCanvas.width / 2 - textWidth / 2;
        currLine.pos.y = gCanvas.height - (gCanvas.height * 0.85);
        return
    }
    if (linesCount === 2) {
        currLine.pos.x = gCanvas.width / 2 - textWidth / 2;
        currLine.pos.y = gCanvas.height - (gCanvas.height * 0.05);
        return
    }
    if (linesCount === 3) {
        currLine.pos.x = gCanvas.width / 2 - textWidth / 2;
        currLine.pos.y = gCanvas.height / 2;
        return
    }

}

function addToSelectedIdx() {
    if (gCurrData.selectedLineIdx < 2) gCurrData.selectedLineIdx++
}

function subtractSelectedIdx() {
    if (gCurrData.selectedLineIdx > 0) gCurrData.selectedLineIdx--
}

function setText(txt) {
    gCurrData.lines[gCurrData.selectedLineIdx].text = txt;
}

function setRemoveLine() {
    gCurrData.lines.splice(gCurrData.selectedLineIdx, 1)
}

function getLineCount() {
    return gCurrData.lines.length;
}

function setAlignLeft() {
    let currSelected = gCurrData.selectedLineIdx;
    gCurrData.lines[currSelected].pos.x = 0;
}

function setAlignRight() {
    let currSelected = gCurrData.selectedLineIdx;
    let textWidth = gCtx.measureText(gCurrData.lines[currSelected].text).width;
    gCurrData.lines[currSelected].pos.x = gCanvas.width - textWidth;
}

function setAlignCenter() {
    let currSelected = gCurrData.selectedLineIdx;
    let textWidth = gCtx.measureText(gCurrData.lines[currSelected].text).width;
    gCurrData.lines[currSelected].pos.x = gCanvas.width / 2 - textWidth / 2;
}

function setFont(font) {
    gCurrData.lines[gCurrData.selectedLineIdx].font = font;
}

function setColor(currColor) {
    gCurrData.lines[gCurrData.selectedLineIdx].color = currColor;
}

function updateSelection(idx) {
    gCurrData.selectedLineIdx = idx;
}

function updateStickerSelection(idx) {
    gCurrData.selectedStickerIdx = idx;
}