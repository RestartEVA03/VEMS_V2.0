
function distance_between_points(point1, point2){
    return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[2] - point1[2], 2));
}

//Перенести в другой пакет-------------------------------------------------------------------------------

class Spin{

    pos = {x: null, y: null, z: null}
    dir = {x: null, y: null, z: null}
    length = 0
    neighbors = []
    __xy_weight = 0

    constructor(spin_pos, spin_dir){
        if (typeof spin_pos.isArray && typeof spin_dir.isArray){
            this.pos = {x: spin_pos[0], y: spin_pos[1], z: spin_pos[2]};
            this.dir = {x: spin_dir[0], y: spin_dir[1], z: spin_dir[2]};                                                                                            // решил just for fun сделать расчёт длины вектора через map и reduce, считает правильно, но читается ...            
            this.length = Math.sqrt((spin_pos[0]+spin_dir[0])**2 + (spin_pos[1]+spin_dir[1])**2 + (spin_pos[2]+spin_dir[2])**2)                                     // this.length = Math.sqrt(spin_pos.map((x, i) => (x + spin_dir[i])**2).reduce((accumulator, currentValue) => accumulator + currentValue, 0));
            this.__xy_weight = spin_pos[0] + spin_pos[1]
        } else {
            throw new Error("Spin position must be a List");
        } 
    }

    get weight(){
        return this.__xy_weight
    }

    get pos_array(){
        return Object.values(this.pos)
    }

    get dir_array(){
        return Object.values(this.dir)
    }
}

class Grid{

    static default_length = 100;
    static default_width = 100;

    static default_distance_between_spins = 2;

    constructor(spins, spin_radius = Grid.default_distance_between_spins){
        if (spins[0] instanceof Spin && spins.length != 0){
            this.spins_count = spins.length;
            this.spins = spins;
            this.#init_camera_pos();
            this.spin_radius = spin_radius;
        } else {
            throw new Error("Grid must be an array of Spins");
        }
    }

    #init_camera_pos(){
        let weight = [...this.spins.map(spin => spin.weight)]

        let max_pos = this.spins[weight.indexOf(Math.max(...weight))].pos_array,
            min_pos = this.spins[weight.indexOf(Math.min(...weight))].pos_array;

        let camera_x = (max_pos[0] + min_pos[0]) / 2,
            camera_y = (max_pos[1] + min_pos[1]) / 2;

        console.log("Initial CAMETA_POSITION:", camera_x, camera_y, 0);

        webglspins.updateOptions({cameraLocation: [camera_x, camera_y, Math.sqrt(this.spins_count) * Grid.default_distance_between_spins],
                                  centerLocation: [ camera_x,  camera_y, 0]});

    }

    static create_grid_rnd(grid_size){
        if (Number.isInteger(grid_size)){
            let iteration = 0;
            let spins = [];
            for (let e = 0; e < Math.sqrt(grid_size); e++){
                for (let i = 0; i < Math.sqrt(grid_size); i++) {
                    for (let j = 0; j < Math.sqrt(grid_size); j++) {
                        let pos = [i * this.default_distance_between_spins, e*this.default_distance_between_spins, j * this.default_distance_between_spins];
                        let dir = [Math.sin(.3 * i) * Math.cos(.05 * (e + iteration)),
                                   Math.cos(.3 * i) * Math.cos(.05 * (e + iteration)),
                                   Math.sin(.05 * (e + iteration))];
                        spins.push(new Spin(pos, dir));
                        iteration++;
                    }
                }
            }
            return new Grid(spins)
        } else {
            throw new Error("Grid size must be a number");
        }
    }

    init_spins_neighbors(){
        if (this.spins == undefined) {
            throw new Error("Spins undefined");
        } 

        for (let spin of this.spins){
            let best_dist = 0
            for (let spin_2 of this.spins){
                let dist = distance_between_points(spin.pos_array, spin_2.pos_array);
                if (dist <= this.spin_radius && spin != spin_2){
                    spin.neighbors.push(spin_2);
                }
            }
        }
    }

    get spins_pos(){
        return Array.prototype.concat(...this.spins.map(spin => spin.pos_array))
    }

    get spins_dir(){
        return Array.prototype.concat(...this.spins.map(spin => spin.dir_array))
    }

}

var webglspins = new WebGLSpins(document.getElementById("webgl-canvas"));


var grid = Grid.create_grid_rnd(10)
grid.init_spins_neighbors();
console.log(grid.spins[10].neighbors);
webglspins.updateSpins(grid.spins_pos, grid.spins_dir);
