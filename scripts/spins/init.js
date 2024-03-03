class Spin{
    constructor(spin_pos, spin_dir){
        if (typeof spin_pos.isArray && typeof spin_dir.isArray){
        this.pos = spin_pos;
        this.dir = spin_dir;
        // решил just for fun сделать расчёт длины вектора через map и reduce, считает правильно, но читается ...
        // this.length = Math.sqrt(spin_pos.map((x, i) => (x + spin_dir[i])**2).reduce((accumulator, currentValue) => accumulator + currentValue, 0));
        this.length = Math.sqrt((spin_pos[0]+spin_dir[0])**2 + (spin_pos[1]+spin_dir[1])**2 + (spin_pos[2]+spin_dir[2])**2)
        this.__xy_weight = spin_pos[0] + spin_pos[1]
        } else {
            throw new Error("Spin position must be a List");
        } 
    }

    get weight(){
        return this.__xy_weight
    }

}

class Grid{

    static default_length = 100;
    static default_width = 100;

    static default_distance_between_spins = 2;

    constructor(spins){
        if (spins[0] instanceof Spin && spins.length != 0){
            this.spins_count = spins.length;
            this.spins = spins;
            this.#init_camera_pos();
        } else {
            throw new Error("Grid must be an array of Spins");
        }
    }

    #init_camera_pos(){
        let weight = [...this.spins.map(spin => spin.weight)]

        let max_pos = this.spins[weight.indexOf(Math.max(...weight))].pos,
            min_pos = this.spins[weight.indexOf(Math.min(...weight))].pos;

        let camera_x = (max_pos[0] + min_pos[0]) / 2,
            camera_y = (max_pos[1] + min_pos[1]) / 2;

        console.log("Initial CAMETA_POSITION:", camera_x, camera_y, 0);

        webglspins.updateOptions({cameraLocation: [camera_x, camera_y, Math.sqrt(this.spins_count) * 2],
                                  centerLocation: [ camera_x,  camera_y, 0]});

    }

    static create_grid_rnd(grid_size){
        if (Number.isInteger(grid_size)){
            
            let iteration = 0;
            let spins = [];

            for (let e = 0; e < Math.sqrt(grid_size); e++)
                for (let i = 0; i < Math.sqrt(grid_size); i++) {

                    let pos = [i * this.default_distance_between_spins, e*Grid.default_distance_between_spins, 0];
                    let dir = [Math.sin(.3 * i) * Math.cos(.05 * (e + iteration)),
                               Math.cos(.3 * i) * Math.cos(.05 * (e + iteration)),
                               Math.sin(.05 * (e + iteration))];

                    spins.push(new Spin(pos, dir));
                    iteration++;
                }

            return new Grid(spins)

        } else {
            throw new Error("Grid size must be a number");
        }
    }

    get spins_pos(){
        return Array.prototype.concat(...this.spins.map(spin => spin.pos))
    }

    get spins_dir(){
        return Array.prototype.concat(...this.spins.map(spin => spin.dir))
    }
}


var spin1 = new Spin([0,0,0], [0,10, -2]);
// var spin2 = new Spin([2, 0, 0], [0.27590760744291654, 0.8919342876598102, -0.35822928223682704]);
// var spin3 = new Spin([4, 0, 0], [0.27590760744291654, 0.8919342876598102, -0.35822928223682704]);
var webglspins = new WebGLSpins(document.getElementById("webgl-canvas"));

// var grid = new Grid([spin1, spin2, spin3])

var grid = Grid.create_grid_rnd(100)

webglspins.updateSpins(grid.spins_pos, grid.spins_dir);
