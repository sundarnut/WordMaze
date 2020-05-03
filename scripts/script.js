/*
Added 2 6 for TOWEL
Added 42 47 for SANDAL
Added 34 48 for BAY
Added 6 34 for YACHT
Added 6 36 for BUCKET
Added 10 28 for KITE
Added 19 47 for SPADE
Added 1 25 for BALL
Added 40 24 for CUP
Added 42 0 for SNORKEL
Added 34 31 for QUAY
Added 44 47 for SAND
Added 40 24 for CUP
Added 29 8 for SOIL
Added 27 11 for TEA
Added 36 39 for CRAB
Added 35 11 for TABLE
*/

// JavaScript source code
// Letters that make up the word-search grid
var letters = "SLLEWOTNSLETEHOOTAKECRIBCBDAKLUQUAYEBARCPALADNASB";

// Words that you need to search in the grid
var inputWords = ["TOWEL", "SANDAL", "BAY", "YACHT", "BUCKET", "KITE", "SPADE", "BALL", "CUP", "SNORKEL", "QUAY", "SAND", "CUP", "SOIL", "TEA", "CRAB", "TABLE"];

// Purified Words
var words = new Array();

// Store all the found words here
var foundWords = new Array();

// Define empty object that will store solution
var solution = {};

// What is the number of rows that exist in the grid?
var rowCount = 7;

// Default columnCount to rowCount
var columnCount = rowCount;

// How many letters exist in the grid?
var mazeCount = letters.length;

// What is the color of each element or alphabet in the grid?
var colorIndices = new Array();

// What is the font style for each element or alphabet in the grid?
var fontIndices = new Array();

// Reset all elements back to default, when a certain event occurs. Store those here in this array
var resetList = new Array();

// List of all indices that form a straight line - horizontal, vertical or diagonal
var linearList = new Array();

// Offset arrays will store all the near rectangles that correspond to a dragged mouse
var offsetArrays = new Array();

// Array of lines we need to draw
var lineArrays = new Array();

// Inside index is set when we focus on a certain letter as we move the mouse
var insideIndex = -1;

// Select index stores the position where we pressed the mouse button
var selectIndex = -1;

// Last Selected index stores the position where we released the mouse button
var lastSelectedIndex = -1;

// What is the direction in which we are moving? 1 through 8 for clock positions 12:00 through 10:30, clockwise
var factor = 0;

// Where is the canvas present on the HTML page?
var canvasLocation = null;

// Mouse Pressed - true, when we depress it and drag it around
var mousePressed = false;

// What are the max values for xLimit and yLimit?
var xLimit = 0;
var yLimit = 0;

// Colors
var defaultColor = "black";
var highlightColor = "blue";
var selectColor = "red";
var foundColor = "green";
var defaultFont = "24pt Courier";
var highlightFont = "bold 24pt Courier";
var selectFont = "24pt Courier";

function renderCanvas() {
    checkCanvasForConsistency();
    normalizeInputWords();
    solveMaze();

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

        // Move to next line if you have reached the end for a line
        if (columnCounter == columnCount) {

            // Read xLimit as 19 less than first position
            if (xLimit == 0) {
                xLimit = x - 19;
            }

            x = 40;
            y += 40;
            columnCounter = 0;
        }

        var c = letters.charAt(i);
        context.fillText(c, x, y);

        colorIndices.push(defaultColor);
        fontIndices.push(defaultFont);

        x += 40;
        columnCounter++;

        // Read the last value of y into yLimit, add 5 for buffer 
        if (i == mazeCount - 1) {
            yLimit = y + 5;
        }
    }
}

function doMouseDown(event) {

    var canvas = document.getElementById("mazeCanvas");
    canvasLocation = canvas.getBoundingClientRect();

    var canvas_x = parseInt(event.x - canvasLocation.left);
    var canvas_y = parseInt(event.y - canvasLocation.top);

    downEvent(canvas_x, canvas_y);
}

function doMouseUp(event) {

    var canvas = document.getElementById("mazeCanvas");
    canvasLocation = canvas.getBoundingClientRect();

    var canvas_x = parseInt(event.x - canvasLocation.left);
    var canvas_y = parseInt(event.y - canvasLocation.top);

    upEvent(canvas_x, canvas_y);
}

function doMouseMove(event) {

    var canvas = document.getElementById("mazeCanvas");
    canvasLocation = canvas.getBoundingClientRect();

    var canvas_x = parseInt(event.x - canvasLocation.left);
    var canvas_y = parseInt(event.y - canvasLocation.top);

    var txtCoord = document.getElementById("txtCoord");
    txtCoord.value = canvas_x + " " + canvas_y;

    if (mousePressed) {
        dragMoveEvent(canvas_x, canvas_y);

        return;
    }

    var x_offset = parseInt(canvas_x / 40);
    var y_offset = parseInt(canvas_y / 40) + 1;

    if ((canvas_x < 22) || (canvas_x > xLimit) || (canvas_y > yLimit)) {

        if (insideIndex != -1) {

            x_offset = (parseInt(insideIndex % columnCount) + 1) * 40;
            y_offset = (parseInt(insideIndex / columnCount) + 1) * 40;

            var context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(x_offset - 2, y_offset - 22, 28, 28);

            context.font = defaultFont;
            context.fillStyle = colorIndices[insideIndex];
            context.fillText(letters.charAt(insideIndex), x_offset, y_offset);

            insideIndex = -1;
        }

        return;
    }

    if ((canvas_x >= (40 * x_offset)) &&
        (canvas_x <= (40 * x_offset) + 18) &&
        (canvas_y >= (40 * y_offset) - 18) &&
        (canvas_y <= (40 * y_offset))) {

        if (insideIndex == -1) {
            insideIndex = ((y_offset - 1) * rowCount + (x_offset - 1));

            var context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(x_offset * 40 - 2, y_offset * 40 - 22, 28, 28);

            context.font = highlightFont;
            context.fillStyle = highlightColor;
            context.fillText(letters.charAt(insideIndex), x_offset * 40, y_offset * 40);
        }
    } else if (insideIndex != -1) {

        x_offset = (parseInt(insideIndex % columnCount) + 1) * 40;
        y_offset = (parseInt(insideIndex / columnCount) + 1) * 40;

        var context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(x_offset - 2, y_offset - 22, 28, 28);

        context.font = fontIndices[insideIndex];
        context.fillStyle = colorIndices[insideIndex];
        context.fillText(letters.charAt(insideIndex), x_offset, y_offset);

        insideIndex = -1;
    }
}

function doTouchStart(event) {

    var canvas = document.getElementById("mazeCanvas");
    canvasLocation = canvas.getBoundingClientRect();

    var canvas_x = parseInt(event.targetTouches[0].pageX - canvasLocation.left);
    var canvas_y = parseInt(event.targetTouches[0].pageY - canvasLocation.top);

    downEvent(canvas_x, canvas_y);
}

function doTouchMove(event) {

    var canvas = document.getElementById("mazeCanvas");
    canvasLocation = canvas.getBoundingClientRect();

    var canvas_x = parseInt(event.targetTouches[0].pageX - canvasLocation.left);
    var canvas_y = parseInt(event.targetTouches[0].pageY - canvasLocation.top);

    dragMoveEvent(canvas_x, canvas_y);
}

function doTouchEnd(event) {

    var canvas = document.getElementById("mazeCanvas");
    canvasLocation = canvas.getBoundingClientRect();

    var canvas_x = parseInt(event.targetTouches[0].pageX - canvasLocation.left);
    var canvas_y = parseInt(event.targetTouches[0].pageY - canvasLocation.top);

    upEvent(canvas_x, canvas_y);
}

function downEvent(canvas_x, canvas_y) {

    var canvas = document.getElementById("mazeCanvas");

    var x_offset = parseInt(canvas_x / 40);
    var y_offset = parseInt(canvas_y / 40) + 1;

    if ((canvas_x >= (40 * x_offset)) &&
        (canvas_x <= (40 * x_offset) + 18) &&
        (canvas_y >= (40 * y_offset) - 18) &&
        (canvas_y <= (40 * y_offset)) &&
        (canvas_x >= 22) &&
        (canvas_x < xLimit) &&
        (canvas_y < yLimit)) {

        if (!mousePressed) {
            // Store coordinates in selectIndex
            selectIndex = ((y_offset - 1) * columnCount + (x_offset - 1));

            var context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(x_offset * 40 - 2, y_offset * 40 - 22, 28, 28);

            context.font = highlightFont;
            context.fillStyle = selectColor;
            context.fillText(letters.charAt(selectIndex), x_offset * 40, y_offset * 40);

            mousePressed = true;

            // Add area around this alphabet for the current one
            offsetArrays.push(new Array((x_offset * 40) - 21, (y_offset * 40) - 40, (x_offset * 40) + 39, (y_offset * 40) + 22, selectIndex));

            // Look upwards - 12:00 hour hand
            var count = 1;
            var nextIndex = -1;

            while ((selectIndex - (columnCount * count)) >= 0) {

                nextIndex = (selectIndex - (columnCount * count));
                linearList.push(nextIndex);
                linearList["C" + nextIndex] = columnCount;

                count++;

                // Get x_index and y_index positions from nextIndex
                var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                // Add the rectangle on top of this to effect the same one
                offsetArrays.push(new Array(x_position, y_position - 40, x_position + 18, y_position - 18, nextIndex));
            }

            // Look sideways right upwards - 1:30 hour hand
            // Skip if you are at the last column in the row
            if (((selectIndex + 1) % columnCount) != 0) {
                count = 1;

                while ((selectIndex - ((columnCount - 1) * count)) > 0) {

                    nextIndex = (selectIndex - ((columnCount - 1) * count));
                    linearList.push(nextIndex);
                    linearList["C" + nextIndex] = columnCount - 1;

                    // Get x_index and y_index positions from nextIndex
                    var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                    var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                    // Add the rectangle on top right of this to effect the same one
                    offsetArrays.push(new Array(x_position + 13, y_position - 45, x_position + 45, y_position - 13, nextIndex));

                    // Break at the right boundary, we cannot move ahead from this point
                    if ((((selectIndex - ((columnCount - 1) * count)) + 1) % columnCount) == 0) {
                        break;
                    }

                    count++;
                }
            }

            // Walk right - 3:00 pm hour hand
            nextIndex = selectIndex + 1;
            while ((nextIndex % columnCount) > 0) {

                linearList.push(nextIndex);
                linearList["C" + nextIndex] = 1;

                // Get x_index and y_index positions from nextIndex
                var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                // Add the rectangle to the right of this to effect the same one
                offsetArrays.push(new Array(x_position + 19, y_position - 18, x_position + 39, y_position, nextIndex));

                nextIndex++;
            }

            // Look sideways right downwards - 4:30 hour hand
            // Skip if you are at the last column in the row
            if (((selectIndex + 1) % columnCount) != 0) {
                count = 1;

                while ((selectIndex + ((columnCount + 1) * count)) < mazeCount) {
                    nextIndex = (selectIndex + ((columnCount + 1) * count));
                    linearList.push(nextIndex);
                    linearList["C" + nextIndex] = columnCount + 1;

                    // Get x_index and y_index positions from nextIndex
                    var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                    var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                    // Add the rectangle to the bottom right of this to effect the same one
                    offsetArrays.push(new Array(x_position + 13, y_position - 5, x_position + 45, y_position + 26, nextIndex));

                    // Break at the right boundary, we cannot move ahead from this point
                    if ((((selectIndex + ((columnCount + 1) * count)) + 1) % columnCount) == 0) {
                        break;
                    }

                    count++;
                }
            }

            // Look downwards - 6:00 hour hand
            count = 1;

            while ((selectIndex + (columnCount * count)) < mazeCount) {
                nextIndex = (selectIndex + columnCount * count);
                linearList.push(nextIndex);
                linearList["C" + nextIndex] = columnCount;

                count++;

                // Get x_index and y_index positions from nextIndex
                var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                // Add the rectangle on bottom of this to effect the same one
                offsetArrays.push(new Array(x_position, y_position, x_position + 18, y_position + 23, nextIndex));
            }

            // Look sideways left downwards - 7:30 pm hour hand
            // Skip if you are at the first column in the row
            if ((selectIndex % columnCount) != 0) {
                count = 1;

                while ((selectIndex + ((columnCount - 1) * count)) < mazeCount) {
                    nextIndex = (selectIndex + ((columnCount - 1) * count));
                    linearList.push(nextIndex);
                    linearList["C" + nextIndex] = columnCount - 1;

                    // Get x_index and y_index positions from nextIndex
                    var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                    var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                    // Add the rectangle to the right of this to effect the same one
                    offsetArrays.push(new Array(x_position - 26, y_position - 5, x_position + 5, y_position + 26, nextIndex));

                    // Break at the left boundary, we cannot move ahead from this point
                    if ((nextIndex % columnCount) == 0) {
                        break;
                    }

                    count++;
                }
            }

            // Walk left - 9:00 pm hour hand
            // Skip walking left if you are at the 0th column position
            if ((selectIndex % columnCount) > 0) {
                nextIndex = selectIndex;

                do {
                    nextIndex--;
                    linearList.push(nextIndex);
                    linearList["C" + nextIndex] = 1;

                    // Get x_index and y_index positions from nextIndex
                    var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                    var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                    // Add the rectangle to the right of this to effect the same one
                    offsetArrays.push(new Array(x_position - 21, y_position - 18, x_position - 1, y_position, nextIndex));

                } while ((nextIndex % columnCount) > 0);
            }

            // Look sideways left upwards - 10:30 hour hand
            // Skip if you are at the first column in the row
            if ((selectIndex % columnCount) != 0) {
                count = 1;

                while ((selectIndex - ((columnCount + 1) * count)) >= 0) {
                    nextIndex = (selectIndex - ((columnCount + 1) * count));
                    linearList.push(nextIndex);
                    linearList["C" + nextIndex] = columnCount + 1;

                    // Get x_index and y_index positions from nextIndex
                    var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                    var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                    // Add the rectangle to the right of this to effect the same one
                    offsetArrays.push(new Array(x_position - 26, y_position - 45, x_position + 5, y_position - 13, nextIndex));

                    // Break at the left boundary, we cannot move ahead from this point
                    if ((nextIndex % columnCount) == 0) {
                        break;
                    }

                    count++;
                }
            }
        }
    }
}

function dragMoveEvent(canvas_x, canvas_y) {

    var canvas = document.getElementById("mazeCanvas");
    var x_offset = parseInt(canvas_x / 40);
    var y_offset = parseInt(canvas_y / 40) + 1;

    if ((canvas_x >= (40 * x_offset)) &&
        (canvas_x <= (40 * x_offset) + 18) &&
        (canvas_y >= (40 * y_offset) - 18) &&
        (canvas_y <= (40 * y_offset)) &&
        (canvas_x >= 22) &&
        (canvas_x < xLimit) &&
        (canvas_y < yLimit)) {

        var currentIndex = ((y_offset - 1) * rowCount + (x_offset - 1));

        if (linearList.includes(currentIndex)) {

            // Flush all prior highlights as user could be moving mouse in and out of current line
            for (var i = 0; i < resetList.length; i++) {

                var x_position = (parseInt(resetList[i] % columnCount) + 1) * 40;
                var y_position = (parseInt(resetList[i] / columnCount) + 1) * 40;

                var context = canvas.getContext("2d");
                context.fillStyle = "white";
                context.fillRect(x_position - 2, y_position - 22, 28, 28);

                context.font = fontIndices[resetList[i]];
                context.fillStyle = colorIndices[resetList[i]];
                context.fillText(letters.charAt(resetList[i]), x_position, y_position);
            }

            if (resetList.length > 0) {
                resetList = new Array();
            }

            // Find difference between currentIndex and selectIndex
            var difference = Math.abs(currentIndex - selectIndex);
            factor = linearList["C" + currentIndex];

            if (factor > 0) {
                var nextIndex = (currentIndex > selectIndex) ? selectIndex : currentIndex;
                var counter = 0;

                do {
                    counter += factor;

                    if (nextIndex != selectIndex) {
                        var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                        var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                        var context = canvas.getContext("2d");
                        context.fillStyle = "white";
                        context.fillRect(x_position - 2, y_position - 22, 28, 28);

                        context.font = highlightFont;
                        context.fillStyle = selectColor;
                        context.fillText(letters.charAt(nextIndex), x_position, y_position);

                        lastSelectedIndex = nextIndex;

                        resetList.push(nextIndex);
                    }

                    nextIndex += factor;
                } while (counter <= difference);
            }

            return;
        }
    } else {
        var foundOnLine = false;

        for (var i = 0; i < offsetArrays.length; i++) {
            // Check if user is dragging between letters on the line
            if ((canvas_x >= offsetArrays[i][0]) &&
                (canvas_x <= offsetArrays[i][2]) &&
                (canvas_y >= offsetArrays[i][1]) &&
                (canvas_y <= offsetArrays[i][3])) {

                foundOnLine = true;
                lastSelectedIndex = offsetArrays[i][4];

                // Flush all prior highlights as user could be moving mouse in and out of current line
                for (var i = 0; i < resetList.length; i++) {

                    var x_position = (parseInt(resetList[i] % columnCount) + 1) * 40;
                    var y_position = (parseInt(resetList[i] / columnCount) + 1) * 40;

                    var context = canvas.getContext("2d");
                    context.fillStyle = "white";
                    context.fillRect(x_position - 2, y_position - 22, 28, 28);

                    context.font = fontIndices[resetList[i]];
                    context.fillStyle = colorIndices[resetList[i]];
                    context.fillText(letters.charAt(resetList[i]), x_position, y_position);
                }

                if (resetList.length > 0) {
                    resetList = new Array();
                }

                // Find difference between currentIndex and selectIndex
                var difference = Math.abs(lastSelectedIndex - selectIndex);
                factor = linearList["C" + lastSelectedIndex];

                if (factor > 0) {
                    var nextIndex = (lastSelectedIndex > selectIndex) ? selectIndex : lastSelectedIndex;
                    var counter = 0;

                    do {
                        counter += factor;

                        if (nextIndex != selectIndex) {

                            var x_position = (parseInt(nextIndex % columnCount) + 1) * 40;
                            var y_position = (parseInt(nextIndex / columnCount) + 1) * 40;

                            var context = canvas.getContext("2d");
                            context.fillStyle = "white";
                            context.fillRect(x_position - 2, y_position - 22, 28, 28);

                            context.font = highlightFont;
                            context.fillStyle = selectColor;
                            context.fillText(letters.charAt(nextIndex), x_position, y_position);

                            resetList.push(nextIndex);
                        }

                        nextIndex += factor;
                    } while (counter <= difference);
                }

                break;
            }
        }
    }

    if (!foundOnLine) {
        // Flush all as we are somewhere outside the current valid line-paths
        for (var i = 0; i < resetList.length; i++) {

            var x_position = (parseInt(resetList[i] % columnCount) + 1) * 40;
            var y_position = (parseInt(resetList[i] / columnCount) + 1) * 40;

            var context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(x_position - 2, y_position - 22, 28, 28);

            context.font = fontIndices[resetList[i]];
            context.fillStyle = colorIndices[resetList[i]];
            context.fillText(letters.charAt(resetList[i]), x_position, y_position);
        }

        if (resetList.length > 0) {
            resetList = new Array();
        }
    }
}

function upEvent(canvas_x, canvas_y) {

    var canvas = document.getElementById("mazeCanvas");

    var x_offset = parseInt(canvas_x / 40);
    var y_offset = parseInt(canvas_y / 40) + 1;

    var canvas = document.getElementById("mazeCanvas");

    var x_offset = parseInt(canvas_x / 40);
    var y_offset = parseInt(canvas_y / 40) + 1;

    var releaseIndex = -1;

    if ((mousePressed) &&
        (canvas_x >= (40 * x_offset)) &&
        (canvas_x <= (40 * x_offset) + 18) &&
        (canvas_y >= (40 * y_offset) - 18) &&
        (canvas_y <= (40 * y_offset)) &&
        (canvas_x >= 22) &&
        (canvas_x < xLimit) &&
        (canvas_y < yLimit)) {

        // Store coordinates in releaseIndex
        releaseIndex = ((y_offset - 1) * columnCount + (x_offset - 1));
    }

    if ((releaseIndex == -1) && (lastSelectedIndex != -1) && (lastSelectedIndex != selectIndex)) {
        releaseIndex = lastSelectedIndex;
    }

    if ((releaseIndex != -1) && (selectIndex != -1)) {

        var lower = (selectIndex < releaseIndex) ? selectIndex : releaseIndex;
        var upper = (selectIndex < releaseIndex) ? releaseIndex : selectIndex;
 
        var lookup = lower + " " + upper;

        console.log("Trying to lookup " + lookup);

        // Check if we have a solution
        if (lookup in solution) {
            var foundWordIndex = solution[lookup];

            // Check if this word was previously found
            if (foundWords[foundWordIndex] > 0) {
                console.log("Found this word before");
            } else {
                var foundWord = words[foundWordIndex];
                foundWords[foundWordIndex] = factor;

                var index = selectIndex;

                if (releaseIndex < selectIndex) {
                    index = releaseIndex;
                }

                var count = 0;

                do {
                    colorIndices[index] = foundColor;
                    fontIndices[index] = selectFont;
                    index += factor;
                    count++;
                } while (count < foundWord.length);
            }
        }
    }

    mousePressed = false;

    if (selectIndex != -1) {
        resetList.push(selectIndex);
    }

    // Flush all prior highlights as user could be moving mouse in and out of current line
    for (var i = 0; i < resetList.length; i++) {

        var x_position = (parseInt(resetList[i] % columnCount) + 1) * 40;
        var y_position = (parseInt(resetList[i] / columnCount) + 1) * 40;

        var canvas = document.getElementById("mazeCanvas");
        var context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(x_position - 2, y_position - 22, 28, 28);

        context.font = fontIndices[resetList[i]];
        context.fillStyle = colorIndices[resetList[i]];
        context.fillText(letters.charAt(resetList[i]), x_position, y_position);
    }

    resetList = new Array();
    linearList = new Array();
    offsetArrays = new Array();
    selectIndex = -1;
    lastSelectedIndex = -1;
    factor = 0;
}

function checkCanvasForConsistency() {
    columnCount = parseInt(mazeCount / rowCount);
    var remainder = mazeCount % rowCount;

    if (remainder > 0) {
        alert("The maze grid is inexact. Expected letter count: " + (rowCount * columnCount));
        return;
    }
}

function normalizeInputWords() {

    for (var i = 0; i < inputWords.length; i++) {
        words.push(inputWords[i].replace(/[^A-Z]/g, ''));

        // Use 0 as the position for the found word
        // A non-zero value means this was found with a certain position
        foundWords.push(0);
    }
}

function solveMaze() {

    for (var i = 0; i < words.length; i++) {

        var wordLength = words[i].length;

        // TODO: Find words
        if (wordLength < 3) {
            alert("Two letter words are not permitted, " + words[i] + " will be skipped.");
            continue;
        }

        var firstChar = words[i].charAt(0);
        var secondChar = words[i].charAt(1);
        var wordFound = false;

        // Walk backwards, forwards is boring
        // There are no else clauses for the if, because we might find multiple occurences of
        // the same word in the word matrix. We will index every one but the user can find the first
        // one and claim the finding. You can include the same word twice in the words to find list,
        // and ensure both get searched and found.
        for (var j = mazeCount - 1; j >= 0; j--) {

            // Check if the current alphabet is same as words[i].charAt(0);
            if (letters.charAt(j) == firstChar) {

                // Check eight ways around this character
                if (((parseInt(j / columnCount) + 1 - wordLength) >= 0) &&
                    (letters.charAt(j - columnCount) == secondChar)) {

                    // Find if we are eligible for a 12:00 hour hand walk
                    wordFound = findWord(1, j, i, wordLength);
                }

                if ((((j % columnCount) + wordLength) <= columnCount) &&
                    ((parseInt(j / columnCount) + 1 - wordLength) >= 0) &&
                    (letters.charAt(j - columnCount + 1) == secondChar)) {

                    // Eligible for a 1:30 hour hand walk
                    wordFound = findWord(2, j, i, wordLength);
                }

                if ((((j % columnCount) + wordLength) <= columnCount) &&
                    (letters.charAt(j + 1) == secondChar)) {

                    // Eligible for a 3:00 hour hand walk
                    wordFound = findWord(3, j, i, wordLength);
                }

                if ((((j % columnCount) + wordLength) <= columnCount) &&
                    ((parseInt(j / columnCount) + wordLength) <= rowCount) &&
                    (letters.charAt(j + columnCount + 1) == secondChar)) {

                    // Eligible for a 4:30 hour hand walk
                    wordFound = findWord(4, j, i, wordLength);
                }

                if (((parseInt(j / columnCount) + wordLength) <= rowCount) &&
                    (letters.charAt(j + columnCount) == secondChar)) {

                    // Eligible for a 6:00 hour hand walk
                    wordFound = findWord(5, j, i, wordLength);
                }

                if ((((j % columnCount) + 1) >= wordLength) &&
                    ((parseInt(j / columnCount) + wordLength) <= rowCount) &&
                    (letters.charAt(j + columnCount - 1) == secondChar)) {

                    // Eligible for a 7:30 hour hand walk
                    wordFound = findWord(6, j, i, wordLength);
                }

                if ((((j % columnCount) + 1) >= wordLength) &&
                    (letters.charAt(j - 1) == secondChar)) {

                    // Eligible for a 9:00 hour hand walk
                    wordFound = findWord(7, j, i, wordLength);
                }

                if ((((j % columnCount) + 1) >= wordLength) &&
                    ((parseInt(j / columnCount) + 1 - wordLength) >= 0) && (letters.charAt(j - columnCount - 1) == secondChar)) {

                    // Eligible for a 10:30 hour hand walk
                    wordFound = findWord(8, j, i, wordLength);
                }
            }
        }
    }
}

function findWord(direction, index, wordIndex, wordLength) {

    var wordFound = false;
    var word = words[wordIndex];

    var checkNext = true;
    var nextIndex = 2;
    var counter = 0;

    switch (direction) {
        case 1:
            counter = index - (columnCount * 2);
            break;

        case 2:
            counter = index - (columnCount * 2) + 2;
            break;

        case 3:
            counter = index + 2;
            break;

        case 4:
            counter = index + (columnCount * 2) + 2;
            break;

        case 5:
            counter = index + (columnCount * 2);
            break;

        case 6:
            counter = index + (columnCount * 2) - 2;
            break;

        case 7:
            counter = index - 2;
            break;

        case 8:
            counter = index - (columnCount * 2) - 2;
            break;
    }

    do {
        if (letters.charAt(counter) == word.charAt(nextIndex)) {
            nextIndex++;

            if (nextIndex == wordLength) {
                wordFound = true;
                checkNext = false;

                var lower = (counter < index) ? counter : index;
                var upper = (counter < index) ? index : counter;
 
                solution[lower + " " + upper] = wordIndex;
                console.log("Adding " + lower + " " + upper + " for " + words[solution[lower + " " + upper]]);
                /*
                solution[counter + " " + index] = word;
                solution[index + " " + counter] = word;
                */
            }

            switch (direction) {
                case 1:
                    counter -= columnCount;
                    break;

                case 2:
                    counter -= (columnCount - 1);
                    break;

                case 3:
                    counter++;
                    break;

                case 4:
                    counter += (columnCount + 1);
                    break;

                case 5:
                    counter += columnCount;
                    break;

                case 6:
                    counter += (columnCount - 1);
                    break;

                case 7:
                    counter--;
                    break;

                case 8:
                    counter -= (columnCount + 1);
                    break;
            }
        } else {
            checkNext = false;
        }
    } while (checkNext);

    return wordFound;
}
