const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

function templateHTML(_title, _list, _body, _control) {
    let temp = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${_title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB1</a></h1>
                    ${_list}
                    ${_control}
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

                let template = templateHTML(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(template);

            });
        } else {
            fs.readdir('./data', (error, fileList) => {
                fs.readFile(`data/${queryData.id}`, `utf8`, (err, description) => {
                    let title = queryData.id;
                    let list = templateList(fileList);
                    let template = templateHTML(
                        title,
                        list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                    );
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else if (pathName === '/create') {
        fs.readdir('./data', (error, fileList) => {

            let title = 'WEB - create!';
            let list = templateList(fileList);
            let template = templateHTML(title, list, `
                <form action="http://localhost:3000/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                <input type="submit">
                </p>
                </form>
            `);
            response.writeHead(200);
            response.end(template);

        });
    } else if (pathName === '/create_process') {
        let body = '';
        request.on('data', (data) => {
            body = body + data;

            // 1e6 = 1_000_000
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', () => {
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end('ok!');
            });
        });
    } else if (pathName === '/update') {
        fs.readdir('./data', (error, fileList) => {
            fs.readFile(`data/${queryData.id}`, `utf8`, (err, description) => {
                let title = queryData.id;
                let list = templateList(fileList);
                let template = templateHTML(
                    title, 
                    list, 
                    `
                    <form action="http://localhost:3000/create_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="${title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
                response.writeHead(200);
                response.end(template);
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);