// JavaScript source code// JavaScript source code
var letters = "SLLEWOTNSLETEHOOTAKECRIBCBDAKLUQUAYEBARCPALADNASB";
var words = ["TOWEL", "SANDAL", "BAY", "YACHT", "BUCKET", "KITE", "SPADE", "BALL", "CUP", "SNORKEL", "QUAY", "SAND", "CUP", "SOIL", "TEA", "CRAB", "TABLE", "ROLE"];
var rowLength = 7;
var columnLength = rowLength;
var mazeCount = letters.length;
var colorIndices = new Array();
var resetList = new Array();
var insideIndex = -1;
var canvasLocation = null;
var mousePressed = false;
var mouseMotion = false;
var moveChanged = false;
var mouseX = 0;
var mouseY = 0;
var xLimit = 0;
var yLimit = 0;
var defaultColor = "black";
var highlightColor = "green";
var defaultFont = "24pt Courier";
var highlightFont = "bold 24pt Courier";

function renderCanvas() {
    checkCanvasForConsistency();
 
    var canvas = document.getElementById("mazeCanvas");
    canvas.addEventListener("mousemove", doMouseMove, false);
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
 
    canvas.addEventListener("touchstart", doTouchStart, false);
    canvas.addEventListener("touchmove", doTouchMove, false);
    canvas.addEventListener("touchend", doTouchEnd, false);
 
    var context = canvas.getContext("2d");
    context.font = defaultFont;
    context.fillStyle = defaultColor;
 
    var x = 40;
    var y = 40;
    var columnCounter = 0;
 
    for (var i = 0; i < mazeCount; i++) {
        if (columnCounter == columnLength) {
 
            if (xLimit == 0) {
                xLimit = x - 19;
            }
 
            x = 40;
            y += 40;
            columnCounter = 0;
        }
 
        var c = letters.charAt(i);
        console.log("Filling " + letters.charAt(i) + " at " + x + " " + y);
        context.fillText(c, x, y);
        colorIndices.push(defaultColor);
 
        x += 40;
        columnCounter++;
 
        if (i == mazeCount - 1) {
            yLimit = y + 5;
        }
    }
}
 
function doMouseDown(event) {
    if (!mousePressed) {
        mousePressed = true;
        mouseX = event.x;
        mouseY = event.y;
        console.log("mouse down");
    }
}
 
function doMouseUp(event) {
    mousePressed = false;
    mouseMotion = false;
    console.log("mouse up");
}
 
function doMouseMove(event) {
    var canvas = document.getElementById("mazeCanvas");
 
    canvasLocation = canvas.getBoundingClientRect();
 
    canvas_x = event.x - canvasLocation.left;
    canvas_y = event.y - canvasLocation.top;
 
    if ((canvas_x < 35) || (canvas_x > xLimit) || (canvas_y > yLimit)) {
 
        if (insideIndex != -1) {
 
            x_offset = (parseInt(insideIndex % columnLength) + 1) * 40;
            y_offset = (parseInt(insideIndex / columnLength) + 1) * 40;
 
            var context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(x_offset, y_offset - 20, 20, 20);

            context.font = defaultFont;
            context.fillStyle = colorIndices[insideIndex];
 
            console.log("Filling " + letters.charAt(insideIndex) + " at " + x_offset + " " + y_offset);
            context.fillText(letters.charAt(insideIndex), x_offset, y_offset);
 
            insideIndex = -1;
        }
 
        return;
    }
 
    var x_offset = parseInt(canvas_x / 40);
    var y_offset = parseInt(canvas_y / 40) + 1;
 
    var txtCoord = document.getElementById("txtCoord");
    txtCoord.value = x_offset + " " + y_offset;
 
    if ((canvas_x > (40 * x_offset)) &&
        (canvas_x < (40 * x_offset) + 16) &&
        (canvas_y > (40 * y_offset) - 16) &&
        (canvas_y < (40 * y_offset))) {
 
        if (insideIndex == -1) {
            insideIndex = ((y_offset - 1) * rowLength + (x_offset - 1));
 
            var context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(x_offset * 40, y_offset * 40 - 20, 20, 20);

            context.font = highlightFont;
            context.fillStyle = highlightColor;
 
            console.log("Filling " + letters.charAt(insideIndex) + " at " + (x_offset * 40) + " " + (y_offset * 40));
            context.fillText(letters.charAt(insideIndex), x_offset * 40, y_offset * 40);
        }
    } else if (insideIndex != -1) {
 
        x_offset = (parseInt(insideIndex % columnLength) + 1) * 40;
        y_offset = (parseInt(insideIndex / columnLength) + 1) * 40;
 
        // console.log("x_offset is " + x_offset + " and y_offset is " + y_offset);
 
        var context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(x_offset, y_offset - 20, 20, 20);

        context.font = defaultFont;
        context.fillStyle = colorIndices[insideIndex];
 
        console.log("Filling " + letters.charAt(insideIndex) + " at " + x_offset + " " + y_offset);
        context.fillText(letters.charAt(insideIndex), x_offset, y_offset);
 
        insideIndex = -1;
    }
}
 
function doTouchStart(event) {


    console.log("Touch Start!");
}
 
function doTouchMove(event) {
    console.log("Touch Move!");
}
 
function doTouchEnd(event) {
    console.log("Touch End!");
}
 
function checkCanvasForConsistency() {
    columnLength = parseInt(mazeCount / rowLength);
    var remainder = mazeCount % rowLength;
 
    if (remainder > 0) {
        alert("The maze grid is inexact. Expected letter count: " + (rowLength * columnLength));
        return;
    }
}
