const BLACK = '#000000';
const WHITE = '#FFFFFF';
const INITIAL_SIZE = 16;

const canvas = document.querySelector('.draw-grid');
const black_btn = document.querySelector('#black');
const color_slider = document.querySelector('#brush-color');
const rainbow_btn = document.querySelector('#rainbow');
const eraser_btn = document.querySelector('#eraser');
const reset_btn = document.querySelector('#reset');
const grid_size = document.querySelector('#grid-size');
const grid_size_label = document.querySelector('#size-label');
const download_btn = document.querySelector('#download');
const dl_interface = document.querySelector('#grid-option');
const grid_options = document.querySelector('#grid-option').querySelectorAll('button');
const buttons = document.querySelectorAll('button');

let current_color = BLACK;
let background_color = WHITE;
let rainbow_mode = false;

let mouse_down = false;
document.addEventListener('mousedown', () => mouse_down = true);
document.addEventListener('mouseup', () => mouse_down = false);

black_btn.addEventListener('click', () => {
    current_color = BLACK;
    color_slider.value = current_color;
    rainbow_mode = false;
    clearButtons();
    black_btn.classList.add('active');
});

color_slider.addEventListener('input', (e) => {
    current_color = e.srcElement.value;
    rainbow_mode = false;
    clearButtons();
});

rainbow_btn.addEventListener('click', () => {
    rainbow_mode = true;
    clearButtons();
    rainbow_btn.classList.add('active');
});

eraser_btn.addEventListener('click', () => {
    current_color = background_color;
    color_slider.value = current_color;
    rainbow_mode = false;
    clearButtons();
    eraser_btn.classList.add('active');
});

reset_btn.addEventListener('click', () => {
    resetGrid();
    current_color = BLACK;
    color_slider.value = current_color;
    rainbow_mode = false;
    clearButtons();
    black_btn.classList.add('active');
});

grid_size.addEventListener('input', (e) => {
    const size = e.srcElement.value;
    createGrid(size);
    grid_size_label.textContent = `${size} X ${size}`;
});

download_btn.addEventListener('click', () => {
    dl_interface.classList.add('active-dl');
    
});

grid_options.forEach((button) => (button).addEventListener('click', (e) => {
    if (e.srcElement.id == "yes") removeGridLines();
    html2canvas(canvas).then(canvas => {
        let img = canvas.toDataURL();
        downloadURL(img, "Image.png")
    });
    dl_interface.classList.remove('active-dl');
    replaceGridLines();
})
);

function downloadURL(url, name) {
    // Creates a dynamic link that removes itself
    let link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function clearButtons() {
    buttons.forEach((button) => button.classList.remove('active'));
}

function getRandomColor() {
    let chars = '0123456789ABCDEF';
    let col = '#';
    for (let i = 0; i < 6; i++) {
        col += chars[Math.floor(Math.random() * 16)];
    } 
    return col;
}

function createGrid(size) {
    const grid = document.querySelector(".draw-grid");
    grid.style["grid-template-rows"] = `repeat(${size}, 1fr)`;
    grid.style["grid-template-columns"] = `repeat(${size}, 1fr)`;

    grid.replaceChildren();
    for (let i = 0; i < size * size; i++) {
        let div = document.createElement('div');
        div.classList.add('grid-item');
        div.style['background-color'] = WHITE;
        div.addEventListener('mouseenter', pixelDrawHover);
        div.addEventListener('mousedown', pixelDraw);
        grid.appendChild(div);
    }
}

function pixelDrawHover(e) {
    if (mouse_down) pixelDraw(e);   
}

function pixelDraw(e) {
    if (rainbow_mode) {
        current_color = getRandomColor();
        e.srcElement.style["background-color"] = current_color;   
        color_slider.value = current_color;
    }
    e.srcElement.style["background-color"] = current_color;   
}

function resetGrid(e) {
    const cells = canvas.querySelectorAll('*');
    cells.forEach((cell) => {
        cell.style["background-color"] = background_color;
    });
}

function removeGridLines() {
    const cells = canvas.querySelectorAll('*');
    cells.forEach((cell) => {
        cell.classList.add('no-lines');
    })
}

function replaceGridLines() {
    const cells = canvas.querySelectorAll('*');
    cells.forEach((cell) => {
        cell.classList.remove('no-lines');
    })
}

black_btn.classList.add('active');
createGrid(grid_size.value);