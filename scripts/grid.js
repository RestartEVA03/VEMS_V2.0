class Grid{

    static default_length = 100;
    static default_width = 100;

    static default_distance_between_spins = 2;

    magnetization = 0;
    energy = {
        "dipol_dipol": 0, 
        "anisotropy": 0,
        "external_field": 0,
        "exchange": 0
    };

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
        var weight = [...this.spins.map(spin => spin.weight)]

        var max_pos = this.spins[weight.indexOf(Math.max(...weight))].pos_array,
            min_pos = this.spins[weight.indexOf(Math.min(...weight))].pos_array;

        var camera_x = (max_pos[0] + min_pos[0]) / 2,
            camera_y = (max_pos[1] + min_pos[1]) / 2;

        console.log("Initial CAMETA_POSITION:", camera_x, camera_y, 0);

        webglspins.updateOptions({cameraLocation: [camera_x, camera_y, Math.sqrt(this.spins_count) * Grid.default_distance_between_spins],
                                  centerLocation: [ camera_x,  camera_y, 0]});

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

    init_spins_neighbors(){
        if (this.spins == undefined) {
            throw new Error("Spins undefined");
        } 

        for (var spin of this.spins){
            for (var spin_2 of this.spins){
                var dist = distance_between_points(spin.pos_array, spin_2.pos_array);
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