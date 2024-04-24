class VEMSListener {

    grid = null
    display_grid = null
    ruler = {
        "cnt": 0,
        "spin_id": null
    }

    //TODO: разделить на уровни
    default_action = {
        "ruler": false,
        "swap": false,
        "dipol-dipol": false,
        "e_external": false,
        "anisotropy": false,
        "exchange": false,
        "dipol_dipol": false,
        "display_layer": false,
    }

    constructor() {
        this.grid = Grid.create_izing(10)
        this.grid.init_spins_neighbors();
        this.display_grid = this.grid;
        this.update()
    }

    set_grid(grid) {
        this.grid = grid;
        this.display_grid = this.grid;
        this.update()
    }

    update() {
        webglspins.updateSpins(this.display_grid.spins_pos, this.display_grid.spins_dir);
    }

    //TODO: добавить логику по обнулению подсчёта энергии 
    switch (key) {
        if (key in this.default_action) {
            this.default_action[key] = !this.default_action[key];
        } else {
            throw new Error("No such key in default_action");
        }
    }

    //TODO: вынести логику работы событий в отдельные функции
    action(event, args) {
        if (Object.keys(this.default_action)) {
            if (this.default_action.swap) {
                    this.grid.spins[args].swap_dir();
                    this.display_grid = this.grid;
                    this.update();
                }
            if (this.default_action.ruler){
                if (this.default_action[event]) {
                    if (this.ruler.cnt === 0) {
                        this.ruler.cnt++;
                        this.ruler.spin_id = args;
                    } else {
                        document.getElementById('ruler-value').value = distance_between_points(this.grid.spins[this.ruler.spin_id].pos_array,
                            this.grid.spins[args].pos_array);
                        this.ruler = {"cnt": 0, "spin_id": null}
                    }
                }
            }

            var temp_params = 0;

            if (this.default_action.e_external) {
                temp_params = document.getElementById("external_magnitude_value").value;
                var ext_spin = new Spin([0, 0, 0], [document.getElementById("ext_direction_x").value,
                                                   document.getElementById("ext_direction_y").value,
                                                   document.getElementById("ext_direction_z").value]);
                this.grid.energy.external_field = external_field(this.grid.spins, ext_spin, temp_params);
            }
            if (this.default_action.anisotropy) {
                temp_params = document.getElementById('anisotropy_magnitude_value').value;
                var an_spin = new Spin([0, 0, 0], [document.getElementById("ansp_direction_x").value,
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

            //TODO: вынести отдельно, в места где может измениться 
            this.grid.magnetization = magnetization(this.grid.spins);

            document.getElementById('display-magnetization').value = "M: " + Math.abs(this.grid.magnetization).toExponential(5);
            console.log(this.grid.energy);
            document.getElementById('display-energy').value = "E: " + Object.values(this.grid.energy).reduce((a,b) => a+b,0).toExponential(5);
        }
    }

}