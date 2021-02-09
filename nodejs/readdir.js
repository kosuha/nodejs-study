const testFolder = '../data/';
const fs = require('fs');

fs.readdir(testFolder, (error, fileList) => {
    console.log(fileList);
})