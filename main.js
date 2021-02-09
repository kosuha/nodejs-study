let http = require('http');
let fs = require('fs');
let url = require('url');

let app = http.createServer((request, response) => {
    let requestUrl = request.url;
    let queryData = url.parse(requestUrl, true).query;
    let pathName = url.parse(requestUrl, true).pathname;
    


    if (pathName === '/') {
        if (queryData.id === undefined) {
            let title = 'Welcome!';
            let description = 'Hello, Node.js!';
            let template = `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                <ol>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ol>
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
            `;
            response.writeHead(200);
            response.end(template);
        } else {
            fs.readFile(`data/${queryData.id}`, `utf8`, (err, description) => {
                let title = queryData.id;
                let template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    <ol>
                        <li><a href="/?id=HTML">HTML</a></li>
                        <li><a href="/?id=CSS">CSS</a></li>
                        <li><a href="/?id=JavaScript">JavaScript</a></li>
                    </ol>
                    <h2>${title}</h2>
                    <p>${description}</p>
                    </body>
                    </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        }
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);