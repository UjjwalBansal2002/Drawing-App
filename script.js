const canvas = document.querySelector('canvas'),
    toolBtns = document.querySelectorAll('.tool'),
    fillColor = document.querySelector('#fill-color'),
    sizeSlider = document.querySelector('#size-slider'),
    size = document.querySelector('#size'),
    colorBtns = document.querySelectorAll('.colors .option'),
    colorPicker = document.querySelector('#color-picker'),
    clearCanvas = document.querySelector('.clear-canvas'),
    saveImg = document.querySelector('.save-img'),
    ctx = canvas.getContext("2d");

const drawRect = (e) => {
    if (!fillColor.checked) {

        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle

    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));

    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);// creating circle according to the mouse pointer

    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill cilcle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);// creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);// creating bottom line of the triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically

    fillColor.checked ? ctx.fill() : ctx.stroke()
}
// global variables with default value

let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    sellectedColor = "#000"

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = sellectedColor;// setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // Setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground()
})

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath();// to start a drawing from new point
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = sellectedColor;
    ctx.fillStyle = sellectedColor;
    // copying canvas data & passing as snapshot value.. this avoids dragging the image 
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)

}

const drawing = (e) => {
    if (!isDrawing) return;// if drawing is false return from here

    ctx.putImageData(snapshot, 0, 0);// adding copied canvas data on this canvas

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : sellectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke();// drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        //removing active class from the previous option and adding on current clicked options
        document.querySelector(".options .act").classList.remove("act");
        btn.classList.add('act')
        selectedTool = btn.id;
        console.log(selectedTool);
    })
})
sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value
    size.innerHTML = sizeSlider.value

}); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add('selected')
        sellectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click()
})

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground()
})

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");// Creating <a> element
    link.download = `${Date.now()}.jpg`;// passing current date as link download value
    link.href = canvas.toDataURL();// passing canvasData as link href value
    link.click();// clicking link to download image
})

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => isDrawing = false);