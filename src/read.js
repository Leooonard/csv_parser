let parse = require('csv-parser');
let fs = require('fs');

function readCSV (csvPath, onRowRead, onEnd) {
    fs.createReadStream(csvPath, {
        encoding: 'utf-8'
    })
    .pipe(parse())
    .on('data', function(row) {
        onRowRead(row);
    })
    .on('end', function() {
        onEnd();
    });
}

module.exports = readCSV;
