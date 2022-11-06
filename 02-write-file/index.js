const path = require('path');
const fs = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

process.on('SIGINT', () => process.exit());

process.stdout.write ("Enter your text:\n");
process.stdin.on('data', (data) => {
    if (data.toString().trim() ==='exit'){
        process.exit();
    } else {
        output.write(data);
    }
});

process.on('exit', () => process.stdout.write("Goodbye!\n"));