class Grid{

    static default_distance_between_spins = 2;

    min_spin_radius = Infinity;
    min_spin_lenght = NaN;
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
        for (let spin of this.spins){
            for (let spin_2 of this.spins){
                let dist = distance_between_points(spin.pos_array, spin_2.pos_array);
                if (dist <  this.min_spin_radius && spin != spin_2){
                    this.min_spin_radius = dist;
                }
            }
        }
    }

    #init_camera_pos(){
        let weight = [...this.spins.map(spin => spin.weight)]

        let max_pos = this.spins[weight.indexOf(Math.max(...weight))].pos_array,
            min_pos = this.spins[weight.indexOf(Math.min(...weight))].pos_array;

        let camera_x = (max_pos[0] + min_pos[0]) / 2,
            camera_y = (max_pos[1] + min_pos[1]) / 2;

        this.cameraLocation = [camera_x, camera_y, Math.sqrt(this.spins_count) * 2];
    }

    #config(){
        if (this.spins == undefined) {
            throw new Error("Spins undefined");
        } 

        for (let spin of this.spins){
            for (let spin_2 of this.spins){
                let dist = distance_between_points(spin.pos_array, spin_2.pos_array);
                if (dist <= this.min_spin_radius && spin != spin_2){
                    spin.neighbors.push(spin_2);
                }
            }
        }

    }

    #normalize(){
        this.min_spin_lenght  = Math.min(...this.spins.map(spin => spin.length))
        let f = false;

        if (Math.min(Math.min(...this.spins.map(spin => spin.pos.z))) < 0.01 && Math.min(Math.min(...this.spins.map(spin => spin.pos.z))) >= 0){
            f = true;
        }

        for (let spin of this.spins){
            spin.pos.x = spin.pos.x / this.min_spin_lenght  * this.mu_coef;
            spin.pos.y = spin.pos.y / this.min_spin_lenght  * this.mu_coef;
            spin.pos.z = spin.pos.z / this.min_spin_lenght  * this.mu_coef;
            if (f == true){
            spin.dir.x = spin.dir.x  * this.mu_coef / this.min_spin_radius;
            spin.dir.y = spin.dir.y  * this.mu_coef / this.min_spin_radius;
            spin.dir.z = spin.dir.z  * this.mu_coef / this.min_spin_radius;
            }
        }
    }

    init_extremum(){
        let sort_x = Array.from(new Set([...this.spins.map(spin => spin.pos.x)].sort()));
        let sort_y = Array.from(new Set([...this.spins.map(spin => spin.pos.y)].sort()));
        let sort_z = Array.from(new Set([...this.spins.map(spin => spin.pos.z)].sort()));
 
        // document.getElementById('display_layer_x_min').options[0] = sort_x[0];
        // Инициализация граней решётки
        // for (let axis of ['x', 'y', 'z']){
        for (let ind in sort_x){
            let val = sort_x[ind];
            document.getElementById('display_layer_x_min').options[ind] = new Option(val,val);
            document.getElementById('display_layer_x_max').options[sort_x.length-ind-1] = new Option(val,val);
        }
        for (let ind in sort_y){
            let val = sort_y[ind];
            document.getElementById('display_layer_y_min').options[ind] = new Option(val,val);
            document.getElementById('display_layer_y_max').options[sort_y.length-ind-1] = new Option(val,val);
        }
        for (let ind in sort_z){
            let val = sort_z[ind];
            document.getElementById('display_layer_z_min').options[ind] = new Option(val,val);
            document.getElementById('display_layer_z_max').options[sort_z.length-ind-1] = new Option(val,val);
        }
        document.getElementById('display_layer_x_max').value=sort_x[sort_x.length-1]
        document.getElementById('display_layer_y_max').value=sort_y[sort_y.length-1]
        document.getElementById('display_layer_z_max').value=sort_z[sort_z.length-1]
            // document.getElementById('display_layer_'+axis+'_min').value = Math.min(...[...this.spins.map(spin => spin.pos[axis])]);
            // document.getElementById('display_layer_'+axis+'_max').value = Math.max(...[...this.spins.map(spin => spin.pos[axis])]);
        // }

    }

    set_mu_coef(mu_coef){
        this.mu_coef = mu_coef;
    }

    static create_izing(grid_size = Number(document.getElementById('initN').value)){
        if (Number.isInteger(grid_size)){
            let iteration = 0;
            let spins = [];
            for (let e = 0; e < Math.sqrt(grid_size); e++){
                for (let i = 0; i < Math.sqrt(grid_size); i++) {
                    for (let j = 0; j < Math.sqrt(grid_size); j++) {
                        let pos = [i * this.default_distance_between_spins, e*this.default_distance_between_spins, j * this.default_distance_between_spins];
                        let dir = [0, 0, 0 === Math.floor(2 * Math.random()) ? -1 : 1];
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

    static create_grid_rnd(grid_size = Number(document.getElementById('initN').value)){
        if (Number.isInteger(grid_size)){
            let iteration = 0;
            let spins = [];
            for (let e = 0; e < Math.sqrt(grid_size); e++){
                for (let i = 0; i < Math.sqrt(grid_size); i++) {
                    for (let j = 0; j < Math.sqrt(grid_size); j++) {
                        let pos = [i * this.default_distance_between_spins, e*this.default_distance_between_spins, j * this.default_distance_between_spins];
                        let dir = [Math.sin(.3 * i) * Math.cos(.05 * (e + iteration)),
                                   Math.cos(.3 * i) * Math.cos(.05 * (e + iteration)),
                                   Math.sin(0.05 * (e + iteration))];
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

    static create_ferromagnetic(grid_size = Number(document.getElementById('initN').value)){
        if (Number.isInteger(grid_size)){
            let spins = [];
            for (var x = 0; x < Math.sqrt(grid_size); x++)
                for (var y = 0; y < Math.sqrt(grid_size); y++)
                    for (var z = 0; z < Math.sqrt(grid_size); z++) {
                        let pos = [2 * y, 2 * x, 2 * z];
                        let dir = [0, 0, 1];
                        spins.push(new Spin(pos, dir));
                }
            return new Grid(spins)
        } else {
            throw new Error("Grid size must be a number");
        }
    }

    static create_scirmion(grid_size = Number(document.getElementById('initN').value)){
        if (Number.isInteger(grid_size)){
            let t = .125 * Math.sqrt(grid_size);
            let spins = [];
            for (var z = 0; z < Math.sqrt(grid_size); z++)
                for (var y = 0; y < Math.sqrt(grid_size); y++)
                    for (var x = 0; x < Math.sqrt(grid_size); x++) {
                        let pos = [2 * x, 2 * y, 2 * z];
                        let a = x - Math.sqrt(grid_size) / 2,
                            r = y - Math.sqrt(grid_size) / 2,
                            o = a * a + r * r + t * t;
                        let dir = [-t * a / o, -t * r / o, (a * a + r * r - t * t) / o];
                        spins.push(new Spin(pos, dir));
                    }
            return new Grid(spins)
        } else {
            throw new Error("Grid size must be a number");
        }
    }
}