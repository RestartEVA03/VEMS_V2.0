class RWMfsys {
    static grid;

    static parse_mfsys(text) {
        let spins = [];
        let text_lines = text.split(/\r?\n/);

        for (let line_idx = text_lines.indexOf("[parts]") + 1; line_idx < text_lines.length; line_idx++) {
            let line = text_lines[line_idx].trim().split(/\s+/);
            if (line.length != 8) continue;
            let pos = line.slice(1, 4).map(str => parseFloat(str));
            let dir = line.slice(4, 7).map(str => parseFloat(str));
            let new_spin = new Spin(pos, dir);
            spins.push(new_spin);
        }
        return spins;
    }

    static async load_grid() {
        await RWMfsys.read_mfsys();
        event_listener.set_grid(RWMfsys.grid);
    }

    static read_mfsys() {
        return new Promise((resolve, reject) => {
            let input = document.getElementById('file-spins');
            if (!input.files.length) {
                reject(new Error("No file selected"));
                return;
            }
            let file = input.files[0];
            let reader = new FileReader();
    
            reader.onload = function() {
                RWMfsys.input_struct = reader.result;
                let spins = RWMfsys.parse_mfsys(reader.result);
                RWMfsys.grid = new Grid(spins);
                resolve();
            };
    
            reader.onerror = function() {
                reject(new Error("Error reading file"));
            };
    
            reader.readAsText(file);
        });
    }
}