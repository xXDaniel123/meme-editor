'use strict';

var gCanvas;
var gCtx;
var gIsEditing = false;
var gIsMoving = false;
var gCurrImg;
var gCurrMovingObject;

// this will be the current edit settings object,
// to allow easy access to the settings

var gCurrData = {
    id: null,
    selectedLineIdx: 0,
    lines: [{
        text: DEFAULT_TEXT,
        size: DEFAULT_TEXT_SIZE,
        font: 'Impact',
        align: 'center',
        color: 'white',
        pos: {
            x: null,
            y: null,
        }
    }, ],
};

function init() {
    createMemes();
    render();
}

function onFinishEdit() {
    // also need to save the session
    onMouseOut();
    addToMyImgs(gCurrData);
    resetCurrData();
    render();
}

function render() {
    var strHTML = ``;
    var elContainer = document.querySelector('.imgs-container');

    if (!gIsEditing) {
        let imgs = getImgsForDisplay();
        imgs.forEach(function (currObj) {
            strHTML += `<img data-idx="${currObj.id}" 
            class="img-item item-${currObj.id}" src="${currObj.url}" alt="" 
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
            <input onkeyup="onWrite(this, event)" onblur="onMouseOut()" class="text-input" type="text" value="">
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
                        <select class="dropdown" name="" id="">
                            <option value="impact">Impact</option>
                            <option value="montserat">Montserat</option>
                        </select>
                        <button class="btn"><img class="img-icon" src="icons/a.png" alt=""></button>
                        <button class="btn"><img class="img-icon" src="icons/color.png" alt=""></button>
                    </div>
                </div>

                <div class="lower-control-container">
                        <div class="asset-container"></div>
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

// onclick
function onStartEdit(el) {
    gIsEditing = true;
    gCurrData.id = +el.dataset.idx;
    render();
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

}

function onWrite(text) {
    gCurrData.lines[gCurrData.selectedLineIdx].text = text.value;
    drawCanvas();
}

function onMouseOut() {
    // sending also pos, default pos is 0
    updateText(gCurrData.text, 0, gCurrData.size);
}

function drawCanvas() {

    let currIdx = 0;

    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gCtx.drawImage(gCurrImg, 0, 0, gCanvas.width, gCanvas.height);

    for (let i = 0; i < gCurrData.lines.length; i++) {

        // getting current data for the font
        gCtx.font = gCurrData.lines[currIdx].size + 'px ' + gCurrData.lines[currIdx].font;

        let currText = gCurrData.lines[currIdx].text;
        let currY = gCurrData.lines[currIdx].pos.y; // get the y pos
        let currX = gCurrData.lines[currIdx].pos.x; // get the x pos

        // draws on the canvas the text
        gCtx.fillText(currText, currX, currY);
        gCtx.strokeText(currText, currX, currY);

        currIdx++;
    }
}

function onSizeChange(val) {
    if (val.dataset.size === '+')
        gCurrData.lines[gCurrData.selectedLineIdx].size += 10;
    else if (
        val.dataset.size === '-' &&
        gCurrData.lines[gCurrData.selectedLineIdx].size > 10
    ) {
        gCurrData.lines[gCurrData.selectedLineIdx].size -= 10;
    }
    drawCanvas();
}

// mouse down event
function onMouseDown(ev) {
    gIsMoving = true;

    let clickX = ev.offsetX;
    let clickY = ev.offsetY;

    let elClicked = gCurrData.lines.find(function (el) {
        return clickX > el.pos.x && clickX < (el.pos.x + gCtx.measureText(el.text).width) &&
            clickY > el.pos.y - el.size && clickY < el.pos.y
    });
    gCurrMovingObject = elClicked;
}

// mouse move event
function onStartMove(ev) {
    if (gIsMoving) {
        gCurrMovingObject.pos.x = ev.offsetX - (gCtx.measureText(gCurrMovingObject.text).width / 2)
        gCurrMovingObject.pos.y = ev.offsetY + (gCurrMovingObject.size / 2)
        drawCanvas();
    }
}

// mouse up event
function onFinishMoving() {
    gCurrMovingObject = null;
    gIsMoving = false;
    drawCanvas();
}

function onAddNewLine() {
    // only support of 2 lines at the moment
    if (gCurrData.lines.length >= 2) return;

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

    addToSelectedIdx(); // updte the selected idx
    if (gCurrData.lines.length === 0) setInitialText();
    else checkAddedLine();

    drawCanvas();
}

function checkAddedLine() {
    // this will be for the second one added
    if (gCurrData.lines.length === 2) {
        let currLine = gCurrData.lines[gCurrData.selectedLineIdx]

        gCtx.font = currLine.size + 'px ' + currLine.font;
        let textWidth = gCtx.measureText(currLine.text).width;

        currLine.pos.x = gCanvas.width / 2 - textWidth / 2;
        currLine.pos.y = gCanvas.height - (gCanvas.height * 0.05);
    }
}

function addToSelectedIdx() {
    // only support of 2 lines at the moment
    // need to fix the bug that after removing the only existing line, it adds to the idx
    let currLength = gCurrData.lines.length;
    if (currLength <= 2 && gCurrData.selectedLineIdx === 0) gCurrData.selectedLineIdx++
}

function subtractSelectedIdx() {
    // only support of 2 lines at the moment
    let currLength = gCurrData.lines.length;
    if (currLength !== 0) gCurrData.selectedLineIdx--
}

function onRemoveLine() {
    // TODO: remove selected line
    gCurrData.lines.splice(gCurrData.selectedLineIdx, 1)
    subtractSelectedIdx();
    drawCanvas();
}

function onNextLine() {
    // TODO: select the line and add a background around it
    // when pressing it will update the sleectedLineIdx like the onAddNewLine
    // when onblur remove all background

}

function onAlignLeft() {
    let currSelected = gCurrData.selectedLineIdx;
    gCurrData.lines[currSelected].pos.x = 0;
    drawCanvas();
}

function onAlignRight() {
    let currSelected = gCurrData.selectedLineIdx;
    let textWidth = gCtx.measureText(gCurrData.lines[currSelected].text).width;
    gCurrData.lines[currSelected].pos.x = gCanvas.width - textWidth;
    drawCanvas();
}

function onAlignCenter() {
    let currSelected = gCurrData.selectedLineIdx;
    let textWidth = gCtx.measureText(gCurrData.lines[currSelected].text).width;
    gCurrData.lines[currSelected].pos.x = gCanvas.width / 2 - textWidth / 2;
    drawCanvas();
}

function onDownload(el) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    el.href = imgContent;

}

// -------

// unfortunately I had done some major mistakes at the beggining of the project,
// and only discovered themlater on when it started to take its toll, 
// I had to go back and rewrite a big chunk of the code and it took me a long time.. 
// but I learned my lesson well ;]