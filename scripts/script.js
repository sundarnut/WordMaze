var letters = "SLLEWOTNSLETEHOOTAKECRIBCBDAKLUQUAYEBARCPALADNASB";
var words = ["SNORKEL","TOWEL","BUCKET","KITE","TABLE","SPADE","SANDAL","SAND","QUAY","BAY","YACHT"];
var rowLength = 7;
var columnLength = rowLength;
var mazeCount = letters.length;
var coordinates = new Array();
var resetList = new Array();
var canvasLocation = null;

function renderCanvas() {
    checkCanvasForConsistency();

    var canvas = document.getElementById("mazeCanvas");
    canvas.addEventListener("mousemove", doMouseMove, false);

    canvas.addEventListener("touchstart", doTouchStart, false);
    canvas.addEventListener("touchmove", doTouchMove, false);
    canvas.addEventListener("touchend", doTouchEnd, false);

    var context = canvas.getContext("2d");
    context.font = "bold 24pt Courier";
    context.fillStyle = "black";

    canvasLocation = canvas.getBoundingClientRect();

    var x = 30;
    var y = 40;
    var columnCounter = 0;

    for (var i = 0; i < mazeCount; i++) {
        if (columnCounter == columnLength) {
            x = 30;
            y += 40;
            columnCounter = 0;
        }

        var c = letters.charAt(i);
        context.fillText(c, x, y);

        //        context.strokeRect(x, y - 20, 20, 20);
        coordinates.push(new Array(x, y - 20, x + 20, y));

        x += 30;
        columnCounter++;
    }
}

function doMouseMove(event) {
    var canvas = document.getElementById("mazeCanvas");

    canvasLocation = canvas.getBoundingClientRect();

    canvas_x = event.x;
    canvas_y = event.y;
    var txtCoord = document.getElementById("txtCoord");
    txtCoord.value = canvas_x + " " + canvas_y;

    var insideSquare = false;

    for (i = 0; i < mazeCount; i++) {
        var coordinate = coordinates[i];

        if ((canvas_x > coordinate[0] + canvasLocation.left) &&
            (canvas_y >= coordinate[1] + canvasLocation.top) &&
            (canvas_x < coordinate[2] + canvasLocation.left) &&
            (canvas_y <= coordinate[3] + canvasLocation.top)) {
            var c = letters.charAt(i);
            var context = canvas.getContext("2d");

            var context = canvas.getContext("2d");
            context.font = "bold 24pt Courier";
            context.fillStyle = "white";
            context.fillText(c, coordinate[0], coordinate[3]);

            context.font = "bold 24pt Courier";

            context.fillStyle = "red";

            context.fillText(c, coordinate[0], coordinate[3]);
            insideSquare = true;

            resetList.push(new Array(i, coordinate[0], coordinate[3]));

            break;
        }
    }

    if ((insideSquare == false) &&
        (resetList.length > 0)) {
        for (i = 0; i < resetList.length; i++) {

            var element = resetList[i];

            var c = letters.charAt(element[0]);
            var context = canvas.getContext("2d");
            context.font = "bold 24pt Courier";
            context.fillStyle = "white";
            context.fillText(c, element[1], element[2]);

            context.font = "bold 24pt Courier";
            context.fillStyle = "black";
            context.fillText(c, element[1], element[2]);
        }

        resetList = new Array();
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
