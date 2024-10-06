const { Server } = require("socket.io");

let onlineUsers = [];

const io = new Server({ cors: "http://localhost:5173/" });

io.on("connection", (socket) => {
  console.log("new connection from socket :", socket.id);

  socket.on("addNewUser", (userId)=>{
    if(!userId)
      return;
    const userExists = onlineUsers.some((user) => user.userId === userId) 
    if(!userExists) {
      newUser = {userId: userId, socketId: socket.id};
      onlineUsers.push(newUser); 
      io.emit("getOnlineUsers", onlineUsers);
      console.log("updated online users", onlineUsers);
    }
  });

  socket.on("newMessage", (message) =>{
      const suser = onlineUsers.find(user => user.userId === message.recipientId);
      
      if(suser){
        io.to(suser.socketId).emit("getMessage", message);
        io.to(suser.socketId).emit("getNotification", {
          senderId: message.senderId,
          isRead: false,
          date: new Date(),
        });
      }
  });
  
  socket.on("disconnect", () =>{
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("user disconnected", socket.id);
    console.log("updated online users", onlineUsers);
  });
});

io.listen(3000);