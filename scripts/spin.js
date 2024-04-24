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

    swap_dir(){
        this.dir = {x: -this.dir.x, y: -this.dir.y, z: -this.dir.z}
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