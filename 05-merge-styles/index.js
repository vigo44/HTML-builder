const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
let dirStyle = path.join(__dirname, 'styles');
let bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function createBundel (bundlePath, dirStyle) {
    await fsPromises.rm(bundlePath, { force: true });
    let outputFile = fs.createWriteStream (bundlePath);
    fsPromises.readdir(dirStyle,{ withFileTypes: true }).then(listFiles =>{
        for (let file of listFiles){
            if (file.isFile() && (path.extname(file.name) === ".css")) {
                let inputFile = fs.createReadStream(path.join(dirStyle, file.name));                
                inputFile.pipe(outputFile);
            }          
        } 
    },
    (err) => console.error(err));    
}

createBundel (bundlePath, dirStyle);