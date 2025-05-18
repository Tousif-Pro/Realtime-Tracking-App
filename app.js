const express  = require ('express')
const app = express();
const http = require('http');
const path = require("path")
//setup of socket io 
const socketio = require("socket.io");
const server = http.createServer(app);

const io = socketio(server);

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")));
io.on("connection", function(socket){
    console.log("User connected:", socket.id);
    socket.on("send-location", function(data) {
        // Emit to all clients except the sender
        socket.broadcast.emit("receive-location", { id: socket.id, ...data });
        console.log(`Sending location: ${data.latitude}, ${data.longitude}`);
    });
    console.log("connected");
    socket.on("disconnect",function(){
        console.log("User disconnected:", socket.id);
        io.emit("user-disconnect",socket.id)
    })
})

app.get("/", function(req,res){
    res.render("index");
})

server.listen(3000);