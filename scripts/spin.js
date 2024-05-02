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
            this.dir = {x: spin_dir[0], y: spin_dir[1], z: spin_dir[2]};                                                                                            // решил just for fun сделать расчёт длины вектора через map и reduce, считает правильно, но читается ...            
            this.length = Math.sqrt((spin_pos[0]+spin_dir[0])**2 + (spin_pos[1]+spin_dir[1])**2 + (spin_pos[2]+spin_dir[2])**2)                                     // this.length = Math.sqrt(spin_pos.map((x, i) => (x + spin_dir[i])**2).reduce((accumulator, currentValue) => accumulator + currentValue, 0));
            this.__xy_weight = spin_pos[0] + spin_pos[1]
        } else {
            throw new Error("Spin position must be a List");
        } 
        // console.log("SPIN:",this.pos, this.dir);
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
        // console.log(this);
        const newSpin = new Spin(Object.values(this.pos), Object.values(this.dir));
    
        newSpin.length = this.length;
        newSpin.__xy_weight = this.__xy_weight;
        // (Если это не так, потребуется более сложная логика копирования)
        newSpin.neighbors = this.neighbors.slice(); // поверхностная копия массива, если нужна глубокая, реализуйте её
    
        // UUID должен быть уникальным для каждого экземпляра, так что для нового объекта создаем новый UUID
        newSpin.uuid = this.uuid;
    
        return newSpin;
    }
}