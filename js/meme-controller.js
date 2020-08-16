'use strict';

var gCanvas;
var gCtx;
var gIsEditing = false;
var gIsMoving = false;
var gIsStickerMoving = false;
var gCurrImg;
var gCurrMovingObject;
var gCurrMovingSticker;

function init() {
    createMemes();
    render();
}

function onLogoClick() {
    gIsEditing = false;
    setReset();
    render();
}

function render() {
    var strHTML = ``;
    var elContainer = document.querySelector('.imgs-container');

    if (!gIsEditing) {
        let imgs = getImgsForDisplay();
        imgs.forEach(function (currImg) {
            strHTML += `<img data-idx="${currImg.id}" 
            class="img-item item-${currImg.id}" src="${currImg.url}" alt="" 
            onclick="onStartEdit(this)"></img>`;
        });
        elContainer.innerHTML = strHTML;
    } else if (gIsEditing) {
        strHTML += `
        <div class="editor-container">
            <div class="canvas-container">
                <canvas id="canvas" width="550" height="550" onmousemove="onStartMove(event)" onmouseup="onFinishMoving(event)"
                onmousedown="onMouseDown(event)"></canvas>
            </div>
  
            <div class="controls-container">
            <input onkeyup="onWrite(this, event)" class="text-input" type="text" value="">
                <div class="upper-control-container">
                    <button class="btn" onclick="onNextLine()"><img class="img-icon" src="icons/change.png" alt=""></button>
                    <button class="btn" onclick="onAddNewLine()"><img class="img-icon" src="icons/add.png" alt=""></button>
                    <button class="btn" onclick="onRemoveLine()"><img class="img-icon" src="icons/remove.png" alt=""></button>
                </div>
    
                <div class="mid-control-container">

                <div class="upper-mid-control-container">

                    <button class="btn" data-size="+" onclick="onSizeChange(this)"><img class="img-icon" src="icons/increase-size.png" alt=""></button>
                    <button class="btn" data-size="-" onclick="onSizeChange(this)"><img class="img-icon" src="icons/decrease-size.png" alt=""></button>
                    <button class="btn" onclick="onAlignLeft()"><img class="img-icon" src="icons/align-to-left.png" alt=""></button>
                    <button class="btn" onclick="onAlignCenter()"><img class="img-icon" src="icons/align-center.png" alt=""></button>
                    <button class="btn" onclick="onAlignRight()"><img class="img-icon" src="icons/align-to-right.png" alt=""></button>
              
                </div>

                <div class="low-mid-control-container">
                        <select class="dropdown" name="" id="" onChange=onChangeFont(this.value)>
                            <option value="Impact">Impact</option>
                            <option value="Montserrat-Regular">Montserat</option>
                        </select>
                        <button class="btn"><img class="img-icon" src="icons/a.png" alt=""></button>
                         <button class="btn"><input type="color" id="favcolor" name="favcolor" value="#00000" onChange="onChangeColor(this.value)"><img class="img-icon" src="icons/color.png" alt=""></button>
                    </div>
                </div>

                <div class="lower-control-container">
                        <div class="asset-container">
                            <div class="sticker pizza" onclick="addSticker(this.innerText)">🍕</div>
                            <div class="sticker shades" onclick="addSticker(this.innerText)">🕶️</div>
                            <div class="sticker fire" onclick="addSticker(this.innerText)">🔥</div>
                            <div class="sticker love-face" onclick="addSticker(this.innerText)">😍</div>
                            <div class="sticker love" onclick="addSticker(this.innerText)">❤️</div>
                        </div>
                        <div class="lower-btn-container">
                            <button class="lower-btn"><a href="#" onclick="onDownload(this)" download="my-img.jpg">Download</a></button>
                            <button class="lower-btn" onclick="onFinishEdit()">close</button>
                        </div>
                </div>
    
        </div>       
         </div>
        `;
        elContainer.innerHTML = strHTML;
        initImg();
    }
}

function initImg() {
    gCanvas = document.getElementById('canvas');
    gCtx = gCanvas.getContext('2d');

    gCurrImg = new Image();
    gCurrImg.onload = function () {
        gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);
        setInitialText();
    };
    gCurrImg.src = 'meme-imgs/' + gCurrData.id + '.jpg';
}

// need to fix this code below with MVC
function setInitialText() {

    gCtx.font = DEFAULT_TEXT_SIZE + 'px ' + DEFAULT_FONT;
    gCtx.fillStyle = DEFAULT_COLOR;
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 3;

    let textWidth = gCtx.measureText(gCurrData.lines[0].text).width;

    let centerX = gCurrData.lines[gCurrData.selectedLineIdx].pos.x = gCanvas.width / 2 - textWidth / 2;
    let topY = gCurrData.lines[gCurrData.selectedLineIdx].pos.y = gCanvas.height - (gCanvas.height * 0.85);

    // set the default text
    gCurrData.lines[gCurrData.selectedLineIdx].font = DEFAULT_FONT;
    gCurrData.lines[gCurrData.selectedLineIdx].size = DEFAULT_TEXT_SIZE;

    gCtx.fillText(DEFAULT_TEXT, centerX, topY); // draws in the middle
    gCtx.strokeText(DEFAULT_TEXT, centerX, topY); // draws in the middle
    addBgForSelection(0, gCurrData.lines[0])

}

function drawCanvas() {

    let currIdx = 0;

    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);
    drawStickers();

    for (let i = 0; i < gCurrData.lines.length; i++) {

        // getting current data for the font
        gCtx.font = gCurrData.lines[currIdx].size + 'px ' + gCurrData.lines[currIdx].font;
        gCtx.fillStyle = gCurrData.lines[currIdx].color;
        gCtx.strokeStyle = 'black';

        let currText = gCurrData.lines[currIdx].text;
        let currY = gCurrData.lines[currIdx].pos.y; // get the y pos
        let currX = gCurrData.lines[currIdx].pos.x; // get the x pos

        // draws on the canvas the text
        gCtx.fillText(currText, currX, currY);
        gCtx.strokeText(currText, currX, currY);

        currIdx++;
    }
}

function drawStickers() {
    let stickers = getStickersForDisplay();
    if (!stickers) return

    let currIdx = 0;
    for (let i = 0; i < stickers.length; i++) {

        gCtx.font = stickers[currIdx].size;

        let currSticker = stickers[currIdx].sticker;
        let currY = stickers[currIdx].pos.y; // get the y pos
        let currX = stickers[currIdx].pos.x; // get the x pos

        gCtx.fillText(currSticker, currX, currY);
        gCtx.strokeText(currSticker, currX, currY);

        currIdx++;
    }
}

function addSticker(sticker) {
    setSticker(sticker);
    drawCanvas();
}

// onclick
function onStartEdit(el) {
    gIsEditing = true;
    updateImgId(+el.dataset.idx)
    render();
}

function onFinishEdit() {
    gIsEditing = false;
    addToMyImgs(gCurrData);
    setReset();
    render();
}

function onWrite(txt) {
    setText(txt.value);
    drawCanvas();
}

function onSizeChange(val) {
    setSize(val);
    drawCanvas();
}

function addBgForSelection(idx, elClicked) {
    if (idx === -1) return;
    gCtx.fillStyle = '#00090340';
    gCtx.fillRect(0, elClicked.pos.y - elClicked.size, gCanvas.width, elClicked.size);
}

// mouse down event
function onMouseDown(ev) {
    gIsMoving = true;
    gIsStickerMoving = true;

    var clickX = ev.offsetX;
    var clickY = ev.offsetY;
    var elClicked = getClickedText(clickX, clickY);
    var idxClicked = getClickedTextidx(clickX, clickY);
    if (idxClicked !== -1) {
        updateSelection(idxClicked);
        gCurrMovingObject = elClicked;
        gIsStickerMoving = false;
    } else {
        // check for sticker moving
        var stickerClicked = getClickedSticker(clickX, clickY);
        var stickerClickedIdx = getClickedStickerIdx(clickX, clickY);
        if (!stickerClicked) return;
        updateStickerSelection(stickerClickedIdx);
        gCurrMovingSticker = stickerClicked;
        gIsMoving = false;
    }
}
// mouse move event
function onStartMove(ev) {
    if (gIsMoving) {
        gCurrMovingObject.pos.x = ev.offsetX - (gCtx.measureText(gCurrMovingObject.text).width / 2);
        gCurrMovingObject.pos.y = ev.offsetY + (gCurrMovingObject.size / 2);
    } else if (gIsStickerMoving) {
        gCurrMovingSticker.pos.x = ev.offsetX - 30;
        gCurrMovingSticker.pos.y = ev.offsetY + 30;
    }
    drawCanvas();
}

// mouse up event
function onFinishMoving() {
    gCurrMovingObject = null;
    gCurrMovingSticker = null
    gIsStickerMoving = false;
    gIsMoving = false;
    drawCanvas();
}

function onAddNewLine() {
    let linesCount = getLineCount();

    if (linesCount >= 3) return; // up to 3 lines

    if (linesCount !== 0) {
        insertNewLine();
        addToSelectedIdx(); // updte the selected idx
        checkAddedLine();
    } else {
        insertNewLine();
        setInitialText();
        checkAddedLine();
    }
    drawCanvas();
}

function onRemoveLine() {

    let linesCount = getLineCount();
    if (!linesCount) return;

    setRemoveLine();
    subtractSelectedIdx();
    drawCanvas();
}

function onAlignLeft() {
    setAlignLeft()
    drawCanvas();
}

function onAlignRight() {
    setAlignRight();
    drawCanvas();
}

function onAlignCenter() {
    setAlignCenter();
    drawCanvas();
}

function onDownload(el) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    el.href = imgContent;
}

function onChangeFont(font) {
    setFont(font);
    drawCanvas();
}

function onChangeColor(currColor) {
    setColor(currColor);
    drawCanvas();
}

// TODO
function onNextLine() {
    // TODO: select the line and add a background around it
    // when pressing it will update the sleectedLineIdx like the onAddNewLine
    // when onblur remove all background
    console.log('moving to next line');

}

// TODO
function onAbout() {
    alert('Need to add about section')
}

// -------

// unfortunately I had done some major mistakes at the beggining of the project,
// and only discovered themlater on when it started to take its toll, 
// I had to go back and rewrite a big chunk of the code and it took me a long time.. 
// but I learned my lesson well ;]