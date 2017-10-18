/**
 * Created by lohitakshtrehan on 14/07/17.
 */
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketio(server);

old_record = [];
whoose_online = [];

app.use('/', express.static(__dirname + "/public_static"))

io.on('connection', (socket) => {

    let x;
    console.log("New client connected");





    socket.on('new_user',(data) =>{
        whoose_online.push({room_name:data,indi_id:socket.id});
        //first make him join a room
        socket.join(data);
        //here you can send the event of whoose_online
        //here fetch the old chat ,excluding those who are privately sent to other user
        //Ask Sir Here
        socket.emit('old_records',old_record);
        x=data;
    })




    socket.on('new_message', (data) => {
        if(data[0] != '@')
        {
            let chat = `${x} : ${data}`
            console.log(chat);
            old_record.push({msg: chat, from: {name: x, id: socket.id}, to: {individual: false, indi_room: null}})
            io.emit('recv_message', chat)
        }
        else{
            console.log("@ waala shuru hua");
            let chat = `${x} : ${data}`
            let roomm='';
            let i=1;
            while(data[i]!= " "){
                roomm+=data[i++];
            }
            if(roomm!='') {
                console.log(chat);
                old_record.push({msg: chat, from: {name: x, id: socket.id}, to: {individual: true, indi_room: roomm}})
                //send msg to a room
                socket.emit('recv_message',chat)
                io.to(roomm).emit('recv_message',chat);
            }
            else {
                socket.emit('empty_room',null);
            }
        }
    })


    socket.on('who_is_on',(data) =>{
        socket.emit('list_online',whoose_online)
    })


    //write a disconnect event
    socket.on('force_disconnect',(data) =>{
        socket.disconnect();
    })

    socket.on('disconnect', (reason) => {
        for(index in whoose_online)
        {
            if(whoose_online[index].indi_id==socket.id)
                whoose_online.splice(index,1);
        }
        console.log("disconnect");
    });



})


server.listen(1111, function () {   // USE git process.env.PORT instead of 1111 before dreploying to heroku
    console.log("Server started on http://localhost:1111");
});
