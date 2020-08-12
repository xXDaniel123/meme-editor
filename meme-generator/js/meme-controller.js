'use strict'

var gCanvas;
var gCtx;
var gCurrId;
var gCurrText;
var gIsEditing = false;

var gCurrImgObj;
var gCurrImg;

function init() {
    createMemes();
    render();
}

function getUpdateSettings() {
    gCtx.font = "70px impact"
    gCtx.fillStyle = "white";
    gCtx.strokeStyle = "black";
    gCtx.lineWidth = 4;
}

function onFinishEdit() {
    gIsEditing = false;
    gCurrText = '';
    render();
}

function render() {

    var strHTML = ``;
    var elContainer = document.querySelector('.container');

    if (!gIsEditing) {
        let imgs = getImgsForDisplay();
        imgs.forEach(function (currObj) {
            strHTML += `<img data-idx="${currObj.id}" 
            class="img-item item-${currObj.id}" src="${currObj.url}" alt="" 
            onclick="onStartEdit(this)"></img>`
        })
        elContainer.innerHTML = strHTML;

    } else if (gIsEditing) {

        strHTML += `
        <div class="canvas-container">
            <canvas id="canvas" width="700" height="700"></canvas>
        </div>
        <div class="controls-container">
            <input onkeyup="onWrite(this, event)" onblur="onMouseOut()" 
            class="text-input" type="text" value="">
            <div class="btn-container">
                <button class="btn" onclick="onSizeChange(this)"> + </button>
                <button class="btn" onclick="onSizeChange(this)"> - </button>
                <button class="btn"> right </button>
                <button class="btn"> center </button>
                <button class="btn"> left </button>
                <button class="btn">delete</button>
            </div>
        </div>
        <button onclick="onFinishEdit()">close</button>
        `
        elContainer.innerHTML = strHTML;
        initImg();
    }
}

function initImg() {
    gCurrImgObj = setImageForDisplay(gCurrId);
    gCanvas = document.getElementById('canvas');
    gCtx = gCanvas.getContext('2d');

    gCurrImg = new Image;
    gCurrImg.onload = function () {
        gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);
        setInitialText();
    }
    gCurrImg.src = 'meme-imgs/' + gCurrImgObj.selectedImgId + '.jpg';
}

function setInitialText() {
    getUpdateSettings();
    // maybe loop through object lines
    let initialText = gCurrImgObj.lines[0].txt;
    let textWidth = gCtx.measureText(initialText).width;
    gCtx.fillText(initialText, gCanvas.width / 2 - (textWidth / 2), 80);
    gCtx.strokeText(initialText, gCanvas.width / 2 - (textWidth / 2), 80);
}

function onWrite(text, ev) {

    gCurrText = text.value;
    let textWidth = gCtx.measureText(gCurrText).width;
    if (ev.code !== "Backspace") {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);
        gCtx.fillText(gCurrText, gCanvas.width / 2 - (textWidth / 2), 80);
        gCtx.strokeText(gCurrText, gCanvas.width / 2 - (textWidth / 2), 80);
    } else if (ev.code === "Backspace") {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);
        gCtx.fillText(gCurrText, gCanvas.width / 2 - (textWidth / 2), 80);
        gCtx.strokeText(gCurrText, gCanvas.width / 2 - (textWidth / 2), 80);
    }
    // updated through the onMouseOut function
}

function onSizeChange(val) {
    let increment = val.innerText;
    let currSettings = gCtx.font
    let currFontFamily = currSettings.split(" ")[1];
    let currFontSize = currSettings.split(" ")[0].match(/\d+/g)


    if (increment === '+') {
        // increase size in view
        // increase size in the service, that in turn will increase size in the model
    } else if (increment === '-') {
        // decrease size
        // decrease size in the service, that in turn will decrease size in the model

    }
}

// onclick
function onStartEdit(el) {
    gIsEditing = true;
    gCurrId = +el.dataset.idx;
    render();
}

function onMouseOut() {
    updateText(gCurrText);
}