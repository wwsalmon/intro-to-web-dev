const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Hello, World!");
});

server.listen(8080);