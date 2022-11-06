const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

fsPromises.readdir(path.join(__dirname, 'secret-folder'),{ withFileTypes: true }).then(listFile =>{
    for (let file of listFile){
        if (file.isFile()) {
            let extFile = path.extname(file.name).slice(1);
            let nameFile = path.parse(file.name).name;
            fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
                console.log(`${nameFile} - ${extFile} - ${stats.size}b`);
            });
            
        }
    }
})
