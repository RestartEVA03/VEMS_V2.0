function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function get_extremum(){
    let arr = {};
    for (let axis of ['x', 'y', 'z']){
        arr[axis] = {};
        for (let ext of ['max','min']){
            arr[axis][ext] = parseFloat(document.getElementById('display_layer_'+axis+'_'+ext).value);
        }
    }
    return arr
}