class VEMSListener {

    grid = null
    displayed_grid = null
    displayed_grid_origin = null

    mu_coef = 1

    default_action = {
        "ruler": false,
        "swap": false,
        "dipol-dipol": false,
        "external": false,
        "anisotropy": false,
        "exchange": false,
        "dipol_dipol": false,
        "displayed_layer": false,
    }

    ruler = {
        "cnt": 0,
        "spin_id": null
    }

    constructor() {
        this.grid = Grid.create_izing(20);
        console.log(this.grid);

        this.displayed_grid = new Grid(this.grid.spins.map(function(name) {
            return name.deepCopySpin();
          }));

        this.displayed_grid_origin = new Grid(this.grid.spins.map(function(name) {
            return name.deepCopySpin();
          }));  

        this.update(1)
    }

    set_grid(new_grid) {
        console.log("Just grid:", new_grid);
        this.grid = new_grid;
        
        this.displayed_grid = new Grid(new_grid.spins.map(function(name) {
            return name.deepCopySpin();
          }), 1);

        this.displayed_grid_origin = new Grid(new_grid.spins.map(function(name) {
            return name.deepCopySpin();
          }), 1);

        console.log("Display grid:",this.displayed_grid);
        this.update(1);
    }

    update(camera = 0) {
        webglspins.updateSpins(this.displayed_grid.spins_pos, this.displayed_grid.spins_dir);
        if (camera == 1){
            this.update_camera_loc(this.displayed_grid)
            this.grid.init_extremum();
        }
    }

    update_camera_loc(grid){
        console.log(grid);
        webglspins.updateOptions({cameraLocation: grid.cameraLocation,
            centerLocation: [grid.cameraLocation[0],
            grid.cameraLocation[1], 0]});
    }

    switch (key) {
        if (key in this.default_action) {
            this.default_action[key] = !this.default_action[key];
        } else {
            throw new Error("No such key in default_action");
        }
    }

    action(event, args) {
        console.log(event);
        if (Object.keys(this.default_action)) {
            if (this.default_action.swap && event == "swap") {
                    this.swap_spin(args);
                }
            if (this.default_action.ruler){
                if (this.default_action[event]) {
                    this.display_ruler(args);
                }
            }
            if (this.default_action.displayed_layer && event == "displayed_layer") {
               this.display_layer();
            }

            this.display_energy();
            this.grid.magnetization = magnetization(this.grid.spins);

            document.getElementById('display-magnetization').value = "M: " + Math.abs(this.grid.magnetization).toExponential(5);

        }
    }

    display_ruler(args){
        if (this.ruler.cnt === 0) {
            this.ruler.cnt++;
            this.ruler.spin_id = args;
        } else {
            document.getElementById('display-distance').value = Math.abs(distance_between_points(this.grid.spins[this.ruler.spin_id].pos_array,
                this.grid.spins[args].pos_array)).toExponential(5);
            this.ruler = {"cnt": 0, "spin_id": null}
        }
    }

    display_layer(){
        console.log(this.grid);
        let extr= get_extremum();
        console.log(extr);
        let new_spins = [];

        // for (let spin of this.displayed_grid_origin.spins) {
        //     if ((spin.pos.x >= extr.x.min && spin.pos.x <= extr.x.max) &&
        //         (spin.pos.y >= extr.y.min && spin.pos.y <= extr.y.max) &&
        //         (spin.pos.z >= extr.z.min && spin.pos.z <= extr.z.max)){
        //             new_spins.push(spin);
        //         }
        // }

        
        for (let ind in this.grid.spins) {
            console.log(this.grid.spins[ind].pos);
            console.log(extr);
            if ((this.grid.spins[ind].pos.x >= extr.x.min && this.grid.spins[ind].pos.x <= extr.x.max) &&
                (this.grid.spins[ind].pos.y >= extr.y.min && this.grid.spins[ind].pos.y <= extr.y.max) &&
                (this.grid.spins[ind].pos.z >= extr.z.min && this.grid.spins[ind].pos.z <= extr.z.max)){
                    new_spins.push(this.displayed_grid_origin.spins[ind].deepCopySpin());
                }
        }

        console.log(this.grid);

        this.displayed_grid = new Grid(new_spins);
        console.log("Display grid:",this.displayed_grid);
        this.update();
        
        console.log(this.displayed_grid);
        console.log(Object.is(this.displayed_grid.spins[0], this.grid.spins[0]));
        // this.displayed_grid = new Grid(new_spins);
        // this.update();
    }

    swap_spin(args){
        this.displayed_grid.spins[args].swap_dir();

        let origin_ind = [...this.grid.spins.map(spin => spin.uuid)].indexOf(this.displayed_grid.spins[args].uuid);

        this.displayed_grid_origin.spins[origin_ind].swap_dir();
        this.grid.spins[origin_ind].swap_dir();

        this.update();
    }

    display_energy(){
        let temp_params;
        if (this.default_action.external) {
            temp_params = document.getElementById("external_magnitude_value").value;
            let ext_spin = new Spin([0, 0, 0], [document.getElementById("ext_direction_x").value,
                                               document.getElementById("ext_direction_y").value,
                                               document.getElementById("ext_direction_z").value]);
            this.grid.energy.external_field = external_field(this.grid.spins, ext_spin, temp_params);
        }
        if (this.default_action.anisotropy) {
            temp_params = document.getElementById('anisotropy_magnitude_value').value;
            let an_spin = new Spin([0, 0, 0], [document.getElementById("ansp_direction_x").value,
                                               document.getElementById("ansp_direction_y").value,
                                               document.getElementById("ansp_direction_z").value]);
            this.grid.energy.anisotropy = anisotropy(this.grid.spins, an_spin, temp_params);
        }
        if (this.default_action.exchange) {
            temp_params = document.getElementById('exchange_value').value;
            this.grid.energy.exchange = exchange(this.grid.spins, temp_params);
        }
        if (this.default_action.dipol_dipol) {
            temp_params = document.getElementById('dipol_radius').value;
            this.grid.energy.dipol_dipol = dipol_dipol(this.grid.spins, temp_params);
        }
        document.getElementById('display-energy').value = "E: " + Object.values(this.grid.energy).reduce((a,b) => a+b,0).toExponential(5);
    }

    display_axis(ind){
        console.log(this.grid.spins[ind]);
        document.getElementById('display-xy').value = "X:" + this.grid.spins[ind].pos.x + " Y:" + this.grid.spins[ind].pos.y + " Z:" + this.grid.spins[ind].pos.z;
    }

    init_struct(arg){
        let grid;
        switch (arg){
            case 'izing':
                console.log("IZING");
                grid = Grid.create_izing();
                break;
            case 'pher':
                console.log("PHER");
                grid = Grid.create_ferromagnetic();
                break;
            case 'scirmion':
                console.log("Scirmion");
                grid = Grid.create_scirmion();
                break;
            case 'rnd_model':
                console.log("RND");
                grid = Grid.create_grid_rnd();
                break;
            default:
                throw Error("Structure not declared");
        }
        event_listener.set_grid(grid);
    }
}