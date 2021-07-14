// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    switch (req.method) {
        case "GET":
            switch (req.url) {
                case "/":
                    res.writeHead(200);
                    res.end("Hello, World!");
                    break;
                case "/items":
                    const itemsData = JSON.parse(fs.readFileSync(__dirname + "/../db/data.json"));
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(itemsData.data));
                    break;
                default:
                    res.writeHead(200);
                    res.end("Custom route: " + req.url);
            }
            break;
        case "POST":
            if (req.url.substr(1)) {
                let itemsData = JSON.parse(fs.readFileSync(__dirname + "/../db/data.json"));
                itemsData.data.push({name: decodeURIComponent(req.url.substr(1))});
                fs.writeFileSync(__dirname + "/../db/data.json", JSON.stringify(itemsData));
            }

            res.writeHead(200);
            res.end("Success");
            break;
    }
});

server.listen(8080);