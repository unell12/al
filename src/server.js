import express from "express";
import WebSocket from "ws";
import http from 'http';

const app = express();

app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})
app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

const handleListen = () => console.log(`Listening on http://localhost:3000/`)

const server = http.createServer(app);
const wss = new WebSocket.Server({ server })

const convert = (data) => {
    const bufferOriginal = Buffer.from(data);
    const result = bufferOriginal.toString('utf8');
    return result;
  };


const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket)
    socket["nickname"] = "anonimus troll"
    console.log("브라우저와 연결되었습니다")
    socket.on("close", () => console.log("브라우저와의 연결이 해제되었습니다"))
    socket.on('message', (message) => {
        const parsed = JSON.parse(message)
        console.log(parsed + ", " + socket.nickname)
        switch(parsed.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${parsed.payload}`))
                break
            case "nickname":
                socket["nickname"] = parsed.payload
                console.log("hm")
        }
    })
})

server.listen(3000, handleListen)