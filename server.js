
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"]
  }
});

/* MongoDB */

mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* Message Model */

const Message = mongoose.model("Message",{
  user:String,
  msg:String
});

/* Users */

let users = [];

/* Socket */

io.on("connection", async (socket)=>{

  console.log("User connected");

  const messages = await Message.find();
  socket.emit("load_messages",messages);

  /* NEW USER */

  socket.on("new_user",(username)=>{

    if(!users.includes(username)){
      users.push(username);
    }

    io.emit("user_list",users);

  });

  /* SEND MESSAGE */

  socket.on("send_message", async (data)=>{

    const message = new Message({
      user:data.user,
      msg:data.msg
    });

    await message.save();

    io.emit("receive_message",data);

  });

  /* DELETE USER */

  socket.on("delete_user",(username)=>{

    users = users.filter(u => u !== username);

    io.emit("user_list",users);

  });

  socket.on("disconnect",()=>{
    console.log("User disconnected");
  });

});

server.listen(5000,()=>{
  console.log("Server running on port 5000");
});