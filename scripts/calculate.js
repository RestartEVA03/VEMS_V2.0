/*

В данном пакете, все функции принимают но вход приемущественно объекты типа Spin
Стараться избегать передачу каких либо параметров, по типу: флаги и остальное
Вся логика работы должна быть в EventListner 
Структура объектов в Spin, Grid

*/


function distance_between_points(point1, point2) {
    return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[2] - point1[2], 2));
}

function vector_mult(spin1, spin2) {
    return spin1.dir.x * spin2.dir.x + spin1.dir.y * spin2.dir.y + spin1.dir.z * spin2.dir.z;
}

function magnetization(spins) {
    let def_M = {
        "x": spins.reduce((part_sum, spin) => part_sum + spin.dir.x, 0),
        "y": spins.reduce((part_sum, spin) => part_sum + spin.dir.y, 0),
        "z": spins.reduce((part_sum, spin) => part_sum + spin.dir.z, 0)
    },
    M = Math.sqrt(def_M.x * def_M.x + def_M.y * def_M.y + def_M.z * def_M.z) / (spins.length);

    return Math.abs(M);
}

function external_field(spins, def_dir, h) {
    let time = window.performance.now()
    let energy = spins.reduce((part_sum, spin) => part_sum + vector_mult(spin, def_dir), 0.)
    console.log("external_field: ", window.performance.now() - time)
    return h * energy;
}

function anisotropy(spins, def_dir, a) {
    let time = window.performance.now()
    let energy = spins.reduce((part_sum, spin) => part_sum + Math.pow(vector_mult(spin, def_dir), 2), 0.)
    console.log("anisotropy: ", window.performance.now() - time)
    return a * energy;
};


function exchange(spins, d) {
    let time = window.performance.now()
    let energy = 0.;
    for (let spin of spins){
        energy += spin.neighbors.reduce((part_sum, neighbor) => part_sum + vector_mult(spin, neighbor), 0.);
    }
    console.log("exchange: ", window.performance.now() - time)
    return d * energy;
}

function dipol_dipol(spins, d) {
    let energy = 0.;
    let time = window.performance.now()
    for (let i = 0; i < spins.length; i++) {
        for (let j = i + 1; j < spins.length; j++) {
            let r = distance_between_points(spins[i].pos_array, spins[j].pos_array);
            let r_vect = new Spin([0,0,0],[spins[i].dir.x - spins[j].dir.x,
                                           spins[i].dir.y - spins[j].dir.y,
                                           spins[i].dir.z - spins[j].dir.z]);
            energy += (vector_mult(spins[i], spins[j]) / Math.pow(r, 3) - 3 * ((vector_mult(spins[i], r_vect) * vector_mult(spins[j], r_vect)) / Math.pow(r, 5)));
        }
    }
    console.log("dipol_dipol: ", window.performance.now() - time)
    return d * energy
}