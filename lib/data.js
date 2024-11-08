const filename = 'data.txt';
let content;


module.exports = {
    save,
    read,
    push,
    add,
    del,
    all_data
}


function read(vid) {
    return content[vid];
}


function all_data() {
    return content;
}

function save(vid, obj, p = true) {
    content[vid] = obj;

    if (p) {
        push();
    }
}

function del(vid, p = true) {
    delete content[vid];
    
    if (p) {
        push();
    }
}

function push() {
    const str = JSON.stringify(content);
    require('fs').writeFileSync(filename, str);
}




// Utility functions

function add(vid, n) {

    const p = content[vid] || 0;

    if (typeof p === 'number' && !Number.isNaN(p)) {
        save(vid, p + n);
    }
}





// Initialization

(() => {
    const str = require('fs').readFileSync(filename, 'utf8');
    content = JSON.parse(str);
})();