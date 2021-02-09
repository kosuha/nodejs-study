let http = require('http');
let fs = require('fs');
let url = require('url');

function templateHTML(_title, _list, _body) {
    let temp = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${_title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${_list}
                    ${_body}
                    </body>
                    </html>
                `;
    return temp;
}

function templateList(_fileList) {
    let list = '<ol>';
    for (let i = 0; i < _fileList.length; i++) {
        list = list + `<li><a href="/?id=${_fileList[i]}">${_fileList[i]}</a></li>`;
    }
    list = list + '</ol>';

    return list;
}

let app = http.createServer((request, response) => {
    let requestUrl = request.url;
    let queryData = url.parse(requestUrl, true).query;
    let pathName = url.parse(requestUrl, true).pathname;

    if (pathName === '/') {
        if (queryData.id === undefined) {

            fs.readdir('./data', (error, fileList) => {

                let title = 'Welcome!';
                let description = 'Hello, Node.js!';
                let list = templateList(fileList);

                let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);

            });


        } else {
            fs.readdir('./data', (error, fileList) => {
                let list = templateList(fileList);

                fs.readFile(`data/${queryData.id}`, `utf8`, (err, description) => {
                    let title = queryData.id;
                    let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);