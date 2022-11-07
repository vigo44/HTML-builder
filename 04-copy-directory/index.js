const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
let dirCurrent = path.join(__dirname, 'files');
let dirCopy = path.join(__dirname, 'files-copy');

function copyFiles(dirCurrent, dirCopy) {
    fsPromises.readdir(dirCurrent,{ withFileTypes: true }).then(listFiles =>{
        for (let file of listFiles){
            if (file.isFile()) {
                let inputFile = fs.createReadStream(path.join(dirCurrent, file.name));
                let outputFile = fs.createWriteStream (path.join(dirCopy, file.name));
                inputFile.pipe(outputFile);
            }          
        } 
    },
    (err) => console.error(err));
}

function copyDir(dirCurrent, dirCopy){
    fsPromises.rm(dirCopy, { recursive: true, force: true })
    .then(() =>  fsPromises.mkdir(dirCopy, {recursive: true}), err => console.error(err))
    .then(() => copyFiles(dirCurrent, dirCopy), err => console.error(err));
}

copyDir(dirCurrent, dirCopy);

