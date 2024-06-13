import server from "../index"
import 'socket.io'
import {Server} from 'socket.io'

console.log("server :",server);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000",
      methods: ["GET", "POST"],
    },
  
});

  io.on('connection',(socket)=>{
    console.log(`User Connected ${socket.id}`);

   socket.on('join_room',(room)=>{
    socket.join(room);
   })

   socket.on('send',(data)=>{
    
    socket.to(data.room).emit('receive',data);
    
   })


  })


