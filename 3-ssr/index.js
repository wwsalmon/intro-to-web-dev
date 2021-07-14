// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
        switch (req.url) {
            case "/": {
                const itemsData = JSON.parse(fs.readFileSync(__dirname + "/../db/data.json"));
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(`
<!doctype html>
<html lang="en">
<head>
<title>Document</title>
<style>
    body {
        max-width: 500px;
        margin: 32px auto;
        font-family: sans-serif;
    }
</style>
</head>
<body>
<h1>3. Server-side rendered webapp</h1>
<p>This page is generated on the server. That means you can load in dynamic content, pulled from a non-hard-coded source.</p>
<p>This is how older webapps written in PHP or Python/Django work.</p>
<hr/>
<h2>Todo list</h2>
<input type="text" id="textfield"/>
<button id="addbutton">Add item</button>
<ul>
    ${itemsData.data.map(item => `<li>${item.name}</li>`).join("")}
</ul>
<script>
        const addButton = document.getElementById("addbutton");
        const textInput = document.getElementById("textfield");

        addButton.addEventListener("click", () => {
            const addString = textInput.value;
            window.location.href = "http://localhost:8080/post/" + encodeURIComponent(addString);
        });
</script>
</body>
</html>
                `);
                break;
            }
            default:
                if (req.url.substr(0, 6) === "/post/") {
                    let itemsData = JSON.parse(fs.readFileSync(__dirname + "/../db/data.json"));
                    itemsData.data.push({name: req.url.substr(6)});
                    fs.writeFileSync(__dirname + "/../db/data.json", JSON.stringify(itemsData));
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(200);
                    res.end(`
<!doctype html>
<html lang="en">
<head>
<title>Document</title>
<style>
    body {
        max-width: 500px;
        margin: 32px auto;
        font-family: sans-serif;
    }
</style>
</head>
<body>
<h1>Item added: ${decodeURIComponent(req.url.substr(6))}</h1>
<a href="http://localhost:8080/">Back to list</a>
</body>
</html>
                `);
                    break;
                } else {
                    res.writeHead(200);
                    res.end("Custom route: " + req.url);
                }
        }
    }
);

server.listen(8080);