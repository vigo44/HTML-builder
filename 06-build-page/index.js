const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const rl = require('readline'); 

//create dir project-dist
let dirProject = path.join(__dirname, 'project-dist');
async function createDirProject(dirProject){
    await fsPromises.rm(dirProject, { recursive: true, force: true });
    await fsPromises.mkdir(dirProject, {recursive: true});
}

// copy Assets
let dirInput = path.join(__dirname, 'assets');
let dirOutput = path.join(dirProject, 'assets');

function copyFiles(dirInput, dirOutput) {
    fsPromises.readdir(dirInput,{ withFileTypes: true }).then(async listFiles =>{
        for (let file of listFiles){
            if (file.isFile()) {
                let inputFile = fs.createReadStream(path.join(dirInput, file.name));
                let outputFile = fs.createWriteStream (path.join(dirOutput, file.name));
                inputFile.pipe(outputFile);
            }
            if (file.isDirectory()){
                await fsPromises.mkdir(path.join(dirOutput, file.name), {recursive: true});
                copyFiles(path.join(dirInput, file.name), path.join(dirOutput, file.name),)
            }          
        } 
    },
    (err) => console.error(err));
}

function copyDir(dirInput, dirOutput){
    fsPromises.rm(dirOutput, { recursive: true, force: true })
    .then(() =>  fsPromises.mkdir(dirOutput, {recursive: true}), err => console.error(err))
    .then(() => copyFiles(dirInput, dirOutput), err => console.error(err));
}

// create style.css

let dirStyle = path.join(__dirname, 'styles');
let stylePath = path.join(dirProject, 'style.css');

async function createStyle (stylePath, dirStyle) {
    await fsPromises.rm(stylePath, { force: true });
    let outputFile = fs.createWriteStream (stylePath);
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

// create index.html
let htmlPath = path.join(dirProject, 'index.html');
let templatePatch = path.join(__dirname, 'template.html');
let componentsPatch = path.join(__dirname, 'components');
let componentData = [];

async function findComponents (componentsPatch) {

    await fsPromises.readdir(componentsPatch, { withFileTypes: true }).then(async listFile =>{
        for (let file of listFile){
            if (file.isFile()) {
                if (path.extname(file.name)==='.html'){
                    let componentObj = {name: path.parse(file.name).name, data: await fsPromises.readFile(path.join(componentsPatch, file.name), 'utf-8') };
                    
                    componentData.push(componentObj);
                }
            }
        }
    })
}    


function createHtml(htmlPath, templatePatch, componentsPatch){
    const outputTemplate = fs.createWriteStream(htmlPath, 'utf-8');
    const readIntwrfaceTemplate = rl.createInterface({ 
        input: fs.createReadStream(templatePatch, 'utf-8'), 
    });    
    readIntwrfaceTemplate.on('line', function(line) {
        let regTag = /{{.+}}/;
        if (line.match(regTag)!== null) {
            componentData.forEach((item) =>{
                if (line.match(regTag)[0].slice(2, -2) === item.name) {
                    outputTemplate.write(shiftText(item.data, line.match(regTag).index) + '\n');
                }
            });                             
          
        } else {
            outputTemplate.write(line + '\n');
        }
        
    });
     
};

function shiftText(text, valueShift){
   let arrText = text.split('\n');
   let spaceShift =' '.repeat(valueShift);
   let arrResult =[];
   arrText.forEach((line) => {
        arrResult.push(spaceShift + line);
   }) 
   return arrResult.join('\n'); 
};

let clearDir = createDirProject(dirProject);
clearDir.then(()=> copyDir(dirInput, dirOutput));
clearDir.then(()=> createStyle (stylePath, dirStyle));
clearDir
.then(()=> findComponents (componentsPatch))
.then(()=> createHtml(htmlPath, templatePatch, componentsPatch));
