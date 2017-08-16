// let configs = JSON.parse(configs);

// TODO:
// Are some listDefaults incompatible with some view types?
// type: ContactsButton?
// Click on end-of-line item to display acceptable values (types)
// Resize column based on longest string?
// Create column holders beforehand?
// Description on hover?
// Copyable JSON output below?

let columns = 1;
let html = document.querySelector('html');
let body = document.querySelector('body');
let main = document.getElementById('main');
let fontSize = window.getComputedStyle(body).getPropertyValue('font-size').slice(0, -2);
const LETTER_WIDTH = fontSize * 0.7;

main.addEventListener('click', (e) => {
    e.preventDefault();
    let active = e.target;
    // If the clicked element is the end of the line, return
    if (typeof active.contents !== 'object') return;

    // Remove the 'active' class from all items in clicked column,
    // Add it to the clicked item
    let activeSibs = active.parentNode.children;
    for (let i = 0; i < activeSibs.length; i++) {
        activeSibs[i].classList.remove('active');
    }
    active.classList.add('active');

    // If next column exists, clear next columns
    let activeColumn = active.parentNode.parentNode;
    let children = main.childNodes;
    while (children[children.length - 1].id > parseInt(activeColumn.id)) {
        main.removeChild(main.lastChild);
    }

    // Create next column
    columns = parseInt(activeColumn.id) + 1;
    populateColumn(active.contents, columns, active); // TODO: Just pass in active, figure out how to handle it in initial call to populateColumn
});

populateColumn(configs, columns);

function populateColumn(level, count, clicked) {
    // Create a column div and ul
    // Id matches the column count, style column
    let listColumn = newElement('div', main, ['two', 'columns', 'col-div'], count);
    let list = newElement('ul', listColumn);

    let len = 0;

    for (let property in level) {
        // Add each item to the column, style it
        let item = newElement('li', list, ['item'])

        // Populate items' text with properties at current object depth
        item.innerHTML = property;
        if (Array.isArray(level)) {
            let parent = clicked.innerHTML;
            let parentText = parent.slice(0, parent.indexOf(' (Array)'));
            if (level[property].type) {
                let type = Object.keys(level[property].type)
                item.innerHTML = `component (${type})`;
            } else {
                item.innerHTML = `(${parentText} item)`;
            }
            listColumn.classList.add('col-array');
        }
        if (level[property] && typeof level[property] === 'object') {
            // If there's more depth, style item to let user know that
            item.classList.add('object');
            // Put object's contents onto the item node
            item.contents = level[property];
            if (Array.isArray(item.contents)) {
                item.innerHTML += ' (Array)';
                item.classList.add('array');
            }
        } else {
            // TODO: Replace actual values with value types
            // item.innerHTML += `: ${level[property]}`;
            if (!level[property]) {
                item.innerHTML = `"${item.innerHTML}"`;
                item.classList.add('options')
            }
        }

        // Set minimum column width to the longest string in column
        let configTextLength = item.innerHTML.length;
        if (configTextLength > len) {
            len = configTextLength;
            let itemPadding = window.getComputedStyle(item).getPropertyValue('padding-left').slice(0, -2);
            listColumn.style.width = Math.floor(len * LETTER_WIDTH) + (itemPadding * 2) + 'px';
            listColumn.style.minWidth = '50px';
        }
    }
}

function newElement(tag, parent=document.body, classes, id) {
    let newElement = document.createElement(tag);
    parent.appendChild(newElement);
    if (classes) {
        for (let className in classes) {
            newElement.classList.add(classes[className]);
        }
    }
    if (id) {
        newElement.id = id;
    }
    return newElement;
}
