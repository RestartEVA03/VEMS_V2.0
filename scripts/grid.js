class Grid{

    static default_length = 100;
    static default_width = 100;

    static default_distance_between_spins = 2;

    min_spin_radius = Infinity;
    spins_count = 0;
    spins = [];

    magnetization = 0;
    energy = {
        "dipol_dipol": 0, 
        "anisotropy": 0,
        "external_field": 0,
        "exchange": 0
    };

    mu_coef = 1;
    cameraLocation = []

    constructor(spins, normalize = 0){
        if (spins[0] instanceof Spin){
            this.spins_count = spins.length;
            this.spins = spins;
            this.#init_min_spin_radius();
            if (normalize == 1) {
                this.#normalize();
                console.log(this.spins);
            }
            this.#config();
            this.#init_camera_pos();
        } else {
            throw new Error("Grid must be an array of Spins");
        }
    }

    get spins_pos(){
        return Array.prototype.concat(...this.spins.map(spin => spin.pos_array))
    }

    get spins_dir(){
        return Array.prototype.concat(...this.spins.map(spin => spin.dir_array))
    }

    #init_min_spin_radius(){
        for (var spin of this.spins){
            for (var spin_2 of this.spins){
                var dist = distance_between_points(spin.pos_array, spin_2.pos_array);
                if (dist <  this.min_spin_radius && spin != spin_2){
                    this.min_spin_radius = dist;
                }
            }
        }
    }

    #init_camera_pos(){
        var weight = [...this.spins.map(spin => spin.weight)]

        // console.log(this.spins);

        var max_pos = this.spins[weight.indexOf(Math.max(...weight))].pos_array,
            min_pos = this.spins[weight.indexOf(Math.min(...weight))].pos_array;

        var camera_x = (max_pos[0] + min_pos[0]) / 2,
            camera_y = (max_pos[1] + min_pos[1]) / 2;

        this.cameraLocation = [camera_x, camera_y, Math.sqrt(this.spins_count) * 2];
    }

    #config(){
        if (this.spins == undefined) {
            throw new Error("Spins undefined");
        } 

        for (var spin of this.spins){
            for (var spin_2 of this.spins){
                var dist = distance_between_points(spin.pos_array, spin_2.pos_array);
                if (dist <= this.min_spin_radius && spin != spin_2){
                    spin.neighbors.push(spin_2);
                }
            }
        }

    }

    #normalize(){
        let min_spin_lenght = Math.min(...this.spins.map(spin => spin.length))
        console.log("min_spin_lenght: ",min_spin_lenght);
        console.log("this.min_spin_radius: ",this.min_spin_radius);
        for (var spin of this.spins){
            spin.pos.x = spin.pos.x / min_spin_lenght  * this.mu_coef;
            spin.pos.y = spin.pos.y / min_spin_lenght  * this.mu_coef;
            spin.pos.z = spin.pos.z / min_spin_lenght  * this.mu_coef;
            spin.dir.x = spin.dir.x / this.min_spin_radius * this.mu_coef;
            spin.dir.y = spin.dir.y / this.min_spin_radius * this.mu_coef;
            spin.dir.z = spin.dir.z / this.min_spin_radius * this.mu_coef;
        }
    }

    set_mu_coef(mu_coef){
        this.mu_coef = mu_coef;
    }

    static create_izing(grid_size){
        if (Number.isInteger(grid_size)){
            var iteration = 0;
            var spins = [];
            for (var e = 0; e < Math.sqrt(grid_size); e++){
                for (var i = 0; i < Math.sqrt(grid_size); i++) {
                    for (var j = 0; j < Math.sqrt(grid_size); j++) {
                        var pos = [i * this.default_distance_between_spins, e*this.default_distance_between_spins, j * this.default_distance_between_spins];
                        var dir = [0, 0, 0 === Math.floor(2 * Math.random()) ? -1 : 1];
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

    static create_grid_rnd(grid_size){
        if (Number.isInteger(grid_size)){
            var iteration = 0;
            var spins = [];
            for (var e = 0; e < Math.sqrt(grid_size); e++){
                for (var i = 0; i < Math.sqrt(grid_size); i++) {
                    for (var j = 0; j < Math.sqrt(grid_size); j++) {
                        var pos = [i * this.default_distance_between_spins, e*this.default_distance_between_spins, j * this.default_distance_between_spins];
                        var dir = [Math.sin(.3 * i) * Math.cos(.05 * (e + iteration)),
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
}