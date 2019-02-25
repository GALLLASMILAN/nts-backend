const express = require('express');
const app = express();
const port = 5100;
const fs = require('fs');
import * as path from 'path';
import * as mime from 'mime-types';
const cors = require('cors');

app.use(cors());
app.use(express.static('static'))
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/loaddir/:dir', (req, res) => {
    fs.readdir(getPrefix(req.params.dir), (err, items) => {
        if (err) 
            return res.status(403).json(err);

        items = items.map(item => {
            const fileSource = path.join(getPrefix(req.params.dir), item);
            const isDirectory = fs.lstatSync(fileSource).isDirectory();
            return {
                isDirectory: isDirectory,
                name: item,
                type: mime.lookup(fileSource),
                extension: mime.extension(mime.lookup(fileSource) || ''),
                //content: test(isDirectory, fileSource)
            }
        });
        return res.json({
            files: items,
            dir: req
                .params
                .dir
        });
    });
});

/*function test(isDirectory, fileSource) {
    if(isDirectory) {
        return 'fdafs';
    }
    //return fs.readFileSync(fileSource);
}*/
function getPrefix(dir) {
    return path.join(__dirname, '../', dir.replace('-', '/'));
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));