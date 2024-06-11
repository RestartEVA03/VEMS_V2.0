class Spin{

    pos = {x: .0, y: .0, z: .0}
    dir = {x: .0, y: .0, z: .0}
    length = 0
    neighbors = []
    
    uuid = uuidv4()
    __xy_weight = 0

    constructor(spin_pos, spin_dir){
        if (Array.isArray(spin_pos) && Array.isArray(spin_dir)){
            spin_pos = [...spin_pos];
            spin_dir = [...spin_dir];
            this.pos = {x: spin_pos[0], y: spin_pos[1], z: spin_pos[2]};
            this.dir = {x: spin_dir[0], y: spin_dir[1], z: spin_dir[2]};                                         
            this.length = Math.sqrt((spin_pos[0]+spin_dir[0])**2 + (spin_pos[1]+spin_dir[1])**2 + (spin_pos[2]+spin_dir[2])**2);
            this.__xy_weight = spin_pos[0] + spin_pos[1];
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

    deepCopySpin() {
        let newSpin = new Spin(Object.values(this.pos), Object.values(this.dir));
    
        newSpin.length = this.length;
        newSpin.__xy_weight = this.__xy_weight;
        newSpin.neighbors = this.neighbors.slice();
    
        newSpin.uuid = this.uuid;
    
        return newSpin;
    }
}