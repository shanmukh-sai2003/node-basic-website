const http = require("http");
const path = require("path");
const fs = require('fs/promises');

const server = http.createServer(async (request, response) => {
    const filePath = getFilePath(request.url);
    const contentType = getContentType(filePath);

    try {
        const content = await getFile(filePath);
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content);
    } catch (error) {
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end("<h1>Internal server error</h1>");
    }
});

async function getFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data;
    } catch (error) {
        if(error.code === 'ENOENT') {
            const data = await fs.readFile(getFilePath('404.html'), 'utf-8');
            return data;
        }
    }
}

function getFilePath(url) {
    let fileName = '';
    if(url === '/') {
        fileName = 'index.html';
    } else if(url === '/about') {
        fileName = 'about.html';
    } else if(url === '/contact-me') {
        fileName = 'contact-me.html';
    } else {
        fileName = url;
    }

    const filePath = path.join(__dirname, 'public', fileName);
    return filePath;
}


function getContentType(filePath) {
    const fileExtension = path.extname(filePath);
    if(fileExtension === '.html') {
        return 'text/html';
    } else if(fileExtension === '.css') {
        return 'text/css';
    } else if(fileExtension === '.js') {
        return 'text/js';
    } else if(fileExtension === '.json') {
        return 'application/json';
    } else if(fileExtension === '.jpg') {
        return 'image/jpg';
    } else {
        return 'text/html';
    }
}

server.listen(3030, () => {
    console.log("server is running...");
});